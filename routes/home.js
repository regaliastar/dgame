var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var Msg = require('./../lib/mongo').Msg;
var Article = require('./../lib/mongo').Article;

router.get('/',function(req,res,next){
	//首页新闻
	var query = Article.find({});
	query.limit(2);
	query.sort({view:-1});
	query.exec(function(err,resultSet){
		if(err){
			console.log('数据库不包含两篇可以推送到首页的文章');
		}
		var news1 = resultSet[0];
		var news2 = resultSet[1];
		if(news1){
			news1.content = news1.content.substring(0,90)+'...';
		}
		if(news2){
			news2.content = news2.content.substring(0,90)+'...';
		}
		
		if(req.session.sign){
			var user = req.session.user;
			var target_id = null;
			Msg.find({target_id:req.session.user._id},function(err,msgs){
				var x;
				var filter_msgs = msgs.filter(function(msg){
					return msg.is_new;
				});

				if(filter_msgs.length > 0){
					res.render('home',{sign:true,user:user,target_id:filter_msgs[0].u_id,msg_count:filter_msgs.length,news1:news1,news2:news2});
				}else {
					res.render('home',{sign:true,user:user,target_id:null,news1:news1,news2:news2});
				}
			});

		}else{
			res.render('home',{news1:news1,news2:news2});
		}

	});

});

/*
*测试专用
*/
router.get('/test',function(req,res,next){
	res.render('test');
});

/*
*该路由用来测试还未完成的功能
*
*/
router.post('/test',function(req,res,next){
	/*
	//生成multiparty对象，并配置上传目标路径
	var form = new multiparty.Form({uploadDir: './public/img/face/'});
	//上传完成后处理
	form.parse(req, function(err, fields, files) {
	var filesTmp = JSON.stringify(files,null,2);

	if(err){
	console.log('parse error: ' + err);
}else{
console.log("原本的files："+files);
console.log('parse files: ' + filesTmp)

var uploadedPath = ''+files.myPhoto[0].path;
console.log("原文件名："+uploadedPath);
var dstPath = './public/img/face/' + Date.now()+files.myPhoto[0].originalFilename;
//重命名为真实文件名
fs.rename(uploadedPath, dstPath, function(err) {
if(err){
console.log('rename error: ' + err);
}else{
console.log('rename ok');
console.log("新文件名："+dstPath);
var myname = dstPath.split('/')[4];
console.log("文件名："+myname);
}
});

}

res.end("<h1>OK</h1>");
});
*/

if(req.body.imgData){
	console.log('req.body.imgData进入了');
	var avatar = req.body.imgData.replace(/^data:image\/\w+;base64,/,'');
	var newName = './public/img/face/' + Date.now()+'_'+ '.jpg';

	var newBuff = new Buffer(avatar, 'base64');
	fs.writeFile(newName, newBuff, 'binary', function (err) {
		if (err){
			return res.sendStatus(500);
		}
		res.sendStatus(200);
	});
}else{
	res.sendStatus(400);
}

})

module.exports = router;
