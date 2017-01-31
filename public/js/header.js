$(document).ready(function(){

	/*
	 *若用户未设置头像，则使用默认头像default.png
	 *
	 */
	var user_avator = $('#user-avator').val();
	if(!user_avator){
		$('.i_face').attr('src','img/face/default.png');
	}

	$('#i-msg').mouseover(function(){
		$('#community_msg').show();
	});
	
	$('#user_list').mouseleave(function(){
		$('#community_msg').hide();
	});

	$('.i_user').on('click',function(){

	})

	
})