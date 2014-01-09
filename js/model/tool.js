define(function(require, exports, module) {
	module.exports = {
		ajax: function(grams, fn) {
			$.ajax({
				url: 'ajax/',
				type: 'post',
				dataType: 'json',
				data: grams,
				success: function(data) {
					fn(data);
				}
			});
		},
		alerts: function(text, time) {
			var _time = time ? time : 2000;
			var width = $(".mask").text(text).show().width();
			$(".mask").css({
				'left': $(window).width() / 2 - width / 2
			});
			setTimeout(function() {
				$(".mask").hide();
			}, _time);
		}
	}
})