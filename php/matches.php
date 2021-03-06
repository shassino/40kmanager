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
    public $res1;
    public $res2;
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
            $queryString = 'INSERT into matches (p1,p2,day,played,round) VALUES("'.$post->p1.'","'.$post->p2.'","'.$post->day.'",0,"'.$post->round.'")';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            SendJson($response);
            return;
        case "result":
            include('includes/requireAdmin.php');
            $queryString = 'UPDATE matches SET played=NOW(), res1='.$post->res1.', res2='.$post->res2.', obj1='.$post->obj1.', obj2='.$post->obj2.', sec1='.$post->sec1.', sec2='.$post->sec2.', lost1='.$post->lost1.', lost2='.$post->lost2.' WHERE matchId="'.$post->matchId.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            SendJson($response);
            return;
        case "report":
            include('includes/requireAdmin.php');
            $queryString = 'UPDATE matches SET report='.$db->quote($post->report).' WHERE matchId="'.$post->matchId.'"';
            error_log("Query: ".$queryString);
            $query = $db->prepare($queryString);
            $query->execute();
            SendJson($response);
        case "list":
            /* get the matches of the championship */
            $queryString = 'SELECT * FROM matches ORDER BY day';
            break;
        case "player":
            /* get the requester match of the championship */
            $queryString = 'SELECT * FROM matches WHERE p1="'.$post->player.'" OR p2="'.$post->player.'" ORDER BY day';
            break;
        case "round":
            /* get the requester match of the championship */
            $queryString = 'SELECT * FROM matches WHERE round="'.$post->round.'" ORDER BY day';
            break;
        case "single":
            /* get the requester match of the championship */
            $queryString = 'SELECT * FROM matches WHERE matchId="'.$post->matchId.'" ORDER BY day';
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
        //error_log(var_export($row, true));
        $match = new Match;
        $match->p1 = $row['p1'];
        $match->p2 = $row['p2'];
        $match->day = $row['day'];
        $match->obj1 = $row['obj1'];
        $match->obj2 = $row['obj2'];
        $match->sec1 = $row['sec1'];
        $match->sec2 = $row['sec2'];
        $match->lost1 = $row['lost1'];
        $match->lost2 = $row['lost2'];
        $match->res1 = $row['res1'];
        $match->res2 = $row['res2'];
        $match->report = $row['report'];
        $match->played = $row['played'];
        $match->matchId = $row['matchID'];
        $match->round = $row['round'];
        array_push($response->matches, $match);
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>