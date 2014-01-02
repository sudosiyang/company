<?php
include_once 'DB/valueGet.php';
include_once 'DB/userModel.php';
class reg {
	function checkname($arr) {
		$checkuser = new userModel ();
		echo json_encode ( array ('re' => $checkuser->findname ( $arr->name ) ) );
	}
	function regin($arr) {
		if (strtolower ( $arr->code ) == strtolower ( $_SESSION ["checkcode"] )) {
			$reg = new userModel ();
			echo $reg->reginst ( $arr->user, $arr->pwd, $arr->student ) ? json_encode ( array ("re" => 1 ) ) : json_encode ( array ("re" => - 1 ) );
		} else
			echo json_encode ( array ("re" => 0 ) );
	}
}
$r = new afferent ();
$reg = new reg ();
if ($r->req)
	call_user_func_array ( array ($reg, $r->req ), array ($r ) );
else
	echo file_get_contents('../html/reg.html');
?>