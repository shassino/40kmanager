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
    $queryString = 'UPDATE championship SET rules='.$db->quote($post->rules).' WHERE active=1';
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>