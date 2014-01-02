<?php
include_once 'DB/valueGet.php';
include_once 'DB/fileModel.php';
class userLogin {
	//	登录验证
	function login($arr) {
		$user = new userModel ();
		$result = $user->login ( $arr->user, $arr->pwd );
		if ($result != "密码错误！" && $result != "用户名错误！") {
			if (($_SESSION ['uid']) == NULL) {
				$insertUID = new userDetail ();
				$find = $insertUID->findUid ( + $result ); //判断用户ID是否存在
				if (! $find) { //不存在则插入用户ID
					if ($insertUID->insertUid ( + $result )) {
						$_SESSION ['uid'] = $result;
						echo (json_encode ( array ("re" => 1 ) ));
					} else
						echo (json_encode ( array ("re" => "数据初始化失败！请重试" ) ));
				} else {
					$_SESSION ['uid'] = $result;
					exit ( json_encode ( array ("re" => 1 ) ) );
				}
			} else
				exit ( json_encode ( array ("re" => "你已登陆过！" ) ) );
		
		} else
			exit ( json_encode ( array ("re" => $result ) ) );
	}
	//	登陆后用户信息获取
	function logined() {
		if (isset ( $_SESSION ['uid'] )) {
			$user = new userDetail ();
			$num=$user->docNum(+$_SESSION ['uid']);
			$result = $user->userData ( $_SESSION ['uid'] );
			$result["doc"]=$num;
			echo (json_encode ( $result ));
		} else {
			echo (json_encode ( array ("re" => 0 ) ));
		}
	}
	//获取session的值.
	function session() {
		echo isset ( $_SESSION ['uid'] ) ? json_encode ( array ("re" => 1 ) ) : (json_encode ( array ("re" => 0 ) ));
	}
	function logOut() {
		unset ( $_SESSION ['uid'] );
		echo isset ( $_SESSION ['uid'] ) ? json_encode ( array ("re" => 1 ) ) : (json_encode ( array ("re" => 0 ) ));
	}
}
$afferent = new afferent ();
$user = new userLogin ();
if (! $afferent->fid && ! $afferent->req)
	echo ("请求链接非法");
else {
	if (! $afferent->req) {
		//cookie登陆
		if (! isset ( $_SESSION ['uid'] )) {
			if (isset ( $_COOKIE ['wenkuser'] ) && isset ( $_COOKIE ['wenkupwd'] )) {
				$user = new userModel ();
				$result = $user->login ( $_COOKIE ['wenkuser'], $_COOKIE ['wenkupwd'] );
				if (is_numeric ( $result )) {
					$_SESSION ['uid'] = $result;
				}
			}
		}
		$fileIfo = new fileModel ();
		$fileData = $fileIfo->fileDetail ( $afferent->fid );
		//浏览次数递增
		$scan=new fileModel();
		$scan->scanNumAdd($afferent->fid);
		include_once ('../html/view.html');
	} else
		call_user_func_array ( array ($user, $afferent->req ), array ($afferent ) );
}
?>