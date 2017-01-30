var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		res.render('user',{sign:true,user:user});
	}else{
		res.render('user');
	}
	
})

module.exports = router;