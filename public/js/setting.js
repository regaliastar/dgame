$(document).ready(function(){
	function isUserName(str){
		var re = /^[a-zA-z]\w{0,15}$/;
		if(re.test(str)){
			return true;
		}else{
			return false;
		}          
	}

	var defaultGrade = $('#gradeContent').html()||'';
	var Grades = {
		'0':defaultGrade,
		'1':'2011级',
		'2':'2012级',
		'3':'2013级',
		'4':'2014级',
		'5':'2015级',
		'6':'2016级',
		'7':'2017级',
		'8':'2018级',
		'9':'2019级'
	};

	var defaultCollege = $('#collegeContent').html()||'';
	var Colleges = {
		'0':defaultCollege,
		'1':'艺术学院',
		'2':'软件学院',
		'3':'计算机学院',
		'4':'外国语学院',
		'5':'经济学院',
		'6':'体育学院',
		'7':'数学学院',
		'8':'电子学院',
		'9':'制造学院'
	};

	var defaultAim = $('#aimContent').html()||'';
	var Aims = {
		'0':defaultAim,
		'1':'共同兴趣',
		'2':'求美工',
		'3':'求程序员',
		'4':'求策划',
		'5':'玩伴',
		'6':'求组队'
	};

	var selected =  $('#selected-li').html();
	if(selected){
		$('#'+selected).addClass('bg-blue');
	}				
			
	

	var user_sex = $('#user-sex').html();
	if(user_sex){
		$('li[id='+user_sex+']').addClass('blue');
	}
	
	//选择性别
	$('#sex_ul>').on('click',function(evt){
		//alert(evt.target.id);
		let sex_target_id = evt.target.id;
		$('li[class=blue]').removeAttr("class");
		$('li[id='+sex_target_id+']').addClass('blue');
	})

	//选择年级
	$('#gradeType').on('click',function(evt){
		let selectedGrade = $("#gradeType option:selected").val();
		$('#gradeContent').html(Grades[selectedGrade]);
	})

	//选择学院
	$('#collegeType').on('click',function(evt){
		let selectedCollege = $("#collegeType option:selected").val();
		$('#collegeContent').html(Colleges[selectedCollege]);
	})

	//选择目的
	$('#aimType').on('click',function(evt){
		let selectedAim = $("#aimType option:selected").val();
		$('#aimContent').html(Aims[selectedAim]);
	})

	//点击提交按钮
	$('#save').on('click',function(){
		var username = $('.user-id').val().trim();
		var grade = $('#gradeContent').html();
		var college = $('#collegeContent').html();
		var description = $('.my-sign').val().trim();
		var sex = $('li[class=blue]').attr('id');
		var aim = $('#aimContent').html();

		
		if(!isUserName(username)){
			$('html,body').animate({scrollTop:$('#username').offset().top}, 800);
			return false;
		}
		if(description.length>50){
			$('html,body').animate({scrollTop:$('#description').offset().top}, 800);
			return false;
		}
		if(sex == ''){
			$('html,body').animate({scrollTop:$('#sex').offset().top}, 800);
			return false;
		}
		
		$.ajax({
			type:'post',
			url:'/site/setting',
			data:{
				username:username,
				grade:grade,
				college:college,
				description:description,
				sex:sex,
				aim:aim
			},
			success:function(data){
				console.log("ajax发送成功");
				$('#successMsg').slideDown();
				setTimeout(function(){
					$('#successMsg').slideUp();
				},2000);
			}

		})


	})

})