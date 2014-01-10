define(function(require, exports, module) {
	module.exports = {
		init:function(){
			department();
		}
	}
	var department=function() {
		var _this = this;
		var department = sessionStorage.department ? sessionStorage.department : null;
		if (!department) {
			var data = {
				req: "department"
			};
			var succeed = function(data) {
				_this.createTab(data);
			}
			tool.ajax(data, succeed);
		} else {
			createTab(JSON.parse(department));
		}
	};
	var createTab= function(data) {
		$("#Content2 .loading-wrapper").show();
		$(".a_page").empty().html('<div class="nav"></div>');
		var contents = [];
		$.each(data, function(i) {
			var obj = {};
			var html = "<div class='scroller'><ul>";
			obj.title = data[i].d_name;
			$.each(data[i].users, function(j) {
				var str = '<li><a href="#user_<%=id%>"><img src="<%=photo%>"><span><%=u_name%></span></a></li>';
				html += $.parseTpl(str, data[i].users[j]);
			});
			html += "</ul></div>";
			obj.content = html;
			contents.push(obj);
		});
		window.scrollTo(0, 1); //收起地址栏
		$(".nav").tabs({
			items: contents,
			ready: function() {
				$(".nav").on('click', 'li a', function(event) {
					event.preventDefault();
				});
			}
		}).css({
			'height': ($(window).height() - 80)
		});
		//模拟原生拉动
		$(".scroller").iScroll();
		//存储数据
		sessionStorage.setItem("department", JSON.stringify(data));
		$("#Content2 .loading-wrapper").hide();
	}
});