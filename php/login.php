<?php
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
    public $status = "OK";
	public $session = "";
	public $level = -1;
}

$response = new Response;

if (!isset($post->username)){
	$response->status = "Error: Please fill out all fields";
	SendJson($response);
}

if (!isset($post->password)){
	$response->status = "Error: Please fill out all fields";
	SendJson($response);
}

if ( $user->isValidUsername($post->username)){
	
	if($user->login($post->username, $post->password)){
		$response->session = $user->setSessionID($post->username);
		$response->level = $user->getUserLevel($response->session);
	}
	else {
		$response->status = 'Error: Wrong username or password or your account has not been activated.';
	}
}
else {
	$response->status = 'Error: Usernames are required to be Alphanumeric, and between 3-16 characters long';
}

SendJson($response);
?>