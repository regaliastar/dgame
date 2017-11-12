var express = require('express');
var router = express.Router();
var Article = require('./../lib/mongo').Article;

// ?keyword=XX
router.post('/',function(req,res,next){

	var keywords = req.body.keywords ? req.body.keywords.trim().split(' ') : [];
    var reg_keywords =[];
    keywords.map(function(item){
        let t = new RegExp(item,'i');
        reg_keywords.push(t);
    });
    var querycondition ={
        title: {$in: reg_keywords}
    };

	var query = Article.find(querycondition);
	query.limit(12);
    query.sort({view:-1});
	query.exec(function(err,resultSet){
		if(err){
            res.render('article_list',{sign:req.session.sign,user:req.session.user});
        }else {
            res.render('article_list',{sign:req.session.sign,user:req.session.user,article_list:resultSet});
        }
	});

});

module.exports = router;
