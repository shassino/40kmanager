<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $users = array();
}

$response = new Response; //init the empty object

try {
    switch ($post->operation){
    default:
        $response->status = "Error: wrong operation or no operation selected";
        break;
        
    case "listWithLev":
        include('includes/requireAdmin.php');
        $query = $db->prepare('SELECT username,level FROM levels ORDER BY username');
        $query->execute();
        $results = array();
        while ($row = $query->fetch()) {
            if ($row['username'] != "root"){
                $newItem = new stdClass();
                $newItem->name = $row['username'];
                $newItem->level = $row['level'];
                $response->users[] = $newItem;
            }
        }
        break;

    case "list":
        $query = $db->prepare('SELECT username,level FROM levels ORDER BY username');
        $query->execute();
        $results = array();
        while ($row = $query->fetch()) {
            if ($row['username'] != "root"){
                if ($row['level'] != Levels::Inactive){
                    array_push($response->users, $row['username']);
                }
            }
        }
        break;
    }
} 
catch(PDOException $e) {
    $response->status = $e->getMessage();
}

SendJson($response);
?>