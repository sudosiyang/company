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
				return array('result'=>true,'name' => $userinfo['u_name'],'photo'=> $userinfo['u_photo']);
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
			// $result = $this->fetchAssoc ();
			while ($arr=$this->fetchAssoc()) {
				# code...
				$result[] = $arr;
			}
			$department = array( );
			$u_d = array();
			foreach ($result as $key => $value) {
				# code...
				$u_d[] = $value['d_name'];
				
			}
			$u_d =array_unique($u_d);
			foreach ($u_d as $k=>$v) {
				$department[]['d_name'] = $v;
			}
			
			foreach ($department as $k => $arr) {
				# code...
				$d_name = $arr['d_name'];
				foreach ($result as $u) {
					# code...
					if($d_name==$u['d_name'])
					{
						$department[$k]['users'][]=array('id'=>$u['id'],'u_name'=>$u['u_name'],'photo'=>$u['u_photo'],'phone'=>$u['phonenum']);
					}
				}
			}
			
			return $department;
		}
	}
?>