<?php
include_once 'DB/file.php';
include_once 'DB/valueGet.php';
include_once 'DB/userModel.php';
include_once 'DB/fileModel.php';
$get = new afferent ();
$down = new fileModel ();
$dfile = new file ();
$user = new userDetail ();
$fid = $get->fid;
$down->downNumAdd ( $fid ); // 下载量+1
$ifo = $down->downIfo ( $fid ); //下载文件信息
if ($ifo ['need'] != 0) {
	if ($_SESSION ['uid'] == null)
		exit ( '<script>history.go(-1)</script>' ); //未登录
	else {
		if ($user->getWealth ( $_SESSION ['uid'] ) < $ifo ['need'])
			exit ( '<script>alert("您的积分不足");history.go(-1);</script>' ); //积分不足
		else {
			if ($_SESSION ['uid'] != $ifo ['uid']) {
				$user->userPoint ( $ifo ['uid'], $ifo ['need'] );
				$user->userPoint ( $_SESSION ['uid'], - $ifo ['need'] );
			}
			$dfile->download_file ( $ifo ['name'] . '.' . $ifo ['style'], $ifo ['url'] );
		}
	}
} else
	$dfile->download_file ( $ifo ['name'] . '.' . $ifo ['style'], $ifo ['url'] );
?>