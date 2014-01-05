-- phpMyAdmin SQL Dump
-- version 4.1.3
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2014-01-05 21:01:42
-- 服务器版本： 5.5.35
-- PHP Version: 5.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `todos`
--

-- --------------------------------------------------------

--
-- 表的结构 `t_departmanet`
--

CREATE TABLE IF NOT EXISTS `t_departmanet` (
  `d_id` int(2) NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `d_name` varchar(20) COLLATE utf8_bin NOT NULL COMMENT '部门名称',
  PRIMARY KEY (`d_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `t_departmanet`
--

INSERT INTO `t_departmanet` (`d_id`, `d_name`) VALUES
(1, '前端设计'),
(2, '数据服务'),
(3, '后端核心'),
(4, '运营销售');

-- --------------------------------------------------------

--
-- 表的结构 `t_task`
--

CREATE TABLE IF NOT EXISTS `t_task` (
  `t_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'taskID',
  `u_id` int(11) NOT NULL COMMENT '用户ID',
  `title` varchar(30) COLLATE utf8_bin NOT NULL,
  `details` text COLLATE utf8_bin NOT NULL,
  `p_id` int(11) NOT NULL COMMENT '发布者',
  `complete` smallint(6) NOT NULL,
  `rank` smallint(6) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`t_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=14 ;

--
-- 转存表中的数据 `t_task`
--

INSERT INTO `t_task` (`t_id`, `u_id`, `title`, `details`, `p_id`, `complete`, `rank`, `score`) VALUES
(1, 1, 'HTML5建立', 'HTML5建立XXXXXX', 2, 0, 1, 0),
(2, 1, '首页建立', 'HTML5建立大的撒打算', 1, 0, 0, 0),
(3, 1, 's1ad的撒打算打算', '打算的撒打算爱的撒打算撒盛大', 1, 1, 0, 0),
(4, 1, 'sa2d的撒打算打算', '打算的撒打算爱的撒打算撒盛大', 1, 1, 0, 0),
(5, 1, 'sad3的撒打算打算', '打算的撒打算爱的撒打算撒盛大', 1, 1, 0, 0),
(6, 1, '撒打算打算', '打算的撒打算爱的撒打算撒盛大', 1, 0, 1, 0),
(7, 1, 'QQ群sad的撒打算打算', '打算的撒打算爱的撒打算撒盛大', 1, 0, 0, 0),
(8, 1, 'sad企鹅全文的撒打算打算', '打算的撒打算爱的撒打算撒盛大', 1, 0, 2, 0),
(9, 1, '额外企鹅王企鹅', '打算的撒打算爱的撒打算撒盛大', 1, 0, 0, 0),
(10, 1, '额外额外全额', '打算的撒打算爱的撒打算撒盛大', 1, 0, 2, 0),
(11, 1, '问问去q''w', '打算的撒打算爱的撒打算撒盛大', 1, 1, 0, 0),
(12, 1, '额外全额', '打算的撒打算爱的撒打算撒盛大', 1, 0, 0, 0),
(13, 1, '额外企鹅我', '打算的撒打算爱的撒打算撒盛大', 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `t_user`
--

CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_name` varchar(15) COLLATE utf8_bin NOT NULL COMMENT '姓名',
  `phonenum` varchar(11) COLLATE utf8_bin NOT NULL COMMENT '手机及账号',
  `u_pwd` varchar(20) COLLATE utf8_bin NOT NULL COMMENT '密码',
  `u_photo` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '用户头像',
  `d_id` int(11) NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=14 ;

--
-- 转存表中的数据 `t_user`
--

INSERT INTO `t_user` (`id`, `u_name`, `phonenum`, `u_pwd`, `u_photo`, `d_id`) VALUES
(1, '苏思洋', '18618242335', '111111', 'user/14.png', 1),
(2, '张中华', '13261965352', '111111', 'user/13.png', 1),
(3, '曹庆森', '13264197716', '111111', 'user/6.png', 1),
(4, '马志磊', '18610664341', '111111', 'user/12.png', 4),
(5, '田斌', '13911392612', '111111', 'user/4.png', 3),
(6, '董文龙', '18041155315', '111111', 'user/5.png', 2),
(7, '胡永乐', '15010189500', '111111', 'user/1.png', 3),
(8, '陈穗嘉', '18510100930', '111111', 'user/11.png', 3),
(9, '吴迪', '15321096675', '111111', 'user/10.png', 1),
(10, '张力', '18701379891', '111111', 'user/8.png', 4),
(11, '徐德艳', '13001287645', '111111', 'user/7.png', 1),
(12, '刘光伦', '18612031191', '111111', 'user/2.png', 3),
(13, '王磊', '18210176127', '111111', 'user/3.png', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
