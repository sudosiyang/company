 define(function(require, exports, module) {
     var $ = require('zepto');
     var gmu = require('./gmu');
     var Login = require("./model/login");
     window.scrollTo(0, 1); //收起地址栏
     //确认是否登录过
     Login.init().checkLogin();
 })