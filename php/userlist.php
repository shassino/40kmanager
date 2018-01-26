<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $users = array();
}

$response = new Response; //init the empty object
include('includes/requireAdmin.php');

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