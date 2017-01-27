var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		res.render('home',{sign:true,user:user});
	}else{
		res.render('home');
	}
	
})

router.get('/test',function(req,res,next){
	res.render('test');
})

module.exports = router;