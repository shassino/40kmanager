<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
}

$response = new Response; //init the empty object

if (!isset($post->session)){
    $response->status = "Error: session missing";
    SendJson($response);
}

if ($post->session == ""){
    $response->status = "Error: session missing";
    SendJson($response);
}

if ($user->getUserLevel($post->session) != Levels::Admin){
    $response->status = "Error: User level is not Admin";
    SendJson($response);
}

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