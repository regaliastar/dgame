var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	req.session.destroy(function(err){
		if(err){
			console.log("注销失败");
		}
	})
	res.locals.sign = false;
	res.redirect('/home');
})

module.exports = router;