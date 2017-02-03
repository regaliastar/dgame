var express = require('express');
var router = express.Router();
var config = require('./../config/default');
var Userjs = require('./../models/users');
var util = require('util');
var fs = require('fs');

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		//console.log('GET /site user:'+user.username);
		res.render('setting',{sign:true,user:user,select:'setting'});
	}else{
			res.render('login-msg');
	}
})

/*
 *功能描述：服务器得到客户端上传的表单，并更新数据库与会话，返回TRUE值
 *
 */
router.post('/setting',function(req,res,next){
	if(req.session.sign){
		Userjs.updateUser(req.session.user._id,req);
		//Userjs.printUserBytel(req.session.user.tel);
	}
	
	res.send(true);
})

router.get('/avatar',function(req,res,next){
	//Userjs.printUserBytel('15208171708');
	if(req.session.sign){
		var user = req.session.user;
		//console.log("username in GET /avatar:"+user.username);
		res.render('avatar',{sign:true,user:user,select:'avatar'});
	}else{
		//此处应该改为login-msg界面，但是为了方便调试，选择发送avator界面
		res.render('login-msg');
	}

})

/*
 *功能描述：服务端得到客户端上传上来的头像，并保存在服务器，同时更新用户数据与会话，返回upload：true;
 *
 *当用户未登陆时，发送404页面;
 *当文件解析错误时，发送错误报告;
 *当重命名错误时，发送错误报告;
 *
 *图片大小为 180*180px
 *重命名格式：1970年到现在的毫秒数+用户_id;
 *保存为.jpg格式
 *
 *文件的压缩裁剪等规范格式操作在客户端完成;
 *
 *为了减少服务器的存储量，头像统一改为.jpg的后缀减少大小
 *
 */
router.post('/avatar',function(req,res,next){

	if(req.session.sign && req.body.imgData){
		/*
         *为了与前端相适应，在上传图片时直接使用fs模块，故删除mutilparty模块
         *
		 */

       	 var avatar = req.body.imgData.replace(/^data:image\/\w+;base64,/,'');
       	 var newPath = './public/img/face/' + Date.now()+req.session.user._id+ '.jpg';

       	 var newBuff = new Buffer(avatar, 'base64');
       	 fs.writeFile(newPath, newBuff, 'binary', function (err) {
       	 	if (err){
       	 		return res.sendStatus(500);
       	 	}else{
       	 		var newAvatar = newPath.split('/')[4];
       	 		var oldAvatar = './public/img/face/'+req.session.user.avatar;

       	 		/*
				 *删除旧头像，保存新头像
				 *
       	 		 */
       	 		fs.exists(oldAvatar,function(exist){
       	 			if(exist){
       	 				fs.unlink(oldAvatar,function(err){
       	 					if(err){
       	 						throw err;
       	 					}else{
       	 						console.log('文件 '+oldAvatar+'删除成功');
       	 					}
       	 				})
       	 			}else{
       	 				console.log('头像文件不存在');
       	 			}
       	 		})

       	 		Userjs.updateAvatar(req.session.user._id,newAvatar,req);
       	 		res.end('success');
       	 	}
       	 	
       	 });


       	}else{
       		res.redirect('login-msg');
       	}
})

router.get('/safe',function(req,res,next){
	res.render('404');
})

module.exports = router;