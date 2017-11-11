var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uid:Number,
	username:String,
	nickname:String,
	password:String,
	date:Date,	//注册时间
	avatar:String,
	grade:String,
	college:String,	//学院
	sex:String,
	birthday:Date,
	skill:[String],
	aim:String,
	mail:String,
	tel:String,
	description:String,
	contributes:[String],	//上传作品的ID
	online:Boolean	//用户是否在线
});

var commentSchema = mongoose.Schema({
	uid:Number,
	content:String,
	date:Date,
	agree:Number	//评论得到的赞
});

var uidSchema = mongoose.Schema({
	uid:Number
});

var article = mongoose.Schema({
	uid:String,	// user's _id
	username:String,
	date:Date,
	tel:String,
	title:String,
	categories:String,
	content:String,
	view:{	//浏览次数
		type:Number,
		default:0
	},
	isnews:{
		type:Boolean,
		default:false
	}
});

var msg = mongoose.Schema({
	u_id:String,
	target_id:String,
	target_avatar:String,
	content:String,
	date:Date,
	is_new:Boolean
});

var group = mongoose.Schema({
	u_id:String,
	w:String,	//经度
	e:String,	//纬度
	username:String,
	avatar:String,
	intro_a:String,
	intro_b:String,
	contact:String,
	local:String,
	date:Date
});

exports.User = mongoose.model('User',userSchema);
exports.Comment = mongoose.model('Comment',commentSchema);
exports.Uid = mongoose.model('Uid',uidSchema);
exports.Article = mongoose.model('Article',article);
exports.Msg = mongoose.model('Msg',msg);
exports.Group = mongoose.model('Group',group);
