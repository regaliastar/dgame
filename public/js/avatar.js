$(document).ready(function(){
	var selected =  $('#selected-li').html();
	
	if(selected){
		$('#'+selected).addClass('bg-blue');
	}

	/*
     *以下代码操作头像上传
     *
     */
    var userAvatar = $('#user-avatar').html();
    if(!userAvatar){
    	$('#oldAvatar').attr('src','../img/face/default.jpg')
    }

})