var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	if(req.session.sign){
		res.render('home',req.session.user);
	}else{
		res.render('home');
	}
	
})

router.get('/test',function(req,res,next){
	res.render('test');
})

module.exports = router;