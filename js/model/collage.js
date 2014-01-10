define(function(require, exports, module) {
	var tool = require('./tool'); 
	module.exports = {
		init: function() {
			collage();
		}
	}
	var collage = function() {
		var _this = this;
		var collage = sessionStorage.collage ? sessionStorage.collage : null;
		if (!collage) {
			var data = {
				req: "collage"
			};
			var succeed = function(data) {
				_this.createCollage(data);
			}
			tool.ajax(data, succeed);
		} else {
			this.createCollage(JSON.parse(collage));
		}
	};

	var createCollage = function(data) {
		$("#Content2 .loading-wrapper").show();
		var createDatalist = function(data) {
			var html = "";
			$.each(data, function(i) {
				var str = '<li><a href="#user_<%=id%>" uid="<%=id%>"><img src="<%=u_photo%>"><span><%=u_name%></span><span><%=d_name%></span></a></li>';
				html += $.parseTpl(str, data[i]);
			});
			return html;
		}
		$(".a_page").empty().html("<div class='ui-refresh'><div class='ui-refresh-up'></div><ul class='data-list'></ul></div>");
		$(".a_page .data-list").empty().html(createDatalist(data));
		/*组件初始化js begin*/
		$('.a_page .ui-refresh').css('height', $(window).height() + 10).refresh({
			load: function(dir, type) {
				var me = this;
				$.getJSON(ajaxURL + "?req=collage", function(data) {
					var $list = $('.a_page .data-list');
					var html = createDatalist(data);
					$list[dir == 'up' ? 'html' : 'append'](html);
					me.afterDataLoading(dir);
					sessionStorage.setItem("collage", JSON.stringify(data));
				});
			},
			ready: function(e) {
				this.$el.on("click", "li a", function() {
					return false;
				})
			}
		});
		/*组件初始化js end*/

		//存储数据
		sessionStorage.setItem("collage", JSON.stringify(data));
		$("#Content2 .loading-wrapper").hide();
	};
});