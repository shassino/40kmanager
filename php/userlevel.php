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
    foreach($post->users as $user){
        $queryString = 'UPDATE levels SET level="'.$user->level.'" WHERE username="'.$user->name.'"';
        $query = $db->prepare($queryString);
        $query->execute();
        error_log("Query: ".$queryString);
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>