<?php
//debug mode
error_reporting(E_ALL);
ini_set("error_log", "/home/manager40k/php_errors.log");
//ini_set("display_errors", "On");

ob_start();

session_start();

//set timezone
date_default_timezone_set('Europe/Rome');

//database credentials
define('DBHOST','localhost');
define('DBUSER','manager40k');
define('DBPASS','manager40k');
define('DBNAME','manager40k');

//application address
define('DIR','http://lafondazionetorino.it/40kmanager/');
define('SITEEMAIL','noreply@lafondazionetorino.it');

try {

    //create PDO connection
    $db = new PDO("mysql:host=".DBHOST.";charset=utf8mb4;dbname=".DBNAME, DBUSER, DBPASS);
    
    //$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);//Suggested to uncomment on production websites
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);//Suggested to comment on production websites
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch(PDOException $e) {
	//show error
    echo '<p class="bg-danger">'.$e->getMessage().'</p>';
    exit;
}

//include the user class, pass in the database connection
include('includes/user.php');
include('includes/utils.php');
include('phpmailer/mail.php');
$user = new User($db);
?>
