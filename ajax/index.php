<?php
	include_once "ajax.php";
	session_start();
	class afferent {
		//	获取get，post的值数组
		function __get($key) {
			$ret = isset ( $_POST [$key] ) ? $_POST [$key] : false;
			if (! $ret && strlen ( $ret ) == 0) {
				$ret = isset ( $_GET [$key] ) ? $_GET [$key] : false;
				if (! $ret) {
					$ret = '';
				}
			}
			return $ret;
		}
	}
	$get = new afferent ();
	function login($array){
		$todo = new Todo();
	  	echo json_encode($todo->login($array->name,$array->pwd));
	}
	function a_login($array){
		$todo = new Todo();
	  	echo json_encode($todo->a_login($array->name,$array->pwd));
	}
	function department($array){
		$todo = new Todo();
		echo json_encode($todo->department());
	}
	function getTask($array){
		$todo = new Todo();
		echo json_encode($todo->getTask($array->uid));
	}
	function collage($array){
		$todo = new Todo();
		echo json_encode($todo->getCollage());
	}
	function complete($array){
		$todo = new Todo();
		echo json_encode($todo->complete($array->t_id));
	}
	function publish($array){
		$todo = new Todo();
		echo json_encode($todo->publish($array->u_id,$array->title,$array->details,$array->p_id));
	}
	call_user_func_array ( $get->req, array ($get) );
?>