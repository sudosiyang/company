 define(function(require, exports, module) {
     var version = "v1.7.5";
     var tool = require('./model/tool');
     var SecondPage = require('./app');
     var Login = require("./model/login");
     var component=require("./model/component");
     $(function($) {
         window.scrollTo(0, 1); //收起地址栏
         
         $(".cont").on('click', '.t_exec a', function(event) {
            $("#Content3").show();
            setTimeout(function() {
                $("#Content3").css('-webkit-transform', 'translateY(0)');
            }, 300);
            getData.getSelect();
            return false;
        });
         
         //初始化page
         var mainSection = $("#Content1");
         var demoSection = $("#Content2");


         //确认是否登录过
         Login.checkLogin();
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
                             _this.selectExec(data);
                         }
                         tool.ajax(data, succeed);
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
                         tool.ajax(data, succeed);
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
 })