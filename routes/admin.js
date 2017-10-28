var express = require('express');
var router = express.Router();

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

module.exports = router;
