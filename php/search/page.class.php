<?php
include 'DB/DataBase.php';
class Page extends DataBase {
	var $PageSize = 3; //每页的数量
	var $CurrentPageID; //当前的页数
	var $NextPageID = 0; //下一页
	var $PreviousPageID = 0; //上一页
	var $numPages; //总页数
	var $numItems; //总记录数
	var $isFirstPage; //是否第一页
	var $isLastPage; //是否最后一页
	private $sql; //sql查询语句
	private $str; //处理字符串
	private $style = array ("", "", "doc", "ppt", "pdf", "txt", "xls" );
	function do_search($str, $curr, $sl) {
		$this->CurrentPageID = $curr;
		$this->str_split ( $str );
		$this->set_numItems ( $sl );
		$this->set_numPages ();
		$this->set_currentPage ();
		return $this->select_all ( 'id', $sl );
	}
	// 获取总数据量
	private function set_numItems($sl) {
		$style = $this->style [$sl];
		if ($sl == 1) {
			$sql = "select count(*) as numItems from search WHERE `name` LIKE '$this->str' AND examine=1";
		} else {
			$sql = "select count(*) as numItems from search WHERE `name` LIKE '$this->str' AND examine=1 AND style='$style'";
		}
		$this->execute ( $sql );
		$result = $this->fetchArray ();
		$this->numItems = $result ['numItems'];
	}
	private function select_all($order = 'id', $sl) {
		$style = $this->style [$sl];
		$limit = ($this->CurrentPageID - 1) * $this->PageSize;
		if ($sl == 1) {
			$sql = "SELECT * FROM search WHERE `name` LIKE '$this->str' AND examine=1 order by $order desc limit $limit, $this->PageSize";
		} else {
			$sql = "SELECT * FROM search WHERE `name` LIKE '$this->str' AND examine=1 AND style='$style' order by $order desc limit $limit, $this->PageSize";
		}
		$this->execute ( $sql );
		return $this->result;
	}
	// 记算总共有多少页
	private function set_numPages() {
		if ($this->numItems) {
			if ($this->numItems < $this->PageSize) {
				$this->numPages = 1;
			} //如果总数据量小于$PageSize，那么只有一页
			if ($this->numItems % $this->PageSize) { //取总数据量除以每页数的余数
				$this->numPages = ( int ) ($this->numItems / $this->PageSize) + 1; //如果有余数，则页数等于总数据量除以每页数的结果取整再加一
			} else {
				$this->numPages = $this->numItems / $this->PageSize; //如果没有余数，则页数等于总数据量除以每页数的结果
			}
		} else {
			$this->numPages = 0;
		}
	
	}
	//判断状态页
	private function set_currentPage() {
		switch ($this->CurrentPageID) {
			case $this->numPages == 1 :
				$this->isFirstPage = true;
				$this->isLastPage = true;
				break;
			case 1 :
				$this->isFirstPage = true;
				$this->isLastPage = false;
				break;
			case $this->numPages :
				$this->isFirstPage = false;
				$this->isLastPage = true;
				break;
			default :
				$this->isFirstPage = false;
				$this->isLastPage = false;
		}
		if ($this->numPages > 1) {
			if (! $this->isLastPage) {
				$this->NextPageID = $this->CurrentPageID + 1;
			}
			if (! $this->isFirstPage) {
				$this->PreviousPageID = $this->CurrentPageID - 1;
			}
		}
	}
	//字符串处理
	private function str_split($str) {
		$array = "%";
		for($i = 0; $i < mb_strlen ( $str, "utf-8" ); $i ++) {
			$array .= mb_substr ( $str, $i, 1, 'utf-8' ) . "%";
		}
		$this->str = $array;
	}
}
?>