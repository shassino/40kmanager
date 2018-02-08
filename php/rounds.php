<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $users = array();
    public $rounds = array();
}

$response = new Response; //init the empty object

try {
    switch ($post->operation){
    default:
        $response->status = "Error: wrong operation or no operation selected";
        break;

    case "delete":
        include('includes/requireAdmin.php');
        /* get the active championship name and rules */
        foreach($post->rounds as $round){
            $queryString = 'DELETE from rounds WHERE name="'.$round.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
        }
        break;

    case "add":
        include('includes/requireAdmin.php');
        $queryString = 'INSERT into rounds (name,championship) VALUES("'.$post->name.'","'.$post->championship.'")';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        break;

    case "list":
        $queryString = 'SELECT name FROM rounds WHERE championship="'.$post->championship.'" ORDER BY name';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();

        while ($row = $query->fetch()) {
            array_push($response->rounds, $row['name']);
        }
        break;

    case "adduser":
        include('includes/requireAdmin.php');
        foreach($post->rounds as $round){
            foreach($post->users as $user){
                $queryString = 'INSERT into userInRounds (user,round) VALUES("'.$user.'","'.$round.'")';
                error_log("Query: ".$queryString);
                $query = $db->prepare($queryString);
                $query->execute();
            }
        }

        /* delete dupes */
        $queryString = 'DELETE t1 FROM userInRounds t1 INNER JOIN userInRounds t2 WHERE t1.userID < t2.userID AND t1.round = t2.round AND t1.user = t2.user';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        break;

    case "listusers":
        $queryString = 'SELECT user from userInRounds WHERE round="'.$post->round.'" ORDER BY user';
        error_log("Query: ".$queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        while ($row = $query->fetch()){
            array_push($response->users, $row['user']);
        }
        array_push($response->rounds, $post->round);
        break;
        
    case "delusers":
        include('includes/requireAdmin.php');
        foreach($post->rounds as $round){
            foreach($round->users as $user){
                $queryString = 'DELETE from userInRounds WHERE round="'.$round->name.'" AND user="'.$user.'"';
                error_log("Query: ".$queryString);
                $query = $db->prepare($queryString);
                $query->execute();
            }
        }

        break;
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>