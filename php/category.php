<?php
include_once 'DB/valueGet.php';
include_once 'DB/fileModel.php';
$get=new afferent();
$kind=new fileModel();
$arry=$kind->kind_s($get->kid);
$res=json_decode($arry);
//列表菜单
$list="";
for($i=0;$i<count($res[1]);$i++){
	$list.="<div class='list'><h2><a href='".$res[1][$i]."'>".$res[0][$i]."</a></h2></div>";
}
//文件总数
$Num=$kind->allNum();
// 精品文档
$topDoc=$kind->category_find($get->kid);
$top_list=array();
while ($row=mysql_fetch_array($topDoc)){
	$top_list[$row['id']]=$row['name'];
}
$re_list='';
foreach ($top_list as $key=>$name){
	$re_list.="<dl><dt><a href='view.php?fid=".$key."'><img src='../html/exp.jpg'/></a></dt><dd><a href='view.php?fid=".$key."'>".$name."</a></dd></dl>";
}
//最近上传
$new_load=$kind->newUpload($get->kid);
$newload=array();
while ($row=mysql_fetch_array($new_load)){
	$newload[$row['id']]=$row['name'];
}
$new_list="";
foreach ($newload as $key=>$name){
	$new_list.="<dl><dt><a href='view.php?fid=".$key."'><img src='../html/exp.jpg'/></a></dt><dd><a href='view.php?fid=".$key."'>".$name."</a></dd></dl>";
}
//热门文集
$hot_doc=$kind->hotDoc($get->kid);
$hot=array();
while ($row=mysql_fetch_array($hot_doc)){
	$hot[$row['id']]=$row['name'];
}
$hot_list="";
foreach ($hot as $key=>$name){
	$hot_list.="<li><a href=view.php?fid='".$key."'>".$name."</a></li>";
}
include_once '../html/category.html';
?>