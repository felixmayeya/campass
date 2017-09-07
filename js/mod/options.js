define(["text!/tpl/options.html"],function(html){
	function render(){
		$(".page-content").html(html);
		changeLanguage("options")
		var option_ok=Dynamic.option_ok;
		 $.ajax({
				async : true,
				cache : false,
				type : "post",
				//dataType : "json", //返回json格式
				url : "/api/options.open",
				data : {},
				success : function(data) { //请求成功后处理函数。
					$('#user_id').val(data.user_id);
					$('.userinfo_title>span').eq(0).html(data.user_id);
					$('#pass').val(data.password);
					$('#sitename').val(data.sitename);
					$('#email').val(data.email);
					$('#phone').val(data.phone);
				    $('#company').val(data.company);
					$('#company2').val(data.company);
					$('#userAvatar').attr('src',data.image);
					$('#avatarExplainImg').attr('src',data.image);
					$('#userAvatar_s').attr('src',data.image);
					
//					$('#beginAndEndTime span').html(data.package_begin_time+" ~ "+data.package_end_time);
//					$('#data_config span').html("<strong>"+data.package_data_config+"</strong> GB");
					
					$('#company span').html(data.company)
					$('#name_h span').html(data.sitename)
				}
			});

		 //保存修改头像
		 $("#saveAvatar").click(function(){
			 var option_avatarsuc=Dynamic.option_avatarsuc;
			 var option_avatarfaild=Dynamic.option_avatarfaild;
			 $.ajax({
					async : true,
					cache : false,
					type : "post",
					dataType : "json", // 返回json格式
					url : "/api/options.open?cmd=WEL:UPDATE",
					data : {
						headImgDataUrl : headImgDataUrl
					},
					success : function(data) { // 请求成功后处理函数
						if (data.statu == 'success') {
							swal({
		                        title: option_avatarsuc,
		                        confirmButtonText: option_ok,
		                        type: "success",
		                    },function(){
//		                    	window.location.reload();
		                    	$(".profile-userpic img").attr("src",$("#avatarExplainImg").attr("src"));
		                    	$(".avatar").attr("src",$("#avatarExplainImg").attr("src"))
							});
							
						}
					},
					error : function() {// 请求失败处理函数
						swal({
							  title:"",
							  text: option_avatarfaild,
							  type: "warning",
							  confirmButtonClass: "btn-danger",
							  confirmButtonText: option_ok,
							  closeOnConfirm: false
							});
					}
				});
		 })
		 $('#btnsave').click(function(){
			 	var sitename=$('#sitename').val();
				var email = $('#email').val();
				var company = $('#company2').val();
				var phone = $('#phone').val();
				
				var option_canotempty=Dynamic.option_canotempty;
				var option_emailerr=Dynamic.option_emailerr;
				var option_phoneerr=Dynamic.option_phoneerr;
				var option_savesuc=Dynamic.option_savesuc;
				var option_savefaild=Dynamic.option_savefaild;
				if(sitename=='' || email =='' || company ==''|| phone ==''){
					swal({
						  title:"",
						  text: option_canotempty,
						  type: "warning",
						  confirmButtonClass: "btn-danger",
						  confirmButtonText: option_ok,
						  closeOnConfirm: false
						});
					return;
				}
				
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (!filter.test(email)){
					swal({
					  title: option_emailerr,
					  type: "error",
					  confirmButtonText: option_ok,
					  closeOnConfirm: false
					})
					$('#email').val("");
					return false;
				}
				
				if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
					swal({
						  title:"",
						  text: option_phoneerr,
						  type: "warning",
						  confirmButtonClass: "btn-danger",
						  confirmButtonText: option_ok,
						  closeOnConfirm: false
						});
					$('#phone').val("");
					return false;
				}
				
				
				$.ajax({
					async : true,
					cache : false,
					type : "post",
					dataType : "json", // 返回json格式
					url : "/api/options.open?cmd=WEL:UPDATE",
					data : {
						sitename : $('#sitename').val(),
						email : $('#email').val(),
						phone : $('#phone').val(),
						company : $('#company2').val(),
						headImgDataUrl : headImgDataUrl
					},
					success : function(data) { // 请求成功后处理函数
						$(".username").html($('#sitename').val());
						$(".profile-usermenu>.nav>li:eq(0) h4 span").html($('#sitename').val());
						if (data.statu == 'success') {
							swal({
		                        title: option_savesuc,
		                        confirmButtonText: option_ok,
		                        type: "success",
							 },function(){
//			                    	window.location.reload();
								});
						}
					},
					error : function() {// 请求失败处理函数
						swal({
							  title:"",
							  text: option_savefaild,
							  type: "warning",
							  confirmButtonClass: "btn-danger",
							  confirmButtonText: option_ok,
							  closeOnConfirm: false
							});
					}
				});
			})
	//升级套餐
	$.ajax({
		type: "get",
		url:"/api/user.open?cmd=WEL:UPGRADEPACKAGE",
		async: true,
		cache: true,
		dataType: "json", //返回json格式
		success:function(data){
			var tpl;
			$.each(data,function(){
				tpl+='<tr><td>'+this.role_name+'</td><td>'+this.begin_time+' -- '+this.end_time+'</td><td>'+this.data_config+'GB</td><td><a class="btn blue btn-outline updataCombo" data-id="'+this.role_id+'" data-type="'+this.product_id+'">'+Dynamic.notice_options_UpgradePackage+'</a></td></tr>'
				console.log(this)
			})
			$("#tab_1_4 table tbody").html(tpl)
		}
	})
	$("body").delegate(".updataCombo", "click", function () {
		localStorage.setItem("ROLE", $(this).attr("data-id"));
		localStorage.setItem("ROLE_ID", $(this).attr("data-type"));
		//个人设置升级套餐跳转到首页，首页接收判定变量
		localStorage.setItem("OPTION_PACKAGE",1)
		window.location.href = "/index.html";
	})
		 $('#btnreset').click(function(){
			 $.ajax({
				 async : true,
				 cache : false,
				 type : "post",
				 dataType : "json", //返回json格式
				 url : "/api/options.open?cmd=WEL:RESET",
				 data : {
					 sitename : $('#sitename').val()
				 },
				 success : function(data) { //请求成功后处理函数
					 if(data.statu == 'success'){
						//$('#user_id').val(data.user_id);
						$('#sitename').val(data.sitename);
						$('#email').val(data.email);
						$('#phone').val(data.phone);
						$('#company').val(data.company);
					 }
				 },
				 error : function() {//请求失败处理函数
					 swal({
							title: "Session过期，请重新登录！",
							text: "",
							type: "info",
							confirmButtonText: option_ok,
							closeOnConfirm: false
						},function(){
							 window.location.href = "index.html";
						})
				 }
			 });
		 })
		 $("#changeAvatarBtn").click(function(){
		 	$(".changeAvatarBox").css("display","block");
		 })
		 //上传图片转化dataurl
		var headImgDataUrl;
		$("body").delegate("#headImg","change",function(){
//		  	$(".changeAvatarInput").css("display","none");
//		  	$(".changeAvatarPreview").css("display","block");
		    var file = this.files[0];
	        if(window.FileReader) {
	            var fr = new FileReader();
	            fr.onloadend = function(e) {
	                headImgDataUrl = e.target.result;
	                $("#avatarExplainImg").attr("src",headImgDataUrl)
//	                document.getElementsByClassName("changeAvatarExplainImg")[0].style.backgroundImage = 'url('+headImgDataUrl+')';
	            };
	            fr.readAsDataURL(file);
	        }
		})
		$(".changeAvatarCancel").click(function(){
			$(".changeAvatarBox").css("display","none");
			$(".changeAvatarInput").css("display","block");
		 	$(".changeAvatarPreview").css("display","none");
		 	var fileDom=$("#headImg");
			fileDom.after(fileDom.clone().val(""));
			fileDom.remove();
		})
		$(".changeAvatarExplainCheck").click(function(){
			$(".changeAvatarBox").css("display","none");
			$(".changeAvatarInput").css("display","block");
		 	$(".changeAvatarPreview").css("display","none");
		 	document.getElementsByClassName("headImg")[0].style.backgroundImage = 'url('+headImgDataUrl+')';
		 	var fileDom=$("#headImg");
			fileDom.after(fileDom.clone().val(""));
			fileDom.remove();
		})
		
		$('#btnPassSave').click(function() {
			var pass = $('#pass').val();
			var password = $('#password').val();
			var npassword = $('#npassword').val();
			var rpassword = $('#rpassword').val();
			var option_passwordErr1=Dynamic.option_passwordErr1;
			var option_passwordErr2=Dynamic.option_passwordErr2;
			var option_passwordErr3=Dynamic.option_passwordErr3;
			var option_passwordSuc=Dynamic.option_passwordSuc;
			$.ajax({
				async : false,
				cache : false,
				type : "post",
				dataType : "json", // 返回json格式
				url : "/api/options.open?cmd=WEL:VALIDATEPASSWORD",
				data : {
					pass : pass,
					password : password
				},
				success : function(data) { // 请求成功后处理函数
					
					if(data=="fail"){
						swal({
							  title:"",
							  text: option_passwordErr1,
							  type: "warning",
							  confirmButtonClass: "btn-danger",
							  confirmButtonText: option_ok,
							  closeOnConfirm: false
							});
						$('#password').val('');
						$('#npassword').val('');
						$('#rpassword').val('');
						return;
					}
					
					if (npassword != rpassword) {
						swal({
							  title:"",
							  text: option_passwordErr2,
							  type: "warning",
							  confirmButtonClass: "btn-danger",
							  confirmButtonText: option_ok,
							  closeOnConfirm: false
							});
						$('#password').val('');
						$('#npassword').val('');
						$('#rpassword').val('');
						return;
					}
					if (rpassword == null || rpassword == '') {
						swal({
							  title:"",
							  text: option_passwordErr3,
							  type: "warning",
							  confirmButtonClass: "btn-danger",
							  confirmButtonText: option_ok,
							  closeOnConfirm: false
							});
						$('#password').val('');
						$('#npassword').val('');
						$('#rpassword').val('');
						return;
					}
					
					$.ajax({
						async : false,
						cache : false,
						type : "post",
						dataType : "json", // 返回json格式
						url : "/api/options.open?cmd=WEL:RESETPASSWORD",
						data : {
							user_id : $('#user_id').val(),
							password : npassword
						},
						success : function(data) { // 请求成功后处理函数
							swal({
		                        title: option_passwordSuc,
		                        confirmButtonText: option_ok,
		                        type: "success",
							 },function(){
								 window.location.href = "index.html";
								});
							
						},
						error : function() {// 请求失败处理函数
							swal({
								title: "Session过期，请重新登录！",
								text: "",
								type: "info",
								confirmButtonText: option_ok,
								closeOnConfirm: false
							},function(){
								 window.location.href = "index.html";
							})
						}
					})
					
				},
				error : function() {// 请求失败处理函数
					swal({
						title: "Session过期，请重新登录！",
						text: "",
						type: "info",
						confirmButtonText: option_ok,
						closeOnConfirm: false
					},function(){
						 window.location.href = "index.html";
					})
				}
			});
		})
	 $('#btnPassReset').click(function(){
		$('#password').val('');
		$('#npassword').val('');
		$('#rpassword').val('');
	 });
	}
	return {
		render:render
	}
})
