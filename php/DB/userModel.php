<?php
include_once 'DataBase.php';
class userModel extends DataBase {
	function userModel($host = "localhost", $user = "root", $pwd = "", $dbname = "user") {
		parent::__construct ( $host, $user, $pwd, $dbname );
	}
	function login($name, $pwd) {
		$sql = "select * from user where username='$name'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		if (! $result)
			return "用户名错误！";
		if ($result ['pwd'] == $pwd) {
			return $result ['id'];
		} else
			return "密码错误！";
	}
	//  获取用户名
	function username($uid) {
		$sql = "select username from user where id=$uid";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return $result ["username"];
	}
	// 查找用户名是否存在	
	function findname($name) {
		$sql = "select * from user where username='$name'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		if ($result) //存在返回1
			return 1;
		else
			return 0;
	}
	//  注册用户
	function reginst($name, $pwd, $student) {
		$pwd_new = md5 ( $pwd );
		$sql = "INSERT INTO user (username,pwd,studentid) values ('$name','$pwd_new','$student')";
		if ($this->insert ( $sql )){
			return true;
		}
		else
			return false;
	}
	//获取studentID
	function studentID($name) {
		$sql = "select studentid from user where username='$name'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return $result ["studentid"];
	}
	//修改密码
	function changePwd($pwd, $name) {
		$sql = "UPDATE user SET pwd='$pwd' WHERE username='$name'";
		if ($this->update ( $sql )) {
			return true;
		} else
			return false;
	}
}

//用户详细信息类
class userDetail extends DataBase {
	//	通过UID来查找用户信息
	function userData($uid) {
		$sql = "select * from user where uid= +$uid";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		$level = $this->userLevel ( + $result ['empirical'] ); //等级查询
		$user = new userModel ();
		$username = $user->username ( + $uid );
		$data = array ("user" => $username, "empirical" => + $result ['empirical'], "lv" => $level ["lv"], "title" => $level ["title"], "wealth" => + $result ['wealth'],"doc"=>0);
		return $data;
	}
	//等级查询
	private function userLevel($emp) {
		$sql = "select title,lv from level where level=(SELECT MAX(level) FROM level WHERE value<=+$emp)";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return array ("lv" => $result ["lv"], "title" => $result ["title"] );
	}
	//等级上限查询
	 function userLimit($emp) {	
		$sql = "select MIN(value) from level where level>(SELECT MAX(level) FROM level WHERE value<=+$emp)";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return $result[0];
	}
	//财富值查询
	public function wealthToatl($uid) {
		$sql = "select wealth from user where uid= +$uid";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return array ("re" => $result ['wealth'] );
	}
	//文档数查询
	public function docNum($uid) {
		$sql = "select count(*) from down_ifo where uid= $uid";
		$result=mysql_query($sql);
		$row=mysql_fetch_array($result);
		return $row[0];
	}
	//查询用户UID
	public function findUid($uid) {
		$sql = "select * from user where uid='$uid'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		if ($result) //存在返回1
			return 1;
		else
			return 0;
	}
	//插入用户UID
	public function insertUid($uid) {
		$sql = "INSERT INTO user (uid) values (+$uid)";
		if ($this->insert ( $sql )) {
			return true;
		} else
			return false;
	}
	//用户积分处理
	public function userPoint($uid, $point) {
		$sql = "UPDATE user SET wealth=wealth+$point WHERE uid=$uid";
		if ($this->update ( $sql )) {
			return true;
		} else
			return false;
	}
	//用户积分
	public function getWealth($uid) {
		$sql = "select * from user where uid= +$uid";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return $result ['wealth'];
	}
}
?>