define(function(require, exports, module) {
	var Task = require('./task');
	var $foot_tab = $('#f_nav');
	var $m_dom = $(".cout"); // 主体dom
	var mainSection = $("#Content1");
	module.exports = {
		init: function() {
			/**主体初始化**/
			mainSection.css('-webkit-transform', 'translateX(100%)');
			$('.__page__').css('-webkit-transition', 'all .3s ease-in-out');
			/**mainpage 的工具栏**/
			$('#J_toolbar').toolbar({});
			/**
			 * foot_tab切换监听
			 **/
			$foot_tab.navigator().on('select', function(el, i) {
				Task.switchTask(JSON.parse(sessionStorage.task), i);
			});
			/**初始化结束**/
			/**
			 *初始化panel组件-开始
			 **/
			$('.panel').css({
				'height': window.innerHeight
			}).iScroll({
				"hScroll": false
			}).on("ready", function() {
				var _this = $(this);
				//菜单栏的事件初始化
				$('#J_toolbar').on("click", "a", function(e) {
					var widgetName = $(this).attr('href');
					location.hash = widgetName;
					e.preventDefault();
				}).on('click', '.menu', function(event) {
					_this.panel('toggle', 'push');
					return false;
				});
				//panel列表事件初始化
				_this.on("click", "a", function(e) {
					var widgetName = $(this).attr('href');
					_this.panel('close');
					location.hash = widgetName;
					e.preventDefault();
				});
				//左右滑动调出菜单
				$("#Content1").on('swipeRight', function(event) {
					if ($(event.target).parent().attr("open") == "true") {
						$(event.target).parent().attr("open", "");
						return;
					}
					_this.panel('open', 'push');
				});
				$(".panel,#Content1").on('swipeLeft', function(event) {
					_this.panel('close', 'push');
				});

				var resetHeight = function () {
					$('.panel').css('height', window.innerHeight).iScroll('refresh');
				}
				$(window).on('scrollStop ortchange resize', resetHeight);
			}).panel({
				contentWrap: $('.cont'),
				scrollMode: 'fix',
				swipeClose: false,
				position: 'left'
			});
			/**初始化结束**/
			event_bind();
		}
	}
	var event_bind = function() {
		/*
		 * panel 事件
		 * 已完成，为完成，全部任务
		 */
		$("._t-list").on("click", "li a", function(e) {
			var index = $(this).attr("href").replace("#", "");
			$foot_tab.navigator("switchTo", index);
			e.preventDefault();
		});

		/***
		 **主体DOM监听
		 *1.任务左划显示完成
		 *2.任务右划显示完成
		 *3.完成按钮监听
		 *4.
		 ***/
		$(".cont").on("swipeLeft", "._task a.c_0", function() {
			$(this).parent().css({
				"-webkit-transform": "translateX(-5em)"
			}).attr('open', 'true');
		}).on("swipeRight", "._task a.c_0", function(e) {
			$(this).parent().css({
				"-webkit-transform": "translateX(0)"
			});
		}).on("click", "._task span", function() {
			var $_this = $(this);
			var data = {
				'req': "complete",
				't_id': $(this).prev().attr("tid")
			}
			var succeed = function(data) {
				$_this.parent().hide("1000");
				alerts("恭喜完成一个任务", 2000);
				Task.getTask();
			}
			tool.ajax(data, succeed);
		});
		//任务发布
		$("#J_toolbar2").on('click', '.bt-ok', function(event) {
			Task.taskPublish();
			event.preventDefault();
		});
	}
})