var express = require('express');
var async = require('async');
var User = require('./../lib/mongo').User;
var Functions = require('./../models/functions');
var router = express.Router();

router.get('/',function(req,res,next){
	res.render('signin',{title:'登录 | Dgame'});
})

router.post('/',function(req,res,next){

	User.findOne({tel:req.body.tel},function(err,user){
		if(Functions.isEmptyObject(user)){
			res.send('pw-wrong');
		}else if(user.password != req.body.password){
			res.send('pw-wrong');
		}else{
			req.session.user = user;
			req.session.sign = true;
			req.session.save();
			console.log("用户"+req.body.tel+"登录成功");
			res.send('success');
		}
	});
})
module.exports = router;