var express = require('express');
var router = express.Router();
var config = require('./../config/default');
var Userjs = require('./../models/users');
var Functions = require('./../models/functions');
var User = require('./../lib/mongo').User;
var App = require('alidayu-node');
var async = require('async');
var app = new App(config.AppKey, config.AppSecret);

var log = require("./../log").logger("signup");

//该code最好随机生成
var code = '123456';

router.get('/',function(req,res,next){
	res.render('signup',{title:'注册 | Dgame'});
})

router.post('/',function(req,res,next){
	/*
	 *为了防止恶意用户绕过前端检测，后端也需要检测一遍用户的输入
	 *
	 *使用正则表达式检测输入
	 *
	 *这里的密码部分目前选择明码保存，以后替换为使用hash加密，以增加安全性 !important
	 *
	 */
	if(!Functions.isUserName(req.body.username)){
		res.send('username');
	}else if(!Functions.isPassword(req.body.password)){
		res.send('password');
	}else if(!Functions.isTel(req.body.tele)){
		res.send('tele');
	}else if(req.body.code !== code){
		res.send('code');
	}else{

		async.series([function(callback){
			/*
			 *系统使用电话号码和密码唯一标志一个用户
			 *如果数据库中该电话号码已被注册，则返回错误代码，提醒用户重新输入
			 */
			User.findOne({tel:req.body.tele},function(err,user){
				if(!err){
					//若该号码已被注册
					if(!Functions.isEmptyObject(user)){
						console.log("该电话已被注册");
						res.send("tele-repeat");
					}else{
						req.session.sign = true;
						req.session.user = user;
						callback(null,'one');
					}

				}else{
					console.log("something wrong in User.find()!");
				}
			});

		},function(callback){
			/*
			 *新建用户
			 *只能传入三个参数，分别是：username,password,tel
			 *创建的代码封装于models/users
			 *
			 */
			 log.info('号码 '+req.body.tele+' 用户注册成功');
			 Userjs.createUser(req.body.username,req.body.password,req.body.tele);
			 callback(null,'two');
		},function(callback){
			setTimeout(function(){
				User.findOne({tel:req.body.tele},function(err,user){
			 	req.session.user = user;
			 	req.session.sign = true;
			 	req.session.save();
			 	console.log("user in signup:"+user);
			 	res.end('success');
					//console.log("用户"+req.body.tel+"登录成功");
			});
		},1000);

		}],function(err,data){
			if(err){
				console.log('async error in signup/router.post happened!');
			}
		})
}

})

router.post('/identify',function(req,res,next){
	/*
	 *使用了阿里大于的短信服务，一条短信4.5分RMB
	 *短信的AppScrect位于config配置文件中，在生产模式下不暴露密码，详情查看我的阿里大于获得密码
	 *
	 *这里让验证码强制等于123456，以后通过生成随机数来验证
	 *
	 */

	//console.log("sendsms..."+"AppKey: "+config.AppKey+"AppSecret: "+config.AppSecret);
	//console.log("手机号："+req.body.tele);
	code = '123456';
	app.smsSend({
    	sms_free_sign_name: config.sms_free_sign_name, //短信签名
    	sms_param: JSON.stringify({"code": code, "name": "用户"}),//短信变量，对应短信模板里面的变量
    	rec_num: req.body.tele, //接收短信的手机号
   		sms_template_code: config.sms_template_code //短信模板
    });
	res.send(true);
})

module.exports = router;
