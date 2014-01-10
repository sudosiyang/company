define(function(require, exports, module) {
	var Task = require('./task');
	var SecondPage = require('./app');

	var version="1.8.1";
	var mainSection = $("#Content1");
	var demoSection = $("#Content2");
	module.exports = {
		init: function() {
			/**主体初始化**/
			$("#Content2").css('-webkit-transform', 'translateX(100%)');
			$('.__page__').css('-webkit-transition', 'all .3s ease-in-out');
			/**mainpage 的工具栏**/
			$('#J_toolbar').toolbar({});
			/**
			 * foot_tab切换监听
			 **/
			$('#f_nav').navigator().on('select', function(el, i) {
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
				var resetHeight = function() {
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

			//关于提示初始化
			aboutInit();

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

		window.onhashchange = function(e) {
			updatePage();
		}
	}
	//渲染数据第二页面
	var updateDemoSection = function(widget) {
		$("#J_toolbar2").empty();
		new gmu.Toolbar("#J_toolbar2", {
			title: SecondPage[widget].title,
			leftBtns: ['<a href="#" class="btn_1 return-back">返回</a>'],
			rightBtns: [SecondPage[widget]['right-btn']]
		});
		if (SecondPage[widget]["templ"] == "function") {
			eval(widget + ".init()");
		} else {
			eval(widget + ".init('" + SecondPage[widget]["templ"] + "')");
		}
	}
	//更新页面动画
	var updatePage = function() {
		var widgetName = location.hash.replace('#', '');
		if (widgetName === '' || !SecondPage[widgetName]) {
			demoSection.css('-webkit-transform', 'translateX(100%)');
			setTimeout(function() {
				mainSection.css('-webkit-transform', 'translateX(0)');
			}, 0);
		} else {
			mainSection.css('-webkit-transform', 'translateX(-100%)');
			demoSection.show();
			window.scrollTo(0, 0);
			setTimeout(function() {
				demoSection.css('-webkit-transform', 'translateX(0)');
			}, 0);
			updateDemoSection(widgetName);
		}
	}
	//关于
	aboutInit = function() {
		var about = gmu.Dialog({
			autoOpen: false,
			closeBtn: true,
			title: '关于',
			content: '<div class="_about"><h1>特特区TODO</h1><p>版本号：' + version + '</p><p class="small">Copyright © 1998-2013 TETEQU.</p></div>'
		});
		$(".about").click(function(event) {
			about.open();
			$('.panel').panel('close', 'push');
			return false;
		});
	}
})