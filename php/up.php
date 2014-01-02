<?php
$session_id = $_GET ['sessionid'];
if ($session_id && $session_id != session_id ()) {
	session_id ( $session_id );
}
include_once 'DB/valueGet.php';
include_once 'DB/fileModel.php';
include_once 'DB/file.php';
$file = new fileModel ();
$md5 = md5_file ( $_FILES ["Filedata"] ["tmp_name"] );
if ($file->md5Check ( $md5 )) {
	echo 2; //文件存在
} else {
	if ($_SESSION ['uid'] == null) {
		echo 0;
	} else {
		$fileHandel = new file ();
		$extention = $fileHandel->file_extension ();
		$path = "../file/user/" . $_SESSION ['uid'] . '/' . $extention;
		$fileHandel->createFolder ( $path );
		$filename = date ( "Ymdhis" ) . rand ( 100, 999 );
		$destination = $path . '/' . $filename . '.' . $extention;
		if (move_uploaded_file ( $_FILES ["Filedata"] ["tmp_name"], $destination )) {
			$get = new afferent ();
			$filedata = array ();
			array_push ( $filedata, $md5, $get->size, $extention, $destination );
			$_SESSION ['file'] = $filedata;
			echo 1; // 移动成功
		} else
			echo 0; // 移动失败
	}
}
?>