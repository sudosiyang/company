<?php 
session_start();
include_once 'DB/ValidateCode.php';
$rsi = "";
$code = "";
$rsi = new Utils_Caption();
$rsi->TFontSize=array(21,18);
$rsi->Width=90;
$rsi->Height=32;
$code = $rsi->RandRSI();
$_SESSION["checkcode"] = $code;
$rsi->Draw();
exit;
?>