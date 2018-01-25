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
    $tables = array("members", "levels");
    foreach($post->users as $user){
        foreach($tables as $table){
            $queryString = 'DELETE FROM '.$table.' WHERE username="'.$user.'"';
            $query = $db->prepare($queryString);
            $query->execute();
            error_log("Query: ".$queryString);
        }
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>