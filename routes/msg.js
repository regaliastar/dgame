var express = require('express');
var router = express.Router();
var User = require('./../lib/mongo').User;
var Msg = require('./../lib/mongo').Msg;

router.get('/',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		var target = null;

		res.render('msg',{sign:true,user:user});
	}else{
		res.render('msg',{sign:false});
	}
});

router.get('/whisper',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		//console.log(req.query._id);

		User.findOne({_id:req.query.target_id},function(err,target){
			if(err){

				//找不到数据
				Msg.findOne({target_id:req.session.user._id},function(err,msg){
					if(err){

						res.render('msg',{sign:true,user:user});
						return;
					}

					User.findOne({_id:msg.u_id},function(err,target){
						res.render('msg',{sign:true,user:user,target:target});
					});

				});

			}else {
				res.render('msg',{sign:true,user:user,target:target});
			}

		});

	}else{
		res.render('login-msg',{sign:false});
	}
});

/**
 * 发送消息给目标
 */
router.post('/whisper',function(req,res,next){
	if(req.session.sign){
		Msg.create({
			u_id: req.session.user._id,
			target_id: req.body.target_id,
			target_avatar: req.body.target_avatar,
			content: req.body.content,
			date: Date.now(),
			is_new: true
		},function(err){
			if(err){
	            console.log(err);
	            res.send('error');
	        }else {
	            console.log('msg插入成功');
	            res.send('success');
	        }
		});

	}else{
		res.render('signin',{sign:false});
	}
});

/**
 * 通过ajax从服务器得到消息
 */
router.get('/getMsg',function(req,res,next){

	if(req.session.sign){
		Msg.find({target_id:req.session.user._id},function(err,msgs){
			if(!err){
				//console.log('进入 Msg.find');
				//更新 is_new 为false
				var x;
				var filter_msgs = msgs.filter(function(msg){
					return msg.is_new;
				});
				for(x in msgs){
					if(msgs[x].is_new){
						Msg.update({_id:msgs[x]._id},{is_new:false},{mutil:false},function(){
							//
						});
					}
				}
	            res.send(filter_msgs);
	            return;
	        }else {
	            console.log("something wrong in router.get /getMsg!");
	        }
		});
	}
});

router.get('/getHistoryMsg',function(req,res,next){
	if(req.session.sign){

		Msg.find({'target_id':req.session.user._id},function(err,msgs){
			if(err){
				//未找到
				res.send('no');
				return;
			}
			// var filter_msgs = msgs.filter(function(msg){
			// 	//过滤超出60秒的信息
			// 	return (Date.now() - msg.date)/1000 < req.query.time;
			// });
			var filter_msgs = msgs.sort(function(a,b){
				return a.date - b.date;
			});
			var box = [];
			var s = filter_msgs.length-req.query.start;
			var e = s - req.query.count;
			for(;s > e;s--){
				if(filter_msgs[s]){
					box.push(filter_msgs[s]);
					//console.log(filter_msgs[s].date);
				}
			}
		//	console.log(JSON.stringify(box));
			res.send(box);
		});
	}
});

module.exports = router;
