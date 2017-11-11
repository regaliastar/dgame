var express = require('express');
var router = express.Router();
var User = require('./../lib/mongo').User;

// ?_id=XX
router.get('/',function(req,res,next){

	var user = req.session.user;
	User.findOne({_id:req.query._id},function(err,u){
		if(err){
			console.log('无此人');
			res.render('user',{sign:req.session.sign,user:user});
		}else {
			console.log(u);
			res.render('user',{sign:req.session.sign,user:user,u:u});
		}
	});

});

module.exports = router;
