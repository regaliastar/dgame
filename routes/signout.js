var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	req.session.destroy(function(err){
		res.locals.sign = false;
		res.redirect('/home');
	})
	
})

module.exports = router;