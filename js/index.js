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
     var alerts = function(text, time) {
         $(".mask").text(text).show().css({
             "top": $(window).height() / 2 - 10,
             "left": $(window).width() / 2 - 73
         });
         setTimeout(function() {
             $(".mask").hide();
         }, time);
     }

     $('#J_toolbar').toolbar({});
     $('#f_nav').navigator().on('select', function(el, i) {
         getData.switchTask(JSON.parse(sessionStorage.task), i);
     });
     $("._t-list").on("click", "li a", function(e) {
         var index = $(this).attr("href").replace("#", "");
         getData.switchTask(JSON.parse(sessionStorage.task), index);
         $('#f_nav').navigator("switchTo", index);
         e.preventDefault();
     });
     $(".cont").on("swipeLeft", "._task a.c_0", function() {
         $(this).parent().css({
             "-webkit-transform": "translateX(-5em)"
         }).attr('open', 'true');
     }).on("swipeRight", "._task a.c_0", function(e) {
         $(this).parent().css({
             "-webkit-transform": "translateX(0)"
         });
     }).on("click", "._task span", function() {
         var $_this = $(this);
         var data = {
             'req': "complete",
             't_id': $(this).prev().attr("tid")
         }
         var succeed = function(data) {
             $_this.parent().hide("1000");
             alerts("恭喜完成一个任务", 2000);
         }
         ajax(data, succeed);
     }).on('click', '.t_exec', function(event) {
         $("#Content3").show();
         setTimeout(function() {
             $("#Content3").css('-webkit-transform', 'translateY(0)');
         }, 300);
         getData.getSelect();
         return false;
     });
     //发布
     $("#J_toolbar2").on('click', '.bt-ok', function(event) {
         if($(".a_page input,.a_page textarea").val()&&$(".t_exec a").attr("uid")){
            var data={
                req:"publish",
                title:$(".a_page input").val(),
                details:$(".a_page textarea").val(),
                u_id:$(".t_exec a").attr("uid"),
                p_id:JSON.parse(sessionStorage.user).uid
            }
            var succeed=function(){
                alerts("发布成功",2000);
                setTimeout(function(){
                     $(".return-back").trigger("click");
                     getData.getTask();
                },1000)
            }
            ajax(data,succeed);
         }else{
            alerts("字段不能为空",2000);
         }
         event.preventDefault();
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

     /*//登陆
     var login_in = gmu.Dialog({
         autoOpen: false,
         closeBtn: true,
         title: '登录',
         content: '<form action=""><input type="text" class="_name" placeholder="请输入账号"><input type="password" class="_pwd" placeholder="请输入密码"><input type="submit" value="登 录" class="_login"><div class="links"><a href="#" class="register">注册账号</a><a href="#" class="forgive">忘记密码</a></div></form>'
     });*/
     var Login = (function() {
         return {
             checkLogin: function() {
                 if (localStorage.getItem("login")) {
                     var data = JSON.parse(localStorage.getItem("login"));
                     this.login(data);
                 }
             },
             login: function(_data) {
                 var _this = this;
                 var succeed = function(data) {
                     if (!data.result) {
                         if (data.name) alert("用户名错误");
                         else alert("密码错误");
                     } else {
                         $(".login").find("img").attr("src", data.photo).next().empty().html("<a href='#' id='user'>" + data.name + "</a>");
                         //login_in.close();
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
                         getData.getTask();

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
             req: "login",
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
             department: function() {
                 var _this = this;
                 var department = sessionStorage.department ? sessionStorage.department : null;
                 if (!department) {
                     var data = {
                         req: "department"
                     };
                     var succeed = function(data) {
                         _this.createTab(data);
                     }
                     ajax(data, succeed);
                 } else {
                     this.createTab(JSON.parse(department));
                 }

             },
             getSelect: function() {
                 if ($("#Content3 .select").length) {
                     setTimeout(function() {
                         $("#Content3").css('-webkit-transform', 'translateY(0)');
                     }, 300);
                     return;
                 }
                 var _this = this;
                 var collage = sessionStorage.collage ? sessionStorage.collage : null;
                 if (!collage) {
                     var data = {
                         req: "collage"
                     };
                     var succeed = function(data) {
                         _this.selectExec(data);
                     }
                     ajax(data, succeed);
                 } else {
                     this.selectExec(JSON.parse(collage));
                 }
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
             createTab: function(data) {
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
             },
             createCollage: function(data) {
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
             },
             createTask: function(templ) {
                 $("#Content2 .loading-wrapper").show();
                 $(".a_page").empty().html('<div class="nav"></div>');
                 $(".nav").html(templ);
                 $("#Content2 .loading-wrapper").hide();
             },
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
                     ajax(data, succeed);
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
                 if(!Task.complete) return;
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
             },
             selectExec: function(data) {
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
         }
     })();
     //渲染数据
     var updateDemoSection = function(widget) {
         $("#J_toolbar2").empty();
         new gmu.Toolbar("#J_toolbar2", {
             title: SecondPage[widget].title,
             leftBtns: ['<a href="#" class="btn_1 return-back">返回</a>'],
             rightBtns: [SecondPage[widget]['right-btn']]
         });
         if (SecondPage[widget]["templ"] == "function") {
             eval("getData." + widget + "()");
         } else {
             eval("getData." + widget + "('" + SecondPage[widget]["templ"] + "')");
         }
     }

     //更新页面
     var updatePage = function() {
         var widgetName = location.hash.replace('#', '');
         if (widgetName === '' || !SecondPage[widgetName]) {
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
             updateDemoSection(widgetName);
         }
     }

     window.onhashchange = function(e) {
         updatePage();
     }

     updatePage();
 }(Zepto));