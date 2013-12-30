$(function($) {
    $('#J_toolbar').toolbar({});
    //初始化panel，panel是iscroll
    $('.panel').css({
        'height': window.innerHeight
    }).iScroll({
        "hScroll": false
    }).panel({
        contentWrap: $('.cont'),
        scrollMode: 'fix',
        swipeClose: false,
        position: 'left'
    });
    $('.menu').on('click', function(event) {
        $('.panel').panel('toggle', 'push');
        return false;
    });
    var login_in = gmu.Dialog({
        autoOpen: false,
        closeBtn: false,
        buttons: {
            '取消': function() {
                this.close();
            }
        },
        title: '登录',
        content: '<form action=""><input type="text" placeholder="请输入账号"><input type="password" placeholder="请输入密码"><input type="submit" value="登 录" class="_login"><div class="links"><a href="#" class="register">注册账号</a><a href="#" class="forgive">忘记密码</a></div></form>'
    });
    //login_in._options['_wrap'].addClass('login-dialog login-dialog-dark');
    $("#login").click(function(event) {
        login_in.open();
        return false;
    });

    function resetHeight() {
        $('.panel').css('height', window.innerHeight).iScroll('refresh');
    }
    $(window).on('scrollStop ortchange resize', resetHeight);
}(Zepto));