var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uid:Number,
	username:String,
	avatar:String,
	grade:String,
	college:String,	//学院
	sex:String,
	birthday:Date,
	createTime:Date,
	skill:String,
	aim:String,
	mail:String,
	tel:Number,
	description:String,
	online:Boolean	//用户是否在线
});

exports.User = mongoose.model('User',userSchema);