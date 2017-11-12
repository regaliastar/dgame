var express = require('express');
var router = express.Router();
var Article = require('./../lib/mongo').Article;

router.get('/',function(req,res,next){
    var user = req.session.user;
    var query = Article.find({});
    query.limit(12);
    query.sort({view:-1});
    query.exec(function(err,resultSet){
        if(err){
            res.render('article_list',{sign:req.session.sign,user:req.session.user});
        }else {
            res.render('article_list',{sign:req.session.sign,user:user,article_list:resultSet});
        }
    });
});

router.get('/a',function(req,res,next){
    Article.findOne({_id:req.query._id},function(err,article){
        if(!err){
            //一次查询执行了两次函数，故每次+0.5，很奇怪
            var count_view = article.view+0.5;
            Article.update({_id:article._id},{view:count_view},{mutil:false},function(){
                //
            });
            res.render('article',{sign:req.session.sign,user:req.session.user,article:article});

        }else {
            console.log("something wrong in router.get /a!");
            res.send('null');
        }

    });
});

module.exports = router;
