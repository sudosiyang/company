define(function(require, exports, module) {
	var tool = require('./tool');
	var Task = require('./task');
	var component = require('./component');
	var mainSection = $("#Content1");
	module.exports = {
		init: function() {
			$("._login").on('click', function(event) {
				var data = {
					req: "login",
					name: $("form ._name").val(),
					pwd: $("form ._pwd").val()
				}
				login(data);
				location.hash = "";
				return false;
			});
			return this;
		},
		checkLogin: function() {
			if (localStorage.getItem("login")) {
				var data = JSON.parse(localStorage.getItem("login"));
				login(data);
			}
		}
	}

	login = function(_data) {
		var _this = this;
		var succeed = function(data) {
			if (!data.result) {
				if (!data.name) alert("用户名错误");
				else alert("密码错误");
			} else {
				$(".login").find("img").attr("src", data.photo).next().empty().html("<a href='#' id='user'>" + data.name + "</a>");
				localStorage.login = JSON.stringify(_data);
				sessionStorage.user = JSON.stringify(data);
				$("#LOGIN").css({
					'-webkit-transform': 'scale(2)',
					'opacity': '0'
				});
				setTimeout(function() {
					$("#LOGIN").hide();
				}, 300);
				mainSection.css({
					"opacity": 0
				}).show();
				mainSection.css({
					'opacity': 1
				});
				component.init();
				//拉取自己的数据
				Task.init();
			}
		}
		tool.ajax(_data, succeed);

	}
});