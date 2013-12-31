$(function($) {
    $('#J_toolbar').toolbar({});
    //初始化page
    var mainSection = $("#Content1").show();
    var demoSection = $("#Content2");
    $("#Content2").css('-webkit-transform', 'translateX(100%)');
    $('.__page__').css('-webkit-transition', 'all .3s ease-in-out');
    //
    $('.new').click(function(e) {
        var widgetName = $(this).attr('href');
        location.hash = widgetName;
        e.preventDefault();
    });
    $('.return-back').click(function() {
        mainSection.css('-webkit-transform', 'translateX(0)');
        demoSection.css('-webkit-transform', 'translateX(100%)');
        location.hash = '';
        return false;
    });

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
    //登陆
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
    $("#login").click(function(event) {
        login_in.open();
        return false;
    });

    function resetHeight() {
        $('.panel').css('height', window.innerHeight).iScroll('refresh');
    }
    $(window).on('scrollStop ortchange resize', resetHeight);
    //渲染数据
    var updateDemoSection = function(widget){
        
    }


    //更新页面
    var updatePage = function() {
        var widgetName = location.hash.replace('#', '');

        if (widgetName === '' || !demos[widgetName]) {
            mainSection.css('-webkit-transform', 'translateX(0)');
            demoSection.css('-webkit-transform', 'translateX(100%)');
        } else {
            updateDemoSection(widgetName);
            mainSection.css('-webkit-transform', 'translateX(-100%)');
            demoSection.show();
            window.scrollTo(0, 0);
            setTimeout(function() {
                demoSection.css('-webkit-transform', 'translateX(0)');
            }, 0);
        }
    }

    window.onhashchange = function(e) {
        updatePage();
    }

    updatePage();
}(Zepto));