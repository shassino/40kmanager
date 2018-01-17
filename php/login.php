<?php
error_reporting(E_ALL);
ini_set("error_log", "/home/manager40k/php_errors.log");
ini_set("display_errors", "On");

require_once('config.php');
$error = "";
$post = json_decode(file_get_contents('php://input'));

if (!isset($post->username)){
	print("Please fill out all fields");
	exit;
}

if (!isset($post->password)){
	print("Please fill out all fields");
	exit;
}

if ( $user->isValidUsername($post->username)){
	
	if($user->login($post->username, $post->password)){
		echo $user->setSessionID($post->username);
		exit;
	}
	else {
		$error = 'Wrong username or password or your account has not been activated.';
	}
}
else {
	$error = 'Usernames are required to be Alphanumeric, and between 3-16 characters long';
}

print("Error: ".$error);
?>