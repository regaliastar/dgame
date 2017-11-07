var express = require('express');
var router = express.Router();
var Article = require('./../lib/mongo').Article;

router.get('/',function(req,res,next){
	res.render('addArticle');
});


router.post('/',function(req,res,next){
	console.log('submit username: '+req.session.username);
	if(!req.session.sign){	//若未登陆
		res.end('404');
	}else {
		Article.create({
			username:req.session.user.username,
			tel:req.session.user.tel,
			uid:req.session._id,
			title:req.body.title,
			categories:req.body.categories,
			content:req.body.content,
			date:Date.now()
		},function(err){
	        if(err){
	            console.log(err);
	            res.send('error');
	        }else {
	            console.log('插入成功');
	            res.send('success');
	        }

	    });

	}
});

module.exports = router;
