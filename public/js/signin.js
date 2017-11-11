$(document).ready(function(){

	function isTel(Tel){
		var re= /^1\d{10}$/;
		if(re.test(Tel)){
			return true;
		}else{
			return false;
		}
	}

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
							location.href = DEFAULT.route+'/home';
						},800);

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
