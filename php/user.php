<?php
include_once 'DB/userModel.php';
include_once 'DB/fileModel.php';
session_start();
if(isset($_SESSION['uid'])){
	$userInfo=new userDetail();
	$info=$userInfo->userData($_SESSION['uid']);
	$user=new userDetail();
	$docNum=$user->docNum($_SESSION['uid']);
	$info['doc']=$docNum;
	$user1=new userDetail();
	$limit=$user1->userLimit($info['empirical']);
	$length=124*$info["empirical"]/$limit;//经验条长度
	$file=new fileModel();
	//用户文档列表
	$list='';
	$Doc=$file->userDoc($_SESSION['uid']);
	while ($row=mysql_fetch_array($Doc)){
		$list.= "<div class='_list'><div class='gd-title gd'><a href='view.php?fid=".$row['id']."'>".$row['name']."</a></div><div class='gd-download gd'>".$row['downNum']."</div><div class='gd-need gd'>".$row['need']."</div><div class='gd-time gd'>".$row['time']."</div></div>";
	}
	//文档下载数
	$downNum=$file->DownAllNum($_SESSION['uid']);
	include_once '../html/user.html';
}else echo ("<script>alert('请登录后进行上传');location.href='../php';</script>");
?>