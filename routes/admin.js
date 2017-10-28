var express = require('express');
var router = express.Router();
var User = require('./../lib/mongo').User;
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
    res.render('admin/data_list');
});

router.get('/submit_list',function(req,res,next){
    res.render('admin/submit_list');
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
