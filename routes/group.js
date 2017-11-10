var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	res.render('gruop',{sing:true,user:req.session.user});
});

module.exports = router;
