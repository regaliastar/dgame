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

var removeUserBytel = function(tel){
	User.find({tel:tel},function(err,users){
		if(!err){
			users.map(function(user){
				console.log("用户 "+user.tel+"删除成功");
				user.remove();
			})

		}else{
			console.log("something wrong in removeUserBytel!");
		}
	})
}

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
		}
	})

	res.send('success');
}

exports.createUser = createUser;
exports.removeUserBytel = removeUserBytel;
exports.findUserByName = findUserByName;