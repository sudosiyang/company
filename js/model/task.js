define(function(require, exports, module) {
	var tool = require('./tool');
	module.exports = {
		getTask: function() {
			var _this = this;
			if (sessionStorage.user) {
				var user = JSON.parse(sessionStorage.user);
				var data = {
					req: "getTask",
					uid: user.uid
				}
				var succeed = function(data) {
					var Task = _this.taskAnsy(data);
					_this.switchTask(Task, 0);
				}
				tool.ajax(data, succeed);
			}
		},
		taskPublish: function() {
			var _this=this;
			if ($(".a_page input,.a_page textarea").val() && $(".t_exec a").attr("uid")) {
				var data = {
					req: "publish",
					title: $(".a_page input").val(),
					details: $(".a_page textarea").val(),
					u_id: $(".t_exec a").attr("uid"),
					p_id: JSON.parse(sessionStorage.user).uid
				}
				var succeed = function() {
					tool.alerts("发布成功", 2000);
					setTimeout(function() {
						$(".return-back").trigger("click");
						_this.getTask();
					}, 1000)
				}
				tool.ajax(data, succeed);
			} else {
				tool.alerts("字段不能为空", 2000);
			}
		},
		taskAnsy: function(data) {
			var array1 = [],
				array2 = [],
				Task = {};
			if (!data) return Task;
			$.each(data, function(i) {
				if (data[i].complete != "0") {
					array1.push(data[i]);
				} else {
					array2.push(data[i]);
				}
			});
			Task = {
				complete: array1,
				uncomplete: array2,
				all: data
			}
			sessionStorage.task = JSON.stringify(Task);
			return Task;
		},
		switchTask: function(Task, index) {
			var _this = this,
				list = ["uncomplete", "complete", "all"];
			$("#Content1 .loading-wrapper").hide();
			//数据为空则这种终止程序
			if (!Task.complete) return;
			var createDatalist = function(data) {
				var html = "";
				$.each(data, function(i) {
					var str = '<li><a href="#task_<%=t_id%>" class="rank_<%=rank%> c_<%=complete%>" tid="<%=t_id%>"><%=title%></a><span><b></b>完成</span></li>';
					html += $.parseTpl(str, data[i]);
				});
				return html;
			}
			$(".m_page").empty().html("<div class='ui-refresh'><div class='ui-refresh-up'></div><ul class='data-list _task'></ul></div>");
			$(".m_page .data-list").empty().html(createDatalist(Task[list[index]]));
			/*组件初始化js begin*/
			$('.m_page .ui-refresh').css('height', $(window).height() - $("#f_nav").height() + 10).refresh({
				load: function(dir, type) {
					var me = this;
					$.getJSON(ajaxURL + "?req=getTask&uid=" + JSON.parse(sessionStorage.user).uid, function(data) {
						var Data = _this.taskAnsy(data);
						sessionStorage.setItem("task", JSON.stringify(Data));
						_this.switchTask(Data, $("#f_nav").navigator("getIndex"));
						me.afterDataLoading(dir);

					});
				},
				ready: function(e) {
					this.$el.on("click", "li a", function() {
						return false;
					})
				}
			});
			/*组件初始化js end*/
			$("#Content1 .loading-wrapper").hide();
		}
	}
});