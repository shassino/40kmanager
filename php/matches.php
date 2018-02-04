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
    public $day;
    public $obj1;
    public $obj2;
    public $lost1;
    public $lost2;
    public $report;
    public $played;
    public $matchId;
}

$response = new Response; //init the empty object

try{
    switch ($post->operation) {
        case "delete":
            include('includes/requireAdmin.php');
            $queryString = 'DELETE from matches WHERE matchID="'.$post->matchId.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            SendJson($response);
            return;
        case "add":
            include('includes/requireAdmin.php');
            $queryString = 'INSERT into matches (p1,p2,day,played) VALUES("'.$post->p1.'","'.$post->p2.'","'.$post->day.'",0)';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            SendJson($response);
            return;
        case "result":
            include('includes/requireAdmin.php');
            $queryString = 'UPDATE matches SET played=1, obj1='.$post->obj1.', obj2='.$post->obj2.', lost1='.$post->lost1.', lost2='.$post->lost2.' WHERE matchId="'.$post->matchId.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            SendJson($response);
            return;
        case "list":
            include('includes/requireSession.php');
            /* get the matches of the championship */
            $queryString = 'SELECT p1,p2,day,matchId,obj1,obj2,lost1,lost2,report,played FROM matches ORDER BY day';
            break;
        case "player":
            include('includes/requireSession.php');
            /* get the requester match of the championship */
            $queryString = 'SELECT p1,p2,day,matchId,obj1,obj2,lost1,lost2,report,played FROM matches WHERE p1="'.$post->player.'" OR p2="'.$post->player.'" ORDER BY day';
            break;
        case "single":
            include('includes/requireSession.php');
            /* get the requester match of the championship */
            $queryString = 'SELECT p1,p2,day,matchId,obj1,obj2,lost1,lost2,report,played FROM matches WHERE matchId="'.$post->matchId.'" ORDER BY day';
            break;
        default:
            $response->status = "Error: wrong operation or no operation selected";
            SendJson($response);
            break;
    }
    error_log("Query: ".$queryString);
    $query = $db->prepare($queryString);
    $query->execute();

    while ($row = $query->fetch()){
        $match = new Match;
        $match->p1 = $row['p1'];
        $match->p2 = $row['p2'];
        $match->day = $row['day'];
        $match->obj1 = $row['obj1'];
        $match->obj2 = $row['obj2'];
        $match->lost1 = $row['lost1'];
        $match->lost2 = $row['lost2'];
        $match->report = $row['report'];
        $match->played = $row['played'];
        $match->matchId = $row['matchId'];
        array_push($response->matches, $match);
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>