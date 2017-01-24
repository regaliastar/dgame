var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uid:Number,
	username:String,
	password:String,
	date:Date,	//注册时间
	avatar:String,
	grade:String,
	college:String,	//学院
	sex:String,
	birthday:Date,
	createTime:Date,
	skill:String,
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

exports.User = mongoose.model('User',userSchema);
exports.Comment = mongoose.model('Comment',commentSchema);
exports.Uid = mongoose.model('Uid',uidSchema);