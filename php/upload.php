<?php
include_once 'DB/valueGet.php';
include_once 'DB/userModel.php';
include_once 'DB/fileModel.php';
include_once 'DB/file.php';
$get = new afferent ();
if ($get->req == null) {
	if ($_SESSION ['uid'] != null) {
		$user = new userDetail ();
		$result = $user->userData ( $_SESSION ['uid'] );
		include_once '../html/upload.html';
	} else {
		echo ("<script>alert('请登录后进行上传');location.href='../php';</script>");
	}
} else
	call_user_func_array ( $get->req, array ($get ) );
function kind_one() {
	$kind = new fileModel ();
	echo $kind->kind ( 0 );
}
function kind_second($arr) {
	$kind = new fileModel ();
	echo $kind->kind_s ( $arr->kid );
}
function submit($arry) {
	if (isset ( $_SESSION ['uid'] ) && isset ( $_SESSION ['file'] )) {
		$file = new fileModel ();
		$insert_id = $file->add_file ( $arry->name, $arry->key, $_SESSION ['file'] [2], $_SESSION ['file'] [1], $_SESSION ['file'] [0], $arry->kind );
		if ($insert_id) {
			if ($file->add_downfile ( $insert_id, $_SESSION ['file'] [3], + $arry->price, $_SESSION ['uid'] )) {
				return 1;
			} else {
				return 0;
			}
		}
	} else {
		echo json_encode ( array ("data" => - 1 ) );
	}
}
function delete(){
	$file=new file();
	echo $file->delete_file( $_SESSION ['file'] [3]);
}
?>