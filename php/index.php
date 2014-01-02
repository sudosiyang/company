<?php
include_once 'DB/valueGet.php';
include_once 'DB/fileModel.php';
function index() {
	if (! isset ( $_SESSION ['uid'] )) {
		if (isset ( $_COOKIE ['wenkuser'] ) && isset ( $_COOKIE ['wenkupwd'] )) {
			$user = new userModel ();
			$result = $user->login ( $_COOKIE ['wenkuser'], $_COOKIE ['wenkupwd'] );
			if (is_numeric ( $result )) {
				$_SESSION ['uid'] = $result;
			}
		}
	}
	// 专业资料
	$major_list=lists(1);
	$term_list=lists(2);
	$new_list=newLists();
	include_once '../html/home.html';
}
$get = new afferent ();
if (isset ( $get )) {
	$get->req = 'index';
}
function lists($fid){
	$kind=new fileModel();
	$new_load=$kind->category_find($fid,6);
	$newload=array();
	while ($row=mysql_fetch_array($new_load)){
		$newload[$row['id']]=$row['name'];
	}
	$new_list="";
	foreach ($newload as $key=>$name){
		$new_list.="<li><a href='view.php?fid=".$key."'>".$name."</a></li>";
	}
	return $new_list;
}
function newLists(){
	$kind=new fileModel();
	$new_load=$kind->newAllUpload();
	$newload=array();
	while ($row=mysql_fetch_array($new_load)){
		$newload[$row['id']]=$row['name'];
	}
	$new_list="";
	foreach ($newload as $key=>$name){
		$new_list.="<li><a href='view.php?fid=".$key."'>".$name."</a></li>";
	}
	return $new_list;
}
call_user_func_array ( $get->req, array ($get ) );
?>