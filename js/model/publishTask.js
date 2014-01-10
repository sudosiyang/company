define(function(require, exports, module) {
	var select = require("./select");
	module.exports = {
		init: function(templ) {
			createTask(templ);
			//初始化选择执行人
			$(".cont").on('click', '.t_exec a', function(event) {
				$("#Content3").show();
				setTimeout(function() {
					$("#Content3").css('-webkit-transform', 'translateY(0)');
				}, 300);
				select.init();
				return false;
			});
			//任务发布
			$("#J_toolbar2").on('click', '.bt-ok', function(event) {
				Task.taskPublish();
				event.preventDefault();
			});
		}
	}
	var createTask = function(templ) {
		$("#Content2 .loading-wrapper").show();
		$(".a_page").empty().html('<div class="nav"></div>');
		$(".nav").html(templ);
		$("#Content2 .loading-wrapper").hide();
	}
})