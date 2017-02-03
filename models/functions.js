/*
 *该模块用来保存各种有用的、用的多的函数
 */


/*
 *该函数用来判断一个对象是否为空，如：
 *
 *isEmptyObject();	true
 *isEmptyObject({});	true
 *isEmptyObject(null);	true
 *isEmptyObject(2233);	true
 *isEmptyObject({"name":"kiana"});	false
 *
 */
exports.isEmptyObject = function(e){
	var t;
	for(t in e)
		return !1;
	return !0;
}

/*
 *使用正则表达式判断输入是否为手机号码
 *以下条件均满足则输出true:
 *
 *1、十一位数字
 *2、以1开头
 *
 *如：12345678901
 *
 */

exports.isTel = function isTel(Tel){
	var re= /^1\d{10}$/;
	
	if(re.test(Tel)){
		return true;
	}else{
		return false;
	}
}

/*
 *使用正则表达式判断输入满足用户名
 *以下条件均满足则输出true:
 *
 *字母、数字、下划线组成，字母开头，1-16位
 *
 *如：kiana
 *
 */

exports.isUserName = function isUserName(str){
	var re = /^[a-zA-z]\w{0,15}$/;
	if(re.test(str)){
		return true;
	}else{
		return false;
	}          
}

/*
 *使用正则表达式判断输入满足密码
 *以下条件均满足则输出true:
 *
 *字母、数字组成 6-16位
 *
 *如：123456
 *
 */

exports.isPassword = function isPassword(password){
	var re = /^[a-zA-Z\d]{6,16}$/;
	if(re.test(password)){
			return true;
	}else{
			return false;
	}
}
