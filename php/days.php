<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $day;
    public $championship;
}

$response = new Response; //init the empty object

try {
    switch ($post->operation){
    case "delete":
        include('includes/requireAdmin.php');
        /* get the active championship name and rules */
        foreach($post->days as $day){
            $queryString = 'DELETE from days WHERE name="'.$day.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
        }
        break;
    case "add":
        include('includes/requireAdmin.php');
        $queryString = 'INSERT into days (name,championship) VALUES("'.$post->name.'","'.$post->championship.'")';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        break;
    case "get":
        $queryString = 'SELECT name,championship FROM days WHERE name="'.$post->name.'"';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        $row = $query->fetch();
        $response->day = $row['name'];
        $response->championship = $row['championship'];
        break;
    default:
        $response->status = "Error: wrong operation or no operation selected";
        SendJson($response);
        break;
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>