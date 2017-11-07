var express = require('express');
var router = express.Router();
var User = require('./../lib/mongo').User;
var Article = require('./../lib/mongo').Article;
var Functions = require('./../models/functions');

router.get('/',function(req,res,next){
    res.render('admin/admin_signin');

});

router.post('/signin',function(req,res,next){
    console.log('enter admin/signin');
    if(req.body.username === 'admin' && req.body.password === 'admin'){
        res.redirect('submit_list');
    }

});

router.get('/data_list',function(req,res,next){
    User.find({},function(err,users){
        if(!err){
            //console.log(JSON.stringify(users));
            //console.log(Object.prototype.toString.call(users));
            res.render('admin/data_list',{'users':users});
            return;
        }else {
            console.log("something wrong in router.get /data_list!");
        }
        //res.render('admin/data_list');
    });

});

router.get('/detailUser',function(req,res,next){
    console.log(req.query.tel);
    User.find({tel:req.query.tel},function(err,users){
        if(!err){
            //console.log(JSON.stringify(users));
            //console.log(Object.prototype.toString.call(users));
            res.send(users);
            return;
        }else {
            console.log("something wrong in router.get /data_list!");
        }

        res.send('null');
    });

});

router.get('/deleteUser',function(req,res,next){
    User.find({tel:req.query.tel},function(err,users){
        if(!err){
            users.map(function(user){
                console.log("用户 "+user.tel+"删除成功");
                user.remove();
            });
        }else{
            console.log("something wrong in removeUserBytel!");
            return handleError(err);
        }

        res.redirect('data_list');
    });
});

router.post('/insertUser',function(req,res,next){
    User.create({
		username:req.body.username,
		tel:req.body.tel,
		date:Date.now()
	},function(err){
        if(err){
            console.log(err);
            res.send('null');
        }else {
            console.log('插入成功');
            res.redirect('data_list');
        }

    });

});

router.get('/submit_list',function(req,res,next){
    Article.find({},function(err,articles){
        if(err){
            console.log('error happened in /submit_list');
        }else {
            res.render('admin/submit_list',{'articles':articles});
        }
    });

});

router.get('/detailArticle',function(req,res,next){
    console.log(req.query.tel);
    Article.find({_id:req.query._id},function(err,article){
        if(!err){
            res.send(article);
            return;
        }else {
            console.log("something wrong in router.get /detailArticle!");
        }

        res.send('null');
    });
});

router.get('/deleteArticle',function(req,res,next){
    Article.find({_id:req.query._id},function(err,articles){
        if(!err){
            articles.map(function(article){
                article.remove();
                console.log('Article '+req.query._id+' 删除成功');
            });
        }else {
            console.log("something wrong in router.get /detailArticle!");
        }

        res.redirect('submit_list');
    });
});

router.get('/admin_password',function(req,res,next){
    res.render('admin/admin_password');
});

router.get('/admin_list',function(req,res,next){
    res.render('admin/admin_list');
});

router.get('/submit_news',function(req,res,next){
    res.render('admin/submit_news');
});

router.get('/dos',function(req,res,next){
    res.render('admin/dos');
});

router.post('/insertUser',function(req,res,next){
    console.log('enter admin/insertUser');
    User.findOne({tel:req.body.tele},function(err,user){
        if(!err){
            //若该号码已被注册
            if(!Functions.isEmptyObject(user)){
                console.log("该电话已被注册");
                res.send("tele-repeat");
            }else{
                req.body.username = req.body.username || '233';
                Userjs.createUser(req.body.username,req.body.password,req.body.tele);
                console.log('createUser: '+JSON.stringify(req.body));
            }

        }else{
            console.log("something wrong in User.find()!");
        }
    });

});

module.exports = router;
