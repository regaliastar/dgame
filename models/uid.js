var Uid = require('./../lib/mongo').Uid;
var async = require('async');

var createUid = function(){
	new Uid({
		uid:1
	}).save();
	console.log("createUid happened");
}

//将UID保存在opt.uid中
var getUid = function(opt){
	var id = -1;

	async.series([
		function(callback){
			
			Uid.find({},function(err,uids){
				if(!err){
					uids.map(function(uid){
						id = uid.uid>id?uid.uid:id;
						//console.log('_id:'+uid._id);
					})
					console.log("id:"+id);
				}else{
					console.log("getUid()发生了错误!");
				}
				//callback的位置至关重要！决定了在哪里调用下一个函数！
				console.log("callback 1");
				callback(null, 'one');
			})
			
		},
		function(callback){
			console.log("callback 2，id:"+id);
			opt.uid = id;
			callback(null, 'two');
		}
		],function(err,value){
		if(err){
			console.log("async in getUid err happened!");
		}else{
			//console.log("async success");
		}
	});

	//考虑到node的异步问题
}


var addUid = function(){
	var au = getUid();
	var query = {"uid":au};
	var update = {uid:au+1};
	var options = {new:true};
	Uid.findOneAndUpdate(query,update,options,function(err,uid){
		if(err){
			console.log("adduid has an error happened!");
		}else{
			console.log("adduid success!");
		}

	})
}

exports.createUid = createUid;
exports.getUid = getUid;
exports.addUid = addUid;