$(document).ready(function(){

	$('.signin').on('click',function(evt){
		var tel = $('.tele').val().trim();
		var password = $('.password').val().trim();
		if(tel.length !== 11){
			$('#pw-wrong').slideDown();
			return false;
		}

		console.log('1');
		
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
						setTimeout(function(){
							location.href = 'http://localhost:2017/home';
						},1000)
						
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


	$('.tele').focusin(function(){
		$('#pw-wrong').slideUp();
	})

	$('.password').focusin(function(){
		$('#pw-wrong').slideUp();
	})

})