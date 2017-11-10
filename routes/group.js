var express = require('express');
var router = express.Router();
var Group = require('./../lib/mongo').Group;

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		var groups = [];
		var query = Group.find({});
	    query.limit(12);
	    query.sort({date:-1});
	    query.exec(function(err,resultSet){
	        if(err){
	            res.render('group',{sign:true,user:req.session.user});
	        }else {
	            res.render('group',{sign:true,user:user,groups:resultSet});
	        }
	    });
		// res.render('group',{sign:true,user:user,groups:groups});
	}else {
		res.render('group');
	}
});

router.get('/getInitPoint',function(req,res){
	console.log('getInitPoint');
	var query = Group.find({});
	query.limit(12);
	query.sort({date:-1});
	query.exec(function(err,resultSet){
		if(err){
			res.send([]);
		}else {
			console.log(JSON.stringify(resultSet));
			res.send(resultSet);
		}
	});
});

router.post('/',function(req,res){
	Group.create({
		u_id:req.body.u_id,
		w:req.body.w,	//经度
		e:req.body.e,	//纬度
		username:req.body.username,
		avatar:req.body.avatar,
		intro_a:req.body.intro_a,
		intro_b:req.body.intro_b,
		contact:req.body.contact,
		local:req.body.local,
		date:Date.now()
	},function(err){
        if(err){
            console.log(err);
            res.send('null');
        }else {
            console.log('插入成功');
            res.redirect('group');
        }

    });
});

module.exports = router;
