<?php 
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

if (!isset($post->session)){
	print("Error: session invalid");
	exit;
}

//logout
$user->logout($post->session); 
?>