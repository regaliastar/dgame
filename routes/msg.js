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

// route: /whisper?target_id=xxx
router.get('/whisper',function(req,res,next){
	if(req.session.sign){
		var user = req.session.user;
		//console.log(req.query._id);

		User.findOne({_id:req.query.target_id},function(p_err,p_target){

				//找不到数据
				Msg.find({target_id:req.session.user._id},function(err,msgs){
					if(err){	//新注册账号，无任何消息记录
						res.render('msg',{sign:true,user:user});
						return;
					}
					var x;
					var r_users = [];
					for(x in msgs){
						if( r_users.indexOf(msgs[x].u_id) >= 0){
							//
						}else {
							r_users.push(msgs[x].u_id);
						}
					}
					var count_users = r_users.length;
					var history_target = [];

					r_users.map(function(item){
						User.findOne({_id:item},function(err,target){
							history_target.push(target);
							count_users--;
							if(!count_users){
								//console.log(JSON.stringify(history_target));
								if(!p_err){
									//若目标明确存在
									console.log('To u_id: '+p_target._id);
									res.render('msg',{sign:true,user:user,target:p_target,history_target:history_target});
								}else {
									res.render('msg',{sign:true,user:user,target:history_target[0],history_target:history_target});
								}

							}
						});
					});

				});

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
