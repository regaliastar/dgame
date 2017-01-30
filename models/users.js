var User = require('./../lib/mongo').User;
var async = require('async');

var createUser = function(username,password,tele){
	new User({
		username:username,
		password:password,
		tel:tele,
		date:Date.now()
	}).save();
	console.log("createUser :"+username);
}
exports.createUser = createUser;

var removeUserBytel = function(tel){
	User.find({tel:tel},function(err,users){
		if(!err){
			users.map(function(user){
				console.log("用户 "+user.tel+"删除成功");
				user.remove();
			})

		}else{
			console.log("something wrong in removeUserBytel!");
			return handleError(err);
		}
	})
}
exports.removeUserBytel = removeUserBytel;

var printUserBytel = function(tel){
	if(tel.length !== 11)	return false;
	User.find({tel:tel},function(err,users){
		if(!err){
			users.map(function(user){
				console.log(user);
			})
		}else{
			console.log("something wrong in showUserBytel!");
			return handleError(err);
		}
	})
}
exports.printUserBytel = printUserBytel;

/*
 *接受两个参数
 *根据_id来唯一确定用户，req存放需要更新的数据
 *最后再更新会话数据，并通过req.session.save()保存
 *若少了保存操作，则session的值将一直是更新之前的值
 *
 */
var updateUser = function(id,req){
	User.update({_id:id},req.body,{mutil:true},function(err,numberAffected,raw){
		if(err){
			console.log("something wrong in updateUser!");
			return handleError(err);
		}else{
			User.findOne({_id:id},function(err,user){
				//console.log('updateUser id:'+id);
				//console.log('updateUser user:'+user);
				
				req.session.user = user;
				req.session.sign = true;
				req.session.save();
				//console.log("session.user:"+req.session.user);
				//console.log("用户"+user.tel+"信息更新成功");
					
				
			});
		}
		//console.log('The number of updated documents was %d', numberAffected);
  		//console.log('The raw response from Mongo was ', raw);

	})
}
exports.updateUser = updateUser;

var findUserByName = function(req,res){
	//User.createUser(req.body.username,req.body.password,req.body.tele);
	var usersMsg = [];
	async.series([function(callback){

		User.find({username:req.body.username},function(err,users){
			if(!err){
				users.map(function(user){

					var row = {username:user.username,password:user.password,tele:user.tele};
					usersMsg.push(row);
					console.log("kiana's psssword:"+user.password);
				})
				callback(null,'one');
			}
		})

	},function(callback){
		console.log("msg里的password为："+usersMsg[0].password);

	}],function(err,data){
		if(err){
			console.log('async error in signup/router.post happened!');
			return handleError(err);
		}
	})

	res.send('success');
}
exports.findUserByName = findUserByName;