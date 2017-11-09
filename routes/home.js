var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var Msg = require('./../lib/mongo').Msg;

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		var target_id = null;
		Msg.find({target_id:req.session.user._id},function(err,msgs){
			var x;
			var filter_msgs = msgs.filter(function(msg){
				return msg.is_new;
			});

			if(filter_msgs.length > 0){
				res.render('home',{sign:true,user:user,target_id:filter_msgs[0].u_id});
			}else {
				res.render('home',{sign:true,user:user,target_id:null});
			}
		});

	}else{
		res.render('home');
	}

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
