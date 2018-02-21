<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
    public $users = array();
}

$response = new Response; //init the empty object

class Profile {
    public $status = "OK";
    public $username = "";
    public $faction;
    public $armyname;
    public $list;
    public $tokens;
}

$profile = new Profile;

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

    case "setlevel":
        include('includes/requireAdmin.php');
        foreach($post->users as $user){
            $queryString = 'UPDATE levels SET level="'.$user->level.'" WHERE username="'.$user->name.'"';
            $query = $db->prepare($queryString);
            $query->execute();
            error_log("Query: ".$queryString);
        }
        break;

    case "getprofile":
        $queryString = 'SELECT username, faction, armyname, list, tokens FROM profiles WHERE username="'.$post->username.'"';
        $query = $db->prepare($queryString);
        $query->execute();

        $row = $query->fetch();
        if ($row){
            $profile->username = $row['username'];
            $profile->faction = $row['faction'];
            $profile->armyname = $row['armyname'];
            $profile->list = $row['list'];
            $profile->tokens = $row['tokens'];
        }

        SendJson($profile);
        break;

    case "setprofile":
        include('includes/requireSession.php');
        $queryString = 'SELECT username, tokens FROM profiles WHERE username="'.$username.'"';
        $query = $db->prepare($queryString);
        $query->execute();

        $row = $query->fetch();
        if ($row){
            $tokens = $row['tokens'];
            if ($tokens > 0){
                $tokens -= 1;
                $queryString = 'UPDATE profiles SET armyname="'.$post->armyname.'", list='.$db->quote($post->list).', tokens='.$tokens.' WHERE username="'.$username.'"';
            }
            else {
                $response->status = "Error: no more update tokens availables";
                break;
            }
        }
        else {
            $queryString = 'INSERT into profiles (faction,tokens,username) VALUES("'.$post->faction.'", 2,"'.$username.'")';
        }

        $query = $db->prepare($queryString);
        $query->execute();

        break;
    }
} 
catch(PDOException $e) {
    $response->status = $e->getMessage();
}

SendJson($response);
?>