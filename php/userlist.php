<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $users = array();
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

$result = $user->getUsersAndLevels();

foreach($result as $row){
    if ($row['username'] != "root"){
        $newItem = new stdClass();
        $newItem->name = $row['username'];
        $newItem->level = $row['level'];
        $response->users[] = $newItem;
    }
}

SendJson($response);
?>