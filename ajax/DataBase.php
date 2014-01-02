<?php
/*
 *	mysql数据库 DB类
 *	@package	DB
 *	@author		susu
 *	@version	2013-01-15
 *	@copyrigth	 
 */
class DataBase {
	private  $host; //定义成员变量，数据库服务器   
	private $user; //定义成员变量，服务器用户名   
	private $pwd; //定义成员变量，服务器密码   
	private $dbname; //定义数据库名称
	private $debug; //定义返回错误信息   
	private $conn; //定义返回的连接标识 
	private $dbhalt; //错误处理
	var $result; // 执行query命令的结果资源标识
	var $num_rows; // 返回的条目数
	var $insert_id; // 传回最后一次使用 INSERT 指令的 ID
	var $affected_rows; // 传回query命令所影响的列数目
	// INSERT、UPDATE 或 DELETE 所影响的列 (row) 数目。
	// delete 如果不带where，那么则返回0
	function __construct($host = "127.0.0.1", $user = "root", $pwd = "ZAQ@123", $dbname = "todos", $debug = true) {
		$this->host = $host;
		$this->user = $user;
		$this->pwd = $pwd;
		$this->dbname = $dbname;
		$this->debug = $debug;
		$this->connect ();
	}
	//  数据库连接类    
	private function connect() {
		$this->conn = mysql_connect ( $this->host, $this->user, $this->pwd );
		if (! $this->conn) {
			$this->dbhalt ( "不能连接数据库！" );
		}
		if (! $R = mysql_select_db ( $this->dbname, $this->conn )) {
			$this->dbhalt ( "数据库不可用！" );
		}
		mysql_query ( "set names utf8" );
	}
	//  出错处理  
	private function dbhalt($errmsg) {
		$msg = "数据库有问题!";
		$msg = $errmsg;
		echo "$msg";
		die ();
	}
	
	//执行SQL语句,返回结果资源id
	public function execute($sql) {
		$this->result = mysql_query ( $sql );
		return $this->result;
	}
	
	//获取数组-索引和关联
	public function fetchArray() {
		if($this->result){
			return mysql_fetch_array ( $this->result );
		}else{
			return null;
		}
	}
	
	//获取关联数组
	public function fetchAssoc() {
		return mysql_fetch_assoc ( $this->result );
	}
	
	//获取数字索引数组
	public function fetchIndexArray() {
		return mysql_fetch_row ( $this->result );
	}
	
	//获取对象数组
	public function fetchObject() {
		return mysql_fetch_object ( $this->result );
	}
	
	//返回记录行数
	function numRows() {
		return mysql_num_rows ( $this->result );
	}
	
	//删
	function delete($sql) {
		$result = $this->execute ( $sql );
		$this->affected_rows = mysql_affected_rows ( $this->conn );
		$this->free_result ( $result );
		return $this->affected_rows;
	}
	
	//增
	function insert($sql) {
		$this->execute ( $sql );
		$this->insert_id=mysql_insert_id();
		return $this->affected_rows = mysql_affected_rows ();
	}
	
	//改
	function update($sql) {
		$result = $this->execute ( $sql );
		$this->affected_rows = mysql_affected_rows ();
		return $this->affected_rows;
	}
	
	//关闭连接
	function dbclose() {
		mysql_close ( $this->conn );
	}
} // end class
?>