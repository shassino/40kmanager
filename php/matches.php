<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $matches = array();
}

class Match {
    public $p1;
    public $p2;
    public $round;
    public $matchId;
}

$response = new Response; //init the empty object

try{
    switch ($post->operation) {
        case "delete":
            include('includes/requireAdmin.php');
            /* get the active championship name and rules */
            foreach($post->matches as $match){
                $queryString = 'DELETE from matches WHERE matchID="'.$match.'"';
                error_log("Query: ".$queryString);
                $query = $db->prepare($queryString);
                $query->execute();
            }
            break;
        case "add":
            include('includes/requireAdmin.php');
            $queryString = 'INSERT into matches (p1,p2,round,played) VALUES("'.$post->p1.'","'.$post->p2.'","'.$post->round.'",0)';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            break;
        case "list":
            include('includes/requireSession.php');
            /* get the matches of the championship */
            $queryString = 'SELECT p1,p2,round,matchId FROM matches ORDER BY round';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();

            while ($row = $query->fetch()) {
                $match = new Match;
                $match->p1 = $row['p1'];
                $match->p2 = $row['p2'];
                $match->round = $row['round'];
                $match->matchId = $row['matchId'];
                array_push($response->matches, $match);
            }
            break;
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>