<?php
//include config
require_once('php/config.php');

//process login form if submitted
if(isset($_POST['submit'])){

	if (!isset($_POST['username'])) $error[] = "Please fill out all fields";
	if (!isset($_POST['password'])) $error[] = "Please fill out all fields";

	$username = $_POST['username'];
	if ( $user->isValidUsername($username)){
		if (!isset($_POST['password'])){
			$error[] = 'A password must be entered';
		}
		$password = $_POST['password'];

		if($user->login($username, $password)){
			echo $user->getSessionID($username);
			
			exit;
		}
		else {
			$error[] = 'Wrong username or password or your account has not been activated.';
		}
	}
	else {
		$error[] = 'Usernames are required to be Alphanumeric, and between 3-16 characters long';
	}
}//end if submit
else {
	$error[] = 'this is not a post request';
}

echo $error;
exit;