<?php 
require_once('includes/config.php');

$error = "";
$post = json_decode(file_get_contents('php://input'));

if (!isset($post->session)){
	echo 'Error: Please fill out all fields';
	exit;
}

if (!isset($post->username)){
	echo 'Error: Please fill out all fields';
	exit;
}
	
if (!isset($post->password)){
	echo 'Error: Please fill out all fields';
	exit;
}

if (!isset($post->passwordCopy)){
	echo 'Error: Please fill out all fields';
	exit;
}

if (!isset($post->email)){
	echo 'Error: Please fill out all fields';
	exit;
}

if ($post->password != $post->passwordCopy){
	echo 'Error: Password do not match';
	exit;
}

//very basic validation
if(!$user->isValidUsername($post->username)){
	echo 'Error: Usernames must be at least 3 Alphanumeric characters';
	exit;
} else {
	$query = $db->prepare('SELECT username FROM members WHERE username = :username');
	$query->execute(array(':username' => $post->username));
	$row = $query->fetch(PDO::FETCH_ASSOC);

	if(!empty($row['username'])){
		echo 'Error: Username provided is already in use.';
		exit;
	}
}

if(strlen($post->password) < 3){
	echo 'Error: Password is too short.';
	exit;
}

//email validation
if(!filter_var($post->email, FILTER_VALIDATE_EMAIL)){
	echo 'Error: Please enter a valid email address';
	exit;
} else {
	$query = $db->prepare('SELECT email FROM members WHERE email = :email');
	$query->execute(array(':email' => $post->email));
	$row = $query->fetch(PDO::FETCH_ASSOC);

	if(!empty($row['email'])){
		echo 'Error: Email provided is already in use.';
		exit;
	}
}


//hash the password
$hashedpassword = $user->password_hash($post->password, PASSWORD_BCRYPT);

try {
	//insert into database with a prepared statement
	$query = $db->prepare('INSERT INTO members (username,password,email,active) VALUES (:username, :password, :email, :active)');
	$query->execute(array(
		':username' => $post->username,
		':password' => $hashedpassword,
		':email' => $post->email,
		':active' => 'Yes'
	));
	$id = $db->lastInsertId('memberID');

	echo 'OK';
} 
catch(PDOException $e) {
	//else catch the exception and show the error.
	print('Error: '.$e->getMessage());
}

?>
