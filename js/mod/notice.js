define(["text!/tpl/notice.html","pagination"],function(html){
	function render(){
		$(".page-content").html(html);
		changeLanguage("notice")
		var renderHtml = function(notices) {
		    var notices = notices;
		    var tpl = '';
		    $.each(notices, function(index, notice) {
		        var status = notice.status;

		        if (status == 1) {
		            status = '<span class="item-status"><span class="badge badge-empty badge-closed"></span>&nbsp;'+Dynamic.notice_readed+'</span>';
		        }
		        if (status == 0) {
		            status = '<span class="item-status"><span class="badge badge-empty badge-success"></span>&nbsp;'+Dynamic.notice_unread+'</span>';
		        }

		        if (notice.type == 3) {
		            tpl = tpl + '<div class="well">' +
		                '<p>' + status + '<a href="#package" class="pull-right font-blue-madison">'+Dynamic.notice_options_UpgradePackage+'</a></p>' +
		                '<p class="text-left"> ' + notice.content + '</p>' +
		                '<p class="text-left"> <small>' + notice.create_time + '</small> </p>' +
		                '</div>'
		        }if (notice.type == 7) { 
		            tpl = tpl + '<div class="well">' +
		                '<p>' + status + '<a href=javascript:getExportFile("'+notice.file_path+'"); class="pull-right font-blue-madison">'+Dynamic.notice_downloadCSV+'</a></p>' +
		                '<p class="text-left"> ' + notice.content + '</p>' +
		                '<p class="text-left"> <small>' + notice.create_time + '</small> </p>' +
		                '</div>'
		        }else {
		            tpl = tpl + '<div class="well">' +
		                '<p>' + status + '</p>' +
		                '<p class="text-left"> ' + notice.content + ' </p>' +
		                '<p class="text-left"> <small>' + notice.create_time + '</small> </p>' +
		                '</div>'
		        }

		    })
		    $('.portlet-body > .notice-list').html(tpl);
		}

		var bindDom = function(){
			$('#all-message').bind('click', function(){
				 $('.portlet-body > .notice-list').empty();
				 $('.pagination').empty();
				init()
			})

			$('#unRead-message').bind('click', function(){
				$('.portlet-body > .notice-list').empty();
				$('.pagination').empty();
				init('unRead')
			})

			$('#mark-as-read').bind('click', function(){
				markAllRead();
			})
		}

		
		var init = function(type){
			var type = type || 'all',
				dataUrl = '';
			if(type==="unRead"){
				dataUrl = '/api/notice.open?cmd=WEL:SELECTUNREADNOTICE'
			} else {
				dataUrl = '/api/notice.open'
			}
			$('.pagination').pagination({
				dataSource: function(done) {
			        $.ajax({
			            async: true,
		                type: "POST",
		                dataType: "json", // 返回json格式
		                url: dataUrl,
		                data: {
		                	user_id:userID
		                },
			            success: function(response) {
			            	console.log(response)
			            	var noticeList = response.list || response;
			            	var status=response.status;
			            	if(status){
			            		if(status==='on'){
				            		$('#switch-mail').bootstrapSwitch('state', true);
				            	}else{
				            		$('#switch-mail').bootstrapSwitch('state', false);
				            	}
			            	}
			            	if(noticeList && noticeList.length > 0){
			            		done(noticeList);
			            	} else {
			            		$('.portlet-body > .notice-list').html('<p class="text-center">'+Dynamic.notice_nomessages+'</p>')
			            	}
			                
			            }
			        });
			    },
			    pageSize: 5,
			    callback: function(data, pagination) {
			    	console.log(pagination.el[0]);
	        		var notices = data;
	        		renderHtml(notices);
	    		}
			})
		}
		
		var markAllRead = function(){
			$.ajax({
				async: true,
		        type: "POST",
		        dataType: "json", // 返回json格式
		        url: '/api/notice.open?cmd=WEL:UPDATENOTICE',
		        data: {
		            user_id:userID
		        },
			    success: function(response) {
			        $('#all-message').click();
			        $('#all-message').parent().addClass('active');
			        $('#unRead-message').parent().removeClass('active');
			        initMessageInfo(userID);
			    }
			})
		}

		$('#switch-mail').bootstrapSwitch({
			onText:Dynamic.notice_open,
			offText:Dynamic.notice_close,
	        onSwitchChange:function(event,state){  
	            if(state==true){  
	            	//接收邮件
	                //$(this).val("1");
	                $.ajax({
						async: true,
				        type: "POST",
				        dataType: "json", // 返回json格式
				        url: '/api/notice.open?cmd=WEL:ISRECEIVENOTICE',
				        data: {
				            status:"on"
				        },
					    success: function(response) {
					        
					    }
					})  
	            }else{
	            	//不接收邮件  
	                //$(this).val("2"); 
	                $.ajax({
						async: true,
				        type: "POST",
				        dataType: "json", // 返回json格式
				        url: '/api/notice.open?cmd=WEL:ISRECEIVENOTICE',
				        data: {
				            status:"off"
				        },
					    success: function(response) {
					        
					    }
					}) 
	            }  
	        }  
	    }) 

		init();
		bindDom();

	}
	return {
		render:render
	};

});

function getExportFile(file_path){ 
 	 window.location.href = "/api/download.open?cmd=WEL:EXPORTEXCELFROMNOTICE&fileName="+file_path;
 }

