<?php
session_start();
class afferent {
	//	获取get，post的值数组
	function __get($key) {
		$ret = isset ( $_POST [$key] ) ? $_POST [$key] : false;
		if (! $ret && strlen ( $ret ) == 0) {
			$ret = isset ( $_GET [$key] ) ? $_GET [$key] : false;
			if (! $ret) {
				$ret = '';
			}
		}
		return $ret;
	}
}
?>