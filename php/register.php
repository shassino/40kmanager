<?php 
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

class Response {
	public $status = "OK";
}

$response = new Response;
include('includes/requireAdmin.php');

if (!isset($post->username)){
	$response->status = 'Error: Please fill out all fields';
	SendJson($response);
}
	
if (!isset($post->password)){
	$response->status = 'Error: Please fill out all fields';
	SendJson($response);
}

if (!isset($post->passwordCopy)){
	$response->status = 'Error: Please fill out all fields';
	SendJson($response);
}

if (!isset($post->email)){
	$response->status = 'Error: Please fill out all fields';
	SendJson($response);
}

if ($post->password != $post->passwordCopy){
	$response->status = 'Error: Password do not match';
	SendJson($response);
}

//very basic validation
if(!$user->isValidUsername($post->username)){
	$response->status = 'Error: Usernames must be at least 3 Alphanumeric characters';
	SendJson($response);
} 
else {
	$query = $db->prepare('SELECT username FROM members WHERE username = :username');
	$query->execute(array(':username' => $post->username));
	$row = $query->fetch(PDO::FETCH_ASSOC);

	if(!empty($row['username'])){
		$response->status = 'Error: Username provided is already in use.';
		SendJson($response);
	}
}

if(strlen($post->password) < 3){
	$response->status = 'Error: Password is too short.';
	SendJson($response);
}

//email validation
if(!filter_var($post->email, FILTER_VALIDATE_EMAIL)){
	$response->status = 'Error: Please enter a valid email address';
	SendJson($response);
} 
else {
	$query = $db->prepare('SELECT email FROM members WHERE email = :email');
	$query->execute(array(':email' => $post->email));
	$row = $query->fetch(PDO::FETCH_ASSOC);

	if(!empty($row['email'])){
		$response->status = 'Error: Email provided is already in use.';
		SendJson($response);
	}
}


//hash the password
$hashedpassword = $user->password_hash($post->password, PASSWORD_BCRYPT);

try {
	//insert into database with a prepared statement
	$query = $db->prepare('INSERT INTO members (username,password,email) VALUES (:username, :password, :email)');
	$query->execute(array(
		':username' => $post->username,
		':password' => $hashedpassword,
		':email' => $post->email,
	));
	error_log("Created user: ".$post->username);

	//insert a default inactive level to the user
	$query = $db->prepare('INSERT INTO levels (username,level) VALUES ("'.$post->username.'", '.Levels::Inactive.')');
	$query->execute(array());
	error_log("Assigned to user the level : ".Levels::Inactive);
} 
catch(PDOException $e) {
	//else catch the exception and show the error.
	$response->status = 'Error: '.$e->getMessage();
}

SendJson($response);
?>
