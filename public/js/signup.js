$(document).ready(function(){

	var tele;
	//设置验证码倒计时
	var countdown=60; 
	function settime(obj) { 
		
		if (countdown === 0) { 
			obj.removeAttribute("disabled");    
			//obj.value="免费获取验证码"; 
			obj.innerHTML = "免费获取验证码";
			countdown = 60; 
			return;
		} else { 
			obj.setAttribute("disabled", 'true'); 
			//obj.value="重新发送(" + countdown + ")"; 
			obj.innerHTML = "重新发送(" + countdown + ")";
			countdown--;
		} 
		setTimeout(function() { 
			settime(obj) }
			,1000) 
	}

	function showWrongMsg(msg){
		document.getElementById('wrong-msg').innerHTML = msg;
		$('#wrong-msg').slideDown();
	}

	//得到验证码
	$('.getIdentify').on('click',function(evt){
	    //手机号码检测
	    tele = $('.tele').val().trim();
	    if(tele.length !== 11){
	    	evt.preventDefault();
	    	//$('#tele-wrong').slideDown();
	    	showWrongMsg('手机号有误');
	    	return;
	    }

		$('.identify').removeAttr('disabled');
		settime(this);

		$.ajax({
			type:'post',
			url:"/signup/identify",
			data:{tele:tele},
			success:function(data){
				if(data){
					console.log("请求发送成功~"+data);
				}else{
					console.log("出现错误");
				}
			}
		})

	})

	$('.signup').on('click',function(evt){
		//用户名检测
		var username = $('.username').val().trim();
		if(username.length>11 || username === ''){
			evt.preventDefault();
			//$('#un-wrong').slideDown();
			showWrongMsg('用户名不规范');
			return;
		}
		//密码检测
		var password = $('.password').val().trim();
		if(password.length<6 || password.length>16){
			evt.preventDefault();
			//$('#pw-wrong').slideDown();
			showWrongMsg('密码有误');
			return;
		}
		

	    //验证码检测
	    var code = $('.identify').val().trim(); 
	    if(code === ''){
	    	evt.preventDefault();
	    	//$('#iden-wrong').slideDown();
	    	showWrongMsg('验证码有误');
	    	return;
	    }

	    evt.preventDefault();

	    tele = $('.tele').val().trim();
	    //向服务器发送ajax请求
	    $.ajax({
	    	type:'post',
	    	url:"/signup",
	    	data:{
	    		username:username,
	    		password:password,
	    		tele:tele,
	    		code:code,
	    	},
	    	success:function(data){
	    		/*if(data){
	    			$('#waiting').slideDown();
	    			console.log(data+"---验证码已成功发送到服务器~");
	    		}else{
	    			console.log("验证码不正确...");
	    			$('#iden-wrong').slideDown();
	    		}*/
	    		switch(data){
	    			case 'success':
	    				//$('#waiting').slideDown();
	    				showWrongMsg('发送成功，请等待');
	    				console.log(data+"---验证码已成功发送到服务器~");
	    				location.href = 'http://localhost:2017/home';
	    				break;
	    			case 'username':
	    				//$('#un-wrong').slideDown();
	    				showWrongMsg('用户名不规范');
	    				break;
	    			case 'password':
	    				//$('#pw-wrong').slideDowm();
	    				showWrongMsg('密码有误');
	    				break;
	    			case 'tele':
	    				//$('#tele-wrong').slideDown();
	    				showWrongMsg('手机号有误');
	    				break;
	    			case 'code':
	    				//$('#iden-wrong').slideDown();
	    				showWrongMsg('验证码有误');
	    				console.log("服务器响应iden-wrong");
	    				break;
	    			case 'tele-repeat':
	    				console.log("tele-repeat");
	    				showWrongMsg("该号码已被注册");
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


	$('.username').focusin(function(){
		$('#wrong-msg').slideUp();
	})

	$('.password').focusin(function(){
		$('#wrong-msg').slideUp();
	})

	$('.tele').focusin(function(){
		$('#wrong-msg').slideUp();
	})

	$('.identify').focusin(function(){
		$('#wrong-msg').slideUp();
	})

})