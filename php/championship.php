<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $name;
}

$response = new Response; //init the empty object

try {
    switch ($post->operation){
    default:
        $response->status = "Error: wrong operation or no operation selected";
        break;
        
    case "setrules":
        include('includes/requireAdmin.php');
        $queryString = 'UPDATE championship SET rules='.$db->quote($post->rules).' WHERE active=1';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        break;

    case "getcurrent":
        $queryString = 'SELECT name from championship WHERE active=1';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        $row = $query->fetch();
        $response->name = $row['name'];
        break;
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>