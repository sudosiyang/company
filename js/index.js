 var version = "v1.1.5";
 var ajaxURL = "ajax/";
 //判读是否加载新的数据
 var flag = {
     department: true
 } 
 $(function($) {

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
     $('.ui-toolbar-wrap,.cont').on("click", "a", function(e) {
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
     }).on('swipeLeft', function(event) {
         $('.panel').panel('close', 'push');
     });

     //登陆
     var login_in = gmu.Dialog({
         autoOpen: false,
         closeBtn: true,
         title: '登录',
         content: '<form action=""><input type="text" class="_name" placeholder="请输入账号"><input type="password" class="_pwd" placeholder="请输入密码"><input type="submit" value="登 录" class="_login"><div class="links"><a href="#" class="register">注册账号</a><a href="#" class="forgive">忘记密码</a></div></form>'
     });
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
         var succeed = function(data) {
             if (!data.result) {
                 if (data.name) alert("用户名错误");
                 else alert("密码错误");
             } else {
                 $(".login").find("img").attr("src", data.photo).next().empty().html("<a href='#' id='user'>" + data.name + "</a>");
                 login_in.close();
                 //拉取自己的数据
             }
         }
         ajax(data, succeed);
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
                 var department = localStorage.getItem("department") ? localStorage.getItem("department") : null;
                 if (!(!flag.department || !department)) {
                     var data = {
                         req: "department"
                     };
                     var succeed = function(data) {
                         _this.createNavigator(data);
                     }
                     ajax(data, succeed);
                     flag = false;
                 } else {
                     this.createNavigator(JSON.parse(department));
                 }

             },
             createNavigator: function(data) {
                 $(".a_page").empty().html('<div class="nav"></div>');
                 var contents = [];
                 for (i = 0; i < data.length; i++) {
                     var obj = {};
                     obj.text = data[i].d_name;
                     obj.href = "#nav_" + i;
                     contents.push(obj);
                 }
                 var instance = new gmu.Navigator('.nav', {
                     content: contents
                 });
                 localStorage.setItem("department", JSON.stringify(data));
                 instance.on('select', function(e, num, el) {});
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
         }
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