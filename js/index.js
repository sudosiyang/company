$(function($) {
    var version="v1.1.5";
    $('#J_toolbar').toolbar({});
    //初始化page
    var mainSection = $("#Content1").show();
    var demoSection = $("#Content2");
    $("#Content2").css('-webkit-transform', 'translateX(100%)');
    $('.__page__').css('-webkit-transition', 'all .3s ease-in-out');
    //
    $('.ui-toolbar-wrap a').click(function(e) {
        var widgetName = $(this).attr('href');
        location.hash = widgetName;
        e.preventDefault();
    });
    $('.panel a').click(function(e) {
        var widgetName = $(this).attr('href');
        $('.panel').panel('toggle');
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
        closeBtn: true,
        title: '登录',
        content: '<form action=""><input type="text" placeholder="请输入账号"><input type="password" placeholder="请输入密码"><input type="submit" value="登 录" class="_login"><div class="links"><a href="#" class="register">注册账号</a><a href="#" class="forgive">忘记密码</a></div></form>'
    });
    $("#login").click(function(event) {
        login_in.open();
        return false;
    });
    //反馈
    var about=gmu.Dialog({
        autoOpen:false,
        closeBtn: true,
        title: '关于',
        content:'<div class="_about"><h1>特特区执行力系统</h1><p>版本号：'+version+'</p><p class="small">Copyright © 1998-2013 TETEQU.</p></div>'
    });
    $(".about").click(function(event) {
        about.open();
        return false;
    });

    function resetHeight() {
        $('.panel').css('height', window.innerHeight).iScroll('refresh');
    }
    $(window).on('scrollStop ortchange resize', resetHeight);
    //渲染数据
    var updateDemoSection = function(widget){
        $("#J_toolbar2").empty();
        new gmu.Toolbar("#J_toolbar2",{
            title: SecondPage[widget].title,
            leftBtns: ['<a href="#" class="btn_1 return-back">返回</a>'],
            rightBtns: [SecondPage[widget]['right-btn']]
        });
    }


    //更新页面
    var updatePage = function() {
        var widgetName = location.hash.replace('#', '');
        if (widgetName === '' || !SecondPage[widgetName]) {
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