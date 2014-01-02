<?php
include_once "DataBase.php";
$user=new DataBase();
$sql="select * from user";
$user->execute($sql);
$result=$user->fetchArray();
echo $result["uid"];
?>