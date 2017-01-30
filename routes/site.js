var express = require('express');
var router = express.Router();
var config = require('./../config/default');
var Userjs = require('./../models/users');

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		//console.log('GET /site user:'+user.username);
		res.render('setting',{sign:true,user:user});
	}else{
			res.render('404');
	}
})

router.post('/setting',function(req,res,next){
	if(req.session.sign){
		Userjs.updateUser(req.session.user._id,req);
		//Userjs.printUserBytel(req.session.user.tel);
	}
	
	//Userjs.updateUser(req.session.user.tel,req.body);
	res.send(true);
})

router.get('/avator',function(req,res,next){
	res.render('404');
})

router.get('/safe',function(req,res,next){
	res.render('404');
})

module.exports = router;