<?php
class file {
	/** 文件下载
	 *$name 保存的文件名   如 ： 文件下载.txt
	 *$path  文件的真实路径  如： c://file/345234.txt 
	 */
	public function download_file($name, $path) { // 文件下载
		$file_name = $path; //服务器的真实文件名 
		$file_realName = $name; //数据库的文件名urlencode编码过的
		

		if (file_exists ( $file_name )) {
			$file = fopen ( $file_name, "r" ); // 打开文件 
			// 输入文件标签
			header ( "Pragma: public" );
			header ( "Expires: 0" );
			Header ( "Content-type: application/octet-stream;charset=utf8" );
			Header ( "Accept-Ranges: bytes" );
			Header ( "Accept-Length: " . filesize ( $file_name ) ); // 文件大小
			Header ( "Content-Disposition: attachment; filename=" . $file_realName );
			// 输出文件内容
			//ini_set('memory_limit','25M'); 大文件 则设置可占用内存大小
			$contents = '';
			while ( ! feof ( $file ) ) {
				$contents .= fread ( $file, 8192 );
			}
			echo $contents;
			fclose ( $file );
			exit ();
		} else {
			return false;
		}
	}
	//文件拓展名
	public function file_extension() {
		$extend = pathinfo ( $_FILES ['Filedata'] ['name'] ); // 获取文件路径
		return strtolower ( $extend ["extension"] );
	}
	//文件夹创建
	public function createFolder($path) {
		if (! file_exists ( $path )) {
			$this->createFolder ( dirname ( $path ) );
			mkdir ( $path, 0777 );
		}
	}
	//文件大小	
	public function file_size($dir) {
		$len = filesize ( $dir );
		return $this->format_bytes ( $len );
	}
	//	文件大小格式化
	public function format_bytes($size) {
		$units = array (' B', ' KB', ' MB', ' GB', ' TB' );
		for($i = 0; $size >= 1024 && $i < 4; $i ++)
			$size /= 1024;
		return round ( $size, 2 ) . $units [$i];
	}
	public function delete_file($path) {
		if (file_exists ( $path )) {
			if( unlink ( $path )){
				return true;
			}else return false;
		}else {
			return true;
		}
	}
}