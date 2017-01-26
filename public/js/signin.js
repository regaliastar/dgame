$(document).ready(function(){

	$('.signin').on('click',function(evt){
		var tel = $('.tele').val().trim();
		var password = $('.password').val().trim();
		evt.preventDefault();
		$.ajax({
			type:'post',
			url:'/signin',
			data:{
				tel:tel,
				password:password
			},
			success:function(data){
				console.log("data:"+data);
				switch(data){
					case 'success':
						console.log("success~");
						$('#waiting').slideDown();
						location.href = 'http://localhost:2017/home';
						break;
					case 'pw-wrong':
						$('#pw-wrong').slideDown();
						break;
					default:
						break;
				}
			},

			error:function(err){
				console.log("error...");
			}
		})
	})

})