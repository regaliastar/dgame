var express = require('express');
var router = express.Router();

var log = require("./../log").logger("signout");

router.get('/',function(req,res,next){
	log.info("用户"+req.body.tel+" 注销");
	req.session.destroy(function(err){
		if(err){
			console.log("注销失败");
		}
	})
	res.locals.sign = false;
	res.redirect('/home');
})

module.exports = router;