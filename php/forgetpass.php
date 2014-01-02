<?php
include_once 'DB/valueGet.php';
include_once 'DB/userModel.php';
$get = new afferent ();
function index() {
	include_once '../html/forgetpass.html';
}
function usercheck() {
	$get = new afferent ();
	if (strtolower ( $_SESSION ['checkcode'] ) == strtolower ( $get->code )) {//验证码是否正确
		$user = new userModel ();
		if ($user->findname ( $get->name )) {//如果存在则下一步
			$_SESSION ['name'] = $get->name;
			include_once '../html/forgetsafe.html';
		} else {
			include_once '../html/forgetpass.html';
			echo "<script>error.name();</script>";
		}
	} else {
		include '../html/forgetpass.html';
		echo "<script>error.code();</script>";
	}
}
function safe() {
	$get = new afferent ();
	$user = new userModel ();
	if ($_SESSION ['name'] == null) {//非法进入则结束
		exit ( include_once '../html/forgetpass.html' );
		return ;
	} else {
		;
	}
	if($user->studentID($_SESSION ['name'])==$get->student){//如果学号验证成功
		$_SESSION ['student'] = '1';
		include_once '../html/forgetchange.html';
	}else {
		include_once '../html/forgetsafe.html';
		echo "<script>error.sid();</script>";
	}
}
function change() {
	if(isset($_SESSION['name'])&&isset($_SESSION['student'])){//验证成功允许修改密码
		$get = new afferent ();
		$user=new userModel();
		if($user->changePwd(md5($get->pwd), $_SESSION['name'])){
			echo "<script>alert('成功')</script>";
		}else{
			echo "<script>alert('失败')</script>";
		}
	}else {
		include_once '../html/forgetpass.html' ;
	}
}
if (! $get->action) {
	$get->action = 'index';
} else {
	;
}
call_user_func ( $get->action );
?>