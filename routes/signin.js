var express = require('express');
var async = require('async');
var User = require('./../lib/mongo').User;
var Functions = require('./../models/functions');
var router = express.Router();

router.get('/',function(req,res,next){
	res.render('signin');
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
			res.end('success');

		}
	});
})
module.exports = router;