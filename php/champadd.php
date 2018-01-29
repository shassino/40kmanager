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
    /* deactivate previous championships */
    $queryString = 'UPDATE championship SET active=0 WHERE active=1';
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();

    $queryString = 'SELECT name FROM championship WHERE name="'.$post->name.'"';
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();
    $result = $query->fetch();

    if ($result == $post->name){
        $response->status = "Error: a championship with this name already exist";
        SendJson($response);
    }

    $queryString = 'INSERT into championship (name,active) VALUES("'.$post->name.'",1)';
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>