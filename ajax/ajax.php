<?php
	include_once 'DataBase.php';
	class Todo extends DataBase {
		function login($name, $pwd) {
			$sql = "select * from t_user where phonenum='$name'";
			$this->execute ( $sql );
			$result = $this->fetchArray ();
			$userinfo=$this->userinfo($result ['id']);
			if (! $result)
				return array('result'=>false,'name' => false );
			if ($result ['u_pwd'] == $pwd) {
				return array('result'=>true,'name' => $userinfo['u_name'],'uid'=>$result ['id'],'photo'=> $userinfo['u_photo']);
			} else{
				return array('result'=>false,'pwd' => false );
			}
		}
		//  获取用户名
		function username($uid) {
			$sql = "select * from t_user where id=$uid";
			$this->execute ( $sql );
			$result = $this->fetchArray ();
			return $result ["username"];
		}
		// 拉取用户信息
		function userinfo($uid){
			$sql = "select * from t_user where id=$uid";
			$this->execute ( $sql );
			$result = $this->fetchArray ();
			return $result;
		}
		//拉取部门信息
		function department(){
			$sql = "SELECT * FROM `t_user` a join `t_departmanet` b on a.d_id=b.d_id";
			$this->execute ( $sql );
			while ($arr=$this->fetchAssoc()) {
				$result[] = $arr;
			}
			$department = array( );
			$u_d = array();
			foreach ($result as $key => $value) {
				$u_d[] = $value['d_name'];
				
			}
			$u_d =array_unique($u_d);
			foreach ($u_d as $k=>$v) {
				$department[]['d_name'] = $v;
			}
			foreach ($department as $k => $arr) {
				$d_name = $arr['d_name'];
				foreach ($result as $u) {
					if($d_name==$u['d_name'])
					{
						$department[$k]['users'][]=array('id'=>$u['id'],'u_name'=>$u['u_name'],'photo'=>$u['u_photo'],'phone'=>$u['phonenum']);
					}
				}
			}
			return $department;
		}
		//拉取任务
		function getTask($uid){
			$sql = "SELECT * FROM t_task WHERE u_id = $uid ORDER BY rank DESC";
			$this->execute ( $sql );
			while ( $arr = $this->fetchAssoc()) {
				$result[]=$arr;
			}
			return $result;
		}
		//拉取同事
		function getCollage(){
			$sql = "SELECT id,u_name,phonenum,u_photo,d_name FROM t_user,t_departmanet WHERE t_user.d_id=t_departmanet.d_id ORDER BY t_user.u_name ASC";
			$this->execute ( $sql );
			while ( $arr = $this->fetchAssoc()) {
				$result[]=$arr;
			}
			return $result;
		}
		//完成任务
		function complete($t_id){
			$sql='UPDATE t_task SET complete =1 WHERE t_id = '.$t_id;
			return $this->update($sql); 
		}
	}
?>