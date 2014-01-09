var version = "v1.4.5";
var ajaxURL = "ajax/";
$(function($) {
    window.scrollTo(0, 1); //收起地址栏

    //ajax 类
    var ajax = function(grams, fn) {
        $.ajax({
            url: ajaxURL,
            type: 'post',
            dataType: 'json',
            data: grams,
            success: function(data) {
                fn(data);
            }
        });
    };
    //提示
    var alerts = function(text, time) {
        var _time = time ? time : 2000;
        $(".mask").text(text).show().css({
            "top": $(window).height() / 2 - 10,
            "left": $(window).width() / 2 - 73
        });
        setTimeout(function() {
            $(".mask").hide();
        }, _time);
    }
    $('#J_toolbar').toolbar({});
    $('#f_nav').navigator().on('select', function(el, i) {
        getData.switchTask(JSON.parse(sessionStorage.task), i);
    });
    //初始化page
    var mainSection = $("#Content1");
    var demoSection = $("#Content2");
    $("#Content2").css('-webkit-transform', 'translateX(100%)');
    $('.__page__').css('-webkit-transition', 'all .3s ease-in-out');
    //点击菜单，panel
    $('#J_toolbar').on("click", "a", function(e) {
        var widgetName = $(this).attr('href');
        location.hash = widgetName;
        e.preventDefault();
    });
    $('.panel').on("click", "a", function(e) {
        var widgetName = $(this).attr('href');
        $('.panel').panel('close');
        location.hash = widgetName;
        e.preventDefault();
    });

    //初始化panel，panel是iscroll

    $('#J_toolbar').on('click', '.menu', function(event) {
        $('.panel').panel('toggle', 'push');
        return false;
    });
    /*左右滑动调出菜单*/
    $("#Content1").on('swipeRight', function(event) {
        if ($(event.target).parent().attr("open") == "true") {
            $(event.target).parent().attr("open", "");
            return;
        }
        $('.panel').panel('open', 'push');
    });
    $(".panel,#Content1").on('swipeLeft', function(event) {
        $('.panel').panel('close', 'push');
    });
    var Login = (function() {
        return {
            checkLogin: function() {
                if (localStorage.getItem("login")) {
                    var data = JSON.parse(localStorage.getItem("login"));
                    this.login(data);
                }
            },
            login: function(_data) {
                if (_data.req == "login") {
                    localStorage.clear();
                    return;
                }
                var _this = this;
                var succeed = function(data) {
                    if (!data.result) {
                        if (!data.name) alert("用户名错误");
                        else alert("密码错误");
                    } else {
                        $(".login").find("img").attr("src", data.photo).next().empty().html("<a href='#' id='user'>" + data.name + "</a>");
                        localStorage.setItem("login", JSON.stringify(_data));
                        sessionStorage.setItem("user", JSON.stringify(data));
                        $("#LOGIN").hide();
                        mainSection.show();
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
                        //拉取自己的数据
                        getData.collage();

                    }
                }
                ajax(_data, succeed);
            }
        }
    })();
    //确认是否登录过
    Login.checkLogin();
    $("#login").click(function(event) {
        login_in.open();
        $('.panel').panel('close', 'push');
        return false;
    });
    $("._login").on('click', function(event) {
        var data = {
            req: "a_login",
            name: $("form ._name").val(),
            pwd: $("form ._pwd").val()
        }
        Login.login(data);
        location.hash = "";
        return false;
    });
    //关于
    var about = gmu.Dialog({
        autoOpen: false,
        closeBtn: true,
        title: '关于',
        content: '<div class="_about"><h1>特特区TODO</h1><p>版本号：' + version + '</p><p class="small">Copyright © 1998-2013 TETEQU.</p></div>'
    });
    $(".about").click(function(event) {
        about.open();
        $('.panel').panel('close', 'push');
        return false;
    });

    function resetHeight() {
        $('.panel').css('height', window.innerHeight).iScroll('refresh');
    }
    $(window).on('scrollStop ortchange resize', resetHeight);

    //数据拉取
    var getData = (function() {
        return {
            createCollage: function(data) {
                var _this = this;
                $("#Content1 .loading-wrapper").show();
                var createDatalist = function(data) {
                    var html = "";
                    $.each(data, function(i) {
                        var str = '<li><a href="#user_<%=id%>" uid="<%=id%>"><img src="<%=u_photo%>"><span><%=u_name%></span><span><%=d_name%></span></a></li>';
                        html += $.parseTpl(str, data[i]);
                    });
                    return html;
                }
                $(".m_page").empty().html("<div class='ui-refresh'><div class='ui-refresh-up'></div><ul class='data-list'></ul></div>");
                $(".m_page .data-list").empty().html(createDatalist(data));
                /*组件初始化js begin*/
                $('.m_page .ui-refresh').css('height', $(window).height() + 10).refresh({
                    load: function(dir, type) {
                        var me = this;
                        $.getJSON(ajaxURL + "?req=collage", function(data) {
                            var $list = $('.m_page .data-list');
                            var html = createDatalist(data);
                            $list[dir == 'up' ? 'html' : 'append'](html);
                            me.afterDataLoading(dir);
                            sessionStorage.setItem("collage", JSON.stringify(data));
                        });
                    },
                    ready: function(e) {
                        this.$el.on("click", "li a", function() {
                            mainSection.css('-webkit-transform', 'translateX(-100%)');
                            demoSection.show();
                            window.scrollTo(0, 0);
                            setTimeout(function() {
                                demoSection.css('-webkit-transform', 'translateX(0)');
                            }, 0);
                            var uid = $(this).attr('uid');
                            setTimeout(function() {
                                _this.getTask(uid);
                            }, 300);
                        })
                    }
                });
                /*组件初始化js end*/

                //存储数据
                sessionStorage.setItem("collage", JSON.stringify(data));
                $("#Content1 .loading-wrapper").hide();
            },
            collage: function() {
                var _this = this;
                var collage = sessionStorage.collage ? sessionStorage.collage : null;
                if (!collage) {
                    var data = {
                        req: "collage"
                    };
                    var succeed = function(data) {
                        _this.createCollage(data);
                    }
                    ajax(data, succeed);
                } else {
                    this.createCollage(JSON.parse(collage));
                }
            },
            getTask: function(uid) {
                var _this = this;
                var data = {
                    req: "getTask",
                    uid: uid
                }
                var succeed = function(data) {
                    var Task = _this.taskAnsy(data);
                    _this.switchTask(Task, 0);
                }
                ajax(data, succeed);
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
                $("#Content2 .loading-wrapper").hide();
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
                $(".a_page").empty().html("<div class='ui-refresh'><div class='ui-refresh-up'></div><ul class='data-list _task'></ul></div>");
                $(".a_page .data-list").empty().html(createDatalist(Task[list[index]]));
                /*组件初始化js begin*/
                $('.a_page .ui-refresh').css('height', $(window).height() - $("#f_nav").height() + 10).refresh({
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
                $("#Content2 .loading-wrapper").hide();
            },
        }
    })()
    //更新页面
    var updatePage = function() {
        var widgetName = location.hash.replace('#', '');
        if (widgetName === '') {
            demoSection.css('-webkit-transform', 'translateX(100%)');
            setTimeout(function() {
                mainSection.css('-webkit-transform', 'translateX(0)');
            }, 0);
        } else {
            mainSection.css('-webkit-transform', 'translateX(-100%)');
            demoSection.show();
            window.scrollTo(0, 0);
            setTimeout(function() {
                demoSection.css('-webkit-transform', 'translateX(0)');
            }, 0);
            //updateDemoSection(widgetName);
        }
    }
    window.onhashchange = function(e) {
        updatePage();
    }
});