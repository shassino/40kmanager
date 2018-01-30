<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
}

$response = new Response; //init the empty object

include('includes/requireAdmin.php');

try {
    if ($post->operation == "delete"){
        /* get the active championship name and rules */
        foreach($post->days as $day){
            $queryString = 'DELETE from days WHERE name="'.$day.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
        }
    }
    else if ($post->operation == "add"){
        $queryString = 'INSERT into days (name,championship) VALUES("'.$post->name.'","'.$post->championship.'")';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
    }
    else {
        $response->status = "Error: wrong operation or no operation selected";
        SendJson($response);
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>