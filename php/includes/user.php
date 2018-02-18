<?php
include('password.php');
class User extends Password{

    private $_db;

    function __construct($db){
    	parent::__construct();

    	$this->_db = $db;
    }

	private function get_user_hash($username){

		try {
			$queryString = 'SELECT password, username, memberID FROM members WHERE username="'.$username.'"';
			$query = $this->_db->prepare($queryString);
			$query->execute();

			return $query->fetch();

		} 
		catch(PDOException $e) {
		    echo '<p>get_user_hash: '.$e->getMessage().'</p>';
		}
	}

	public function isValidUsername($username){
		if (strlen($username) < 3) return false;
		if (strlen($username) > 17) return false;
		if (!ctype_alnum($username)) return false;
		return true;
	}

	public function login($username, $password){
		if (!$this->isValidUsername($username)){
			return false;
		}

		if (strlen($password) < 3){
			return false;
		}

		$row = $this->get_user_hash($username);

		if($this->password_verify($password, $row['password']) == 1){
		    return true;
		}
		return false;
	}

	public function logout($session){
		$user = $this->getUserFromSessionID($session);
		try {
			$query = $this->_db->prepare('DELETE FROM sessions WHERE uuid="'.$session.'"');
			$query->execute();
			echo 'OK';
		} 
		catch(PDOException $e) {
			echo '<p>deleteExpiredSessions: '.$e->getMessage().'</p>';
		}
	}

	public function setSessionID($username){
		$uuid = uniqid();
		$this->deleteExpiredSessions();
		try {
			$queryString = 'INSERT INTO sessions (username, uuid, expire) VALUES("'.$username.'", "'.$uuid.'", NOW() + INTERVAL 2 HOUR)';
			$query = $this->_db->prepare($queryString);
			$query->execute();
		} 
		catch(PDOException $e) {
			echo '<p>setSessionID: '.$e->getMessage().'</p>';
			return;
		}

		return $uuid;
	}
	
	public function getUserFromSessionID($uuid){
		$this->deleteExpiredSessions();
		error_log("Received uuid: ".$uuid);
		try {
			$queryString = 'SELECT username FROM sessions WHERE uuid="'.$uuid.'"';
			error_log("Query: ".$queryString);
			$query = $this->_db->prepare($queryString);
			$query->execute();
			$result = $query->fetch();
			return $result['username'];
		} 
		catch(PDOException $e) {
		    error_log('getUserFromSessionID: '.$e->getMessage());
		}
	}

	private function deleteExpiredSessions(){
		try {
			$query = $this->_db->prepare('DELETE FROM sessions WHERE expire < NOW()');
			$query->execute();
		} 
		catch(PDOException $e) {
			echo '<p>deleteExpiredSessions: '.$e->getMessage().'</p>';
		}
	}

	public function getUserLevel($uuid){
		$username = $this->getUserFromSessionID($uuid);
		error_log("Got username: ".$username);
		try {
			$query = $this->_db->prepare('SELECT level FROM levels WHERE username="'.$username.'"');
			$query->execute();
			$result = $query->fetch();
			error_log("Got level: ".$result['level']);
			return $result['level'];
		} 
		catch(PDOException $e) {
			error_log('getUserLevel: '.$e->getMessage());
		}
	}
}
?>
