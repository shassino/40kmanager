<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $name;
    public $rules;
    public $rounds = array();
}

$response = new Response; //init the empty object

include('includes/requireAdmin.php');
try {
    /* get the active championship name and rules */
    $queryString = 'SELECT name,rules FROM championship WHERE active=1';
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();
    $result = $query->fetch();
    if ($result['name'] == ""){
        $response->status = 'ERROR: no championship found in db';
        SendJson($response);
    }

    $response->name = $result['name'];
    $response->rules = $result['rules'];

    /* get the rounds of the above championship */
    $queryString = 'SELECT name FROM rounds WHERE championship="'.$response->name.'"';
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();

    while ($row = $query->fetch()) {
        array_push($response->rounds, $row['name']);
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}
SendJson($response);
?>