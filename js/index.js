 var version = "v1.1.5";
 var ajaxURL = "ajax/";
 $(function($) {
     window.scrollTo(0, 1); //收起地址栏
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
     }


     $('#J_toolbar').toolbar({});
     //初始化page
     var mainSection = $("#Content1").show();
     var demoSection = $("#Content2");
     $("#Content2").css('-webkit-transform', 'translateX(100%)');
     $('.__page__').css('-webkit-transition', 'all .3s ease-in-out');
     //点击菜单，panel
     $('.ui-toolbar-wrap').on("click", "a", function(e) {
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
     /*左右滑动调出菜单*/
     $("#Content1").on('swipeRight', function(event) {
         $('.panel').panel('open', 'push');
     });
     $(".panel").on('swipeLeft', function(event) {
         $('.panel').panel('close', 'push');
     });

     //登陆
     var login_in = gmu.Dialog({
         autoOpen: false,
         closeBtn: true,
         title: '登录',
         content: '<form action=""><input type="text" class="_name" placeholder="请输入账号"><input type="password" class="_pwd" placeholder="请输入密码"><input type="submit" value="登 录" class="_login"><div class="links"><a href="#" class="register">注册账号</a><a href="#" class="forgive">忘记密码</a></div></form>'
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
                 var _this = this;
                 var succeed = function(data) {
                     if (!data.result) {
                         if (data.name) alert("用户名错误");
                         else alert("密码错误");
                     } else {
                         $(".login").find("img").attr("src", data.photo).next().empty().html("<a href='#' id='user'>" + data.name + "</a>");
                         login_in.close();
                         localStorage.setItem("login", JSON.stringify(_data));
                         sessionStorage.setItem("user", JSON.stringify(data));
                         //拉取自己的数据
                         _this.getTask();
                     }
                 }
                 ajax(_data, succeed);
             },
             getTask: function() {
                 if (sessionStorage.user) {
                     var user = JSON.parse(sessionStorage.user);
                     var data = {
                         req: "getTask",
                         uid: user.uid
                     }
                     var ansyTask = function(data) {
                         console.log(data);
                     }
                     ajax(data, ansyTask);
                 }
             }
         }
     })();
     //确认是否登录过
     Login.checkLogin();
     $("#login").click(function(event) {
         login_in.open();
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
                 for (i = 0; i < data.length; i++) {
                     var obj = {};
                     var html = "<div class='scroller'><ul>";
                     obj.title = data[i].d_name;
                     for (var j = 0; j < data[i].users.length; j++) {
                         var str = '<li><a href="#user_<%=id%>"><img src="<%=photo%>"><span><%=u_name%></span></a></li>';
                         html += $.parseTpl(str, data[i].users[j]);
                     };
                     html += "</ul></div>";
                     obj.content = html;
                     contents.push(obj);
                 }
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
                 var html = "";
                 for (var i = data.length - 1; i >= 0; i--) {
                     var str = '<li><a href="#user_<%=id%>" uid="<%=id%>"><img src="<%=u_photo%>"><span><%=u_name%></span><span><%=d_name%></span></a></li>';
                     html += $.parseTpl(str, data[i]);
                 };
                 $(".a_page").empty().html("<div class='ui-refresh'><div class='ui-refresh-up'></div><ul class='data-list'></ul></div>");
                 $(".data-list").html(html);
                 /*组件初始化js begin*/
                 $('.ui-refresh').css('height', $(window).height()+10).refresh({
                     topOffset:54,
                     load: function() {
                         
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
             mainSection.css('-webkit-transform', 'translateX(0)');
             demoSection.css('-webkit-transform', 'translateX(100%)');
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