$(document).ready(function(){
	$('.i_user').mouseover(function(){
		$('#community_msg').show();
	});
	$('#user_list').mouseleave(function(){
		$('#community_msg').hide();
	});

})