define(function(require, exports, module) {
	var tool = require('./tool');
	module.exports={
		init:function(){
			getSelect();
		}
	}
	var getSelect = function() {
		if ($("#Content3 .select").length) {
			webkitRequestAnimationFrame(function() {
				$("#Content3").css('-webkit-transform', 'translateY(0)');
			});
			return;
		}
		var _this = this;
		var collage = sessionStorage.collage ? sessionStorage.collage : null;
		if (!collage) {
			var data = {
				req: "collage"
			};
			var succeed = function(data) {
				selectExec(data);
			}
			tool.ajax(data, succeed);
		} else {
			this.selectExec(JSON.parse(collage));
		}
	}
	var selectExec = function(data) {
		var createDatalist = function(data) {
			var html = "<ul class='select'>";
			$.each(data, function(i) {
				var str = '<li><a href="#user_<%=id%>" uid="<%=id%>"><img src="<%=u_photo%>"><span><%=u_name%></span><span><%=d_name%></span></a><span class="ui-icon-select"></span></li>';
				html += $.parseTpl(str, data[i]);
			});
			html += "</ul>";
			return html;
		}
		$('.c_page').css({
			"height": $(window).height() - $("#f_nav").height()
		}).html(createDatalist(data)).iScroll("refresh").on("click", "a", function() {
			$(".ui-icon-select").removeClass('ui-icon-selected'); //只能单选
			var uid = $(this).attr("uid");
			$(this).next().addClass('ui-icon-selected');
			$("#Content3 input").val(uid).attr("name", $(this).find('span').eq(0).text());
			return false;
		});
		//绑定toolbar事件
		$("#J_toolbar3").on("click", ".return-back", function(e) {
			$("#Content3").css({
				'-webkit-transform': 'translateY(100%)'
			});
			setTimeout(function() {
				$("#Content3").hide()
			}, 300);
			e.preventDefault();
		}).on("click", ".bt-ok", function(e) {
			if ($("#Content3 input").val()) {
				$("#Content3").css({
					'-webkit-transform': 'translateY(100%)'
				});
				setTimeout(function() {
					$("#Content3").hide()
				}, 300);
				$("#Content2 .t_exec a").text($("#Content3 input").attr("name")).attr("uid", $("#Content3 input").val());
			} else {
				alerts('还没有选择执行人', 2000);
			}
			e.preventDefault();
		});
		$("#Content3 .loading-wrapper").hide();
	}
});