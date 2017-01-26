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