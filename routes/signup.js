var express = require('express');
var router = express.Router();
var config = require('./../config/default');
var App = require('alidayu-node');
var app = new App(config.AppKey, config.AppSecret);
//该code最好随机生成
var code = '123456';

router.get('/',function(req,res,next){
	res.render('signup');
})

router.post('/',function(req,res,next){
	/*
	if(req.body.code === code){
		

		res.send(true);
	}else{
		res.send(false);
	}
	*/
	if(req.body.username.length>11 || req.body.username === ''){
		res.send('username');
	}else if(req.body.password.length<6 || req.body.password.length>16){
		res.send('password');
	}else if(req.body.tele.length !== 11){
		res.send('tele');
	}else if(req.body.code !== code){
		res.send('code');
	}else{
		res.send('true');
		//这里保存进数据库


	}

	//将用户数据保存到数据库
	console.log("username: "+req.body.username);
	console.log("password: "+req.body.password);
	console.log("tele: "+req.body.tele);

})

router.post('/identify',function(req,res,next){
	//这里让验证码强制等于123456，以后通过生成随机数来验证
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