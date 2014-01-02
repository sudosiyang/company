<?php
include_once 'DB/valueGet.php';
include_once 'search/page.class.php';
include_once 'DB/userModel.php';
$get = new afferent ();
$word = $get->word;
$sl = $get->sl;
$cur = $get->cur;
if ($word ==null) {
	Header ( "HTTP/1.1 303 See Other" );
	Header ( "Location: index.php" );
	exit ();
}
if ($cur==null)
	$cur = 1;
$search = new Page ();
$result = $search->do_search ( urldecode ( $word ) ,$cur,$sl);
$href = href ( +$cur, +$search->numPages, urlencode ( $word ), $search,$sl );
include_once '../html/search.html';
//分页链接
function href($cur, $numPage, $word, $search,$sl) {
	if ($numPage < $cur) {
		echo '';
		return;
	}
	$href = '';
	if (! $search->isFirstPage) {
		$href .= "<a class='pre' href='search.php?word=" . $word . '&cur=' . $search->PreviousPageID . '&sl='.$sl."'><上一页</a>";
	}
	if ($cur < 6) {
		for($i = 1; $i < $cur; $i ++) {
			$href .= "<a href='search.php?word=" . $word . '&cur=' .$i. '&sl='.$sl."'>" . $i . '</a>';
		}
		$href .= '<span>' . $cur . '</span>';
		$len = $numPage < 9 ? $numPage : 9;
		for($i = $cur + 1; $i <= $len; $i ++) {
			$href .= "<a href='search.php?word=" . $word . '&cur=' .$i. '&sl='.$sl."'>" . $i . '</a>';
		}
	} else {
		for($i = 4; $i > 0; $i --) {
			$href .= "<a href='search.php?word=" . $word . '&cur=' .($cur - $i). '&sl='.$sl."'>" . $i . '</a>';
		}
		$href .= '<span>' . $cur . '</span>';
		$len = $numPage < $cur + 4 ? $numPage : $cur + 4;
		for($i = $cur + 1; $i <= $len; $i ++) {
			$href .= "<a href='search.php?word=" . $word . '&cur=' .$i. '&sl='.$sl."'>" . $i . '</a>';
		}
	}
	if (! $search->isLastPage) {
		$href .= "<a class='next' href='search.php?word=" . $word . '&cur=' . $search->NextPageID . '&sl='.$sl. "'>下一页></a>";
	}
	return $href;
}
?>