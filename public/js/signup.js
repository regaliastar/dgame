$(document).ready(function(){

	$('.signup-form').on('submit',function(evt){
		var length = $('.password').val().trim().length;
		if(length<6 || length>16){
			evt.preventDefault();
			$('#pw-wrong').slideDown();
		}
		
		
	})
})