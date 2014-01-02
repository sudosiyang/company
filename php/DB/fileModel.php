<?php
include_once 'DataBase.php';
include_once 'userModel.php';
include_once 'file.php';
class fileModel extends DataBase {
	function fileDetail($fid) {
		$sql = "select * from view where id='$fid'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		$user = new userModel ();
		$username = $user->username ( + $result ["uid"] );
		$file = new file ();
		$size = $file->format_bytes ( + $result ['size'] );
		return array ("name" => $result ["name"], "name_fu" => $result ["name_fu"], "url" => $result ["url"], "uid" => $result ["uid"], "username" => $username, "scanNum" => + $result ["scanNum"], "downNum" => + $result ["downNum"], "style" => $result ["style"], "need" => + $result ['need'], "size" => $size );
	}
	//文件下载信息
	function downIfo($fid) {
		$sql = "select * from down_ifo where id='$fid'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		return array ("name" => $result ["name"], "url" => $result ["realurl"], "uid" => $result ["uid"], "need" => + $result ['need'], "style" => $result ["style"] );
	}
	//下载数+1
	function downNumAdd($fid) {
		$sql = "UPDATE file SET downNum=downNum+1 WHERE id=+$fid";
		if ($this->update ( $sql )) {
			return true;
		} else
		return false;
	}
	//浏览数+1
	function scanNumAdd($fid) {
		$sql = "UPDATE file SET scanNum=scanNum+1 WHERE id=+$fid";
		if ($this->update ( $sql )) {
			return true;
		} else
		return false;
	}
	//文件MD5
	function md5Check($md5) {
		$m = strtoupper ( $md5 );
		$sql = "select id from file where md5='$m'";
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		if ($result) //存在返回1
		return 1;
		else
		return 0;
	}
	//文件添加
	function add_file($name,$name_fu,$style,$size,$md5,$kind){
		//echo $name,$name_fu,$style,$size,$md5;
		$date=date('Y/m/d');
		$sql="insert into file (name,name_fu,style,size,md5,uptime,kind) values ('$name','$name_fu','$style',$size,'$md5','$date',$kind)";
		if($this->insert($sql)){
			return $this->insert_id;
		}else{
			return 0;
		}
	}
	function add_downfile($fid,$realurl,$need,$uid){
		$sql="insert into downfile (fid,realurl,need,uid) values ($fid,'$realurl',+$need,$uid)";
		if($this->insert($sql)){
			return 1;
		}else{
			return 0;
		}
	}
	//文件类别
	function kind($kid) {
		$sql = "select title from kind where sid=+$kid";
		$result = $this->execute ( $sql );
		$array = array ();
		while ( ($row = mysql_fetch_array ( $result )) == true ) {
			array_push ( $array, $row ['title'] );
		}
		return json_encode ( $array );
	}
	function kind_s($kid) {
		$sql = "select title,id from kind where sid=+$kid";
		$result = $this->execute ( $sql );
		$array1 = array ();
		$array2 = array ();
		$array = array ();
		while ( ($row = mysql_fetch_array ( $result )) == true ) {
			array_push ( $array1, $row ['title'] );
			array_push ( $array2, $row ['id'] );
		}
		array_push($array,$array1,$array2);
		return json_encode ( $array );
	}
	//文件大类别查询
	function category_find($kid,$limit=4){
		$sql="SELECT * FROM kind_view WHERE kind in (SELECT id FROM kind WHERE sid=$kid) AND examine=1 ORDER BY downNum DESC LIMIT 0,$limit";
		$result=$this->execute($sql);
		return $result;
	}
	//最近上传
	function newUpload($kid){
		$sql="SELECT * FROM kind_view WHERE kind in (SELECT id FROM kind WHERE sid=$kid) AND examine=1 ORDER BY uptime DESC LIMIT 0,4";
		$result=$this->execute($sql);
		return $result;
	}
	function newAllUpload(){
		$sql="SELECT * FROM kind_view WHERE  examine=1 ORDER BY uptime DESC LIMIT 0,6";
		$result=$this->execute($sql);
		return $result;
	}
	//热门文集
	function hotDoc($kid){
		$sql="SELECT * FROM kind_view WHERE kind in (SELECT id FROM kind WHERE sid=$kid) AND examine=1 ORDER BY scanNum DESC LIMIT 0,4";
		$result=$this->execute($sql);
		return $result;
	}
	//文件总数
	function allNum(){
		$sql = "select count(*) from view";
		$this->execute ( $sql );
		$result=$this->fetchArray();
		return $result[0];
	}
	//文档下载总数
	function DownAllNum($uid){
		$sql = "SELECT SUM(downNum) FROM downfile WHERE uid=$uid";
		$this->execute ( $sql );
		$result=$this->fetchArray();
		return $result[0];
	}
	//用户文件信息
	function userDoc($uid){
		$sql="select DATE_FORMAT(uptime,'%Y-%m-%d') time,downNum,need,name,id from view where uid=$uid LIMIT 0 , 5";
		$result=$this->execute($sql);
		return $result;
	}
}
?>