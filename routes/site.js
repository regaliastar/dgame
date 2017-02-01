var express = require('express');
var router = express.Router();
var config = require('./../config/default');
var Userjs = require('./../models/users');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		//console.log('GET /site user:'+user.username);
		res.render('setting',{sign:true,user:user,select:'setting'});
	}else{
			res.render('404');
	}
})

router.post('/setting',function(req,res,next){
	if(req.session.sign){
		Userjs.updateUser(req.session.user._id,req);
		//Userjs.printUserBytel(req.session.user.tel);
	}
	
	//Userjs.updateUser(req.session.user.tel,req.body);
	res.send(true);
})

router.get('/avatar',function(req,res,next){
	Userjs.printUserBytel('15208171708');
	if(req.session.sign){
		var user = req.session.user;
		console.log("username in GET /avatar:"+user.username);
		res.render('avatar',{sign:true,user:user,select:'avatar'});
	}else{
		//此处应该改为404界面，但是为了方便调试，选择发送avator界面
		res.render('avatar',{select:'avatar'});
	}

})

router.post('/avatar',function(req,res,next){
	//生成multiparty对象，并配置上传目标路径
	if(req.session.sign){
		var form = new multiparty.Form({uploadDir: './public/img/face/'});
		//上传完成后处理
		form.parse(req, function(err, fields, files) {
			var filesTmp = JSON.stringify(files,null,2);

			if(err){
				console.log('parse error: ' + err);
				res.end("文件解析错误！");
			}else{
				//console.log('parse files: ' + filesTmp);

				var uploadedPath = ''+files.myPhoto[0].path;
				console.log("原文件名："+uploadedPath);
				var dstPath = './public/img/face/' + Date.now()+files.myPhoto[0].originalFilename;
        		//重命名为真实文件名
        		fs.rename(uploadedPath, dstPath, function(err) {
        			if(err){
        				console.log('rename error: ' + err);
        				res.end("文件重命名错误！");
        			}else{
        				console.log('rename ok');
        				console.log("新文件名："+dstPath);
        				var newAvatar = dstPath.split('/')[4];
        				Userjs.updateAvatar(req.session.user._id,newAvatar,req);
        				res.render('avatar',{select:'avatar',upload:true});
        			}
        		});
        			
       	 	}
   	    });

	}else{
		res.render('404');
	}
})

router.get('/safe',function(req,res,next){
	res.render('404');
})

module.exports = router;