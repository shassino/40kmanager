<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
}

$response = new Response; //init the empty object

try {
    switch ($post->operation) {
    case "password":
        include('includes/requireSession.php');
        if (!isset($post->password)){
            $response->status = 'Error: Please fill out all fields';
            SendJson($response);
        }

        if (!isset($post->passwordCopy)){
            $response->status = 'Error: Please fill out all fields';
            SendJson($response);
        }

        if ($post->password != $post->passwordCopy){
            $response->status = 'Error: Password do not match';
            SendJson($response);
        }
        //hash the password
        $hashedpassword = $user->password_hash($post->password, PASSWORD_BCRYPT);
        $queryString = 'UPDATE members SET password="'.$hashedpassword.'" WHERE username="'.$username.'"';
        error_log($queryString);
        $query = $db->prepare($queryString);
        $query->execute();
        break;
        
    case "username":
        break;
    }
}
catch(PDOException $e) {
    $response->status = 'ERROR: '.$e->getMessage();
}

SendJson($response);
?>