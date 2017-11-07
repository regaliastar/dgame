var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		//console.log('GET /site user:'+user.username);
		res.render('msg',{sign:true,user:user});
	}else{
		res.render('msg',{sign:false});
	}
});

module.exports = router;
