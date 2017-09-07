define(["text!/tpl/upload.html",
"jqueryForm",
],function(html){
	function render(){
		var ssInitUserId = "";
		var basePath = "";
		var projectids="";
		var selectFileFlag="";
		var initTotalDataSizeUsed = "";
		var initUserId = "";
		var websocket = null;
		var fileId;
	      //将消息显示在网页上
	      function setMessageInnerHTML(innerHTML){
	          document.getElementById('message').innerHTML += innerHTML;
	      }

	      //关闭连接
	      function closeWebSocket(){
	          websocket.close();
	      }

	      //发送消息
	      function send(){
	          var message = document.getElementById('text').value;
	          websocket.send(message);
	      }

	      function initWebSocket(){
	    	  $("#message").empty();
	          //判断当前浏览器是否支持WebSocket
	          if('WebSocket' in window){
	              websocket = new WebSocket(basePath);
	          }
	          else{
	              console.log('Not support websocket')
	          }

	          //连接发生错误的回调方法
	          websocket.onerror = function(){
	              setMessageInnerHTML("error");
	          };

	          //连接成功建立的回调方法
	          websocket.onopen = function(event){
	          }

	          //接收到消息的回调方法
	          websocket.onmessage = function(event){
	        	  if(initUserId == event.data.split(",")[0]){
	        		  setMessageInnerHTML(event.data.split(",")[1]);
	        	  }
	          }

	          //连接关闭的回调方法
	          websocket.onclose = function(){
	              setMessageInnerHTML("");
	          }

	          //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	          window.onbeforeunload = function(){
	              websocket.close();
	          }


	      }
		var projectList;
		var projectIDArr="";
		//HTML节点注入section中
		$(".page-content").html(html);
		changeLanguage("upload")


		var upload_ok=Dynamic.upload_ok;
		var upload_confirm=Dynamic.upload_confirm;
		var upload_skipStep=Dynamic.upload_skipStep;
		var upload_Attachment=Dynamic.upload_Attachment;
		var upload_StreamingData=Dynamic.upload_StreamingData;
		var upload_submitBtntips1=Dynamic.upload_submitBtntips1;
		var upload_submitBtntips2=Dynamic.upload_submitBtntips2;
		var upload_submitBtntips3=Dynamic.upload_submitBtntips3;
		var upload_submitBtntips4=Dynamic.upload_submitBtntips4;
		var upload_submitBtntips5=Dynamic.upload_submitBtntips5;
		var upload_submitBtntips6=Dynamic.upload_submitBtntips6;
		var upload_submitBtntips7=Dynamic.upload_submitBtntips7;
		var upload_submitBtntips8=Dynamic.upload_submitBtntips8;
		var upload_submitBtntips9=Dynamic.upload_submitBtntips9;
		var upload_submitBtntips10=Dynamic.upload_submitBtntips10;
		var upload_submitBtntips11=Dynamic.upload_submitBtntips11;
		var upload_submitBtntips12=Dynamic.upload_submitBtntips12;
		var upload_submitBtntips13=Dynamic.upload_submitBtntips13;


		if(roleType==2){
			$("#excelItem").hide();
			$(".upLoadAStep").remove();
			$("#submitBtn").html(Dynamic.upload_up);
			upload_submitBtntips2=Dynamic.upload_submitBtntips15;
		}
		//选择项目初始化
		$.ajax({
			url:"/api/project.open?cmd=WEL:SELECTPROJECTNAME",
			data: {
            	roleId:roleID
            },
			success:function(data){
				projectList=data;
				initUserId = data.userId;
				$("#selectUpLoadPro").empty();
				for(var i=0;i<data.file.length;i++){
					$("#selectUpLoadPro").append("<option value="+data.file[i].id+" data-fileid="+(i)+" data-id="+data.file[i].id+">"+data.file[i].name+"</option>")
				}
				if(projectUP!="" && projectUP!=undefined){
					projectids=projectUP;
					projectUP=$("#selectUpLoadPro option[data-id="+projectUP+"]").html();
				}else{
					projectUP=upload_skipStep;
					projectids="";
				}
				$('#selectUpLoadPro').selectpicker({
					width:"100px",
					title:projectUP,
					size: 10,
				});
				for(var i in projectList.file){
					if(projectList.file[i]["id"]==projectids){
						$("li",$("#selectUpLoadPro").prev()).eq(i).addClass("selected")
					}
				}
				projectUP="";
				basePath = data.basePath;

				$("#onlineInitProject").empty();
				if(data.stream.length!=0){
					$("#onlineInitProject").append('<option value="'+Dynamic.upload_skipStep+'" data-fileid="" data-id="">'+Dynamic.upload_skipStep+'</option>')
					for(var i=0;i<data.stream.length;i++){
						$("#onlineInitProject").append("<option value="+data.stream[i].id+" data-fileid="+(i)+" data-id="+data.stream[i].id+">"+data.stream[i].name+"</option>")
					}
				}else{
					$("#onlineInitProject").append('<option value="'+Dynamic.upload_streamCreatProject+'" data-fileid="" data-id="">'+Dynamic.upload_streamCreatProject+'</option>')
				}
			}
		})
		$("#upLoadForm").delegate("#selectUpLoadPro","change",function(){
			var i=Number($("li.selected").attr("data-original-index"));
			projectIDArr=$("#selectUpLoadPro option:eq("+i+")").attr("data-id");
		})
		//查询数据总计流量和使用流量
		$.ajax({
			async: true,
			type: "post",
			url: "/api/dosage.open?cmd=WEL:DATASIZE",
			success: function(data) {
				var perc=(parseFloat(data.flaotUsedDataSize)/parseFloat(data.flaotTotalSize))*100;
				$("#totol_data_size").text(data.totalSize);
				$("#used_data_size").text(data.usedSize);
				$("#left_data_size").text(data.xSize);
				$("#used_per").text(perc.toFixed(2)+"%");
				if((parseFloat(data.flaotUsedDataSize)/parseFloat(data.flaotTotalSize))*100>100){
					$("#p_used").css("width","100%");
					$("#p_used").attr("class","progress-bar progress-bar-danger");
				}else{
					$("#p_used").css("width",perc+"%");
				}
			},
			error: function() {
                 console.log('请求失败');
			}
		});
		$("body").delegate("#selectUpLoadPro","change",function(){
			var i=Number($("li.selected").attr("data-original-index"));
			$("#init_project_id").val($("#selectUpLoadPro option:eq("+i+")").attr("data-id"));
			projectids=$("#selectUpLoadPro option:eq("+i+")").attr("data-id");
		})
		var totalSize = 0;
		//绑定所有type=file的元素的onchange事件的处理函数
		$("body #upLoadForm").delegate(':file','change',function() {
			var upload_upLoadFormtips1=Dynamic.upload_upLoadFormtips1;
			var upload_upLoadFormtips2=Dynamic.upload_upLoadFormtips2;
			var file = this.files[0]; //假设file标签没打开multiple属性，那么只取第一个文件就行了
			name = file.name;
			size = file.size;
			url = window.URL.createObjectURL(file); //获取本地文件的url，如果是图片文件，可用于预览图片
			type=name.split(".").pop();
			var fileType=["txt","zip","tar","7z","gzip","xz","rar","json","csv","log","Z","bz2","xls","xlsx"];
			var fileTypeCheck=0;
			for(var i=0;i<fileType.length;i++){
				if(fileType[i].indexOf(type)!=-1){
					fileTypeCheck=1;
				}
			}
			if(fileTypeCheck==1){
				$("#upload_data").removeAttr("onsubmit")
				$(this).parent().append("<div class='fileList'></div>")
				$(".fileList").append("<ul><li>"+Dynamic.upload_fileName+"：" + name + "</br> "+Dynamic.upload_fileType+"：." + type + "</br> "+Dynamic.upload_fileSize+"：" + size +" Bytes</li><a class='cancelFile'>"+Dynamic.upload_cancel+"</a></ul>")
				//+ "</br> 预览: <img src="+url+" style='width:100px;vertical-align:top;'>"
				totalSize += size;
				$("#info").html(totalSize + " bytes");
				totalSize=0;
				$("#progressBox").css("display","block")

				//根据文件大小判断是否有文件选中
				if(size>0){
					selectFileFlag=true;
				}
			}else{
				swal({
				  title: upload_upLoadFormtips1,
				  text: upload_upLoadFormtips2,
				  type: "error",
				  confirmButtonClass: "btn-error",
				  confirmButtonText: upload_ok,
				  closeOnConfirm: false
				});
				var fileDom = $("#upLoadFile");
				fileDom.after(fileDom.clone().val(""));
				fileDom.remove();
			}
		});
		$(".upLoadA").delegate(".cancelFile","click",function(){
	        $(".fileList").remove();
	        var fileDom = $("#upLoadFile");
			fileDom.after(fileDom.clone().val(""));
			fileDom.remove();

			//取消上传的时候执行
			selectFileFlag=false;
		})
		//上传按钮绑定
		$('#submitBtn').click(function(e){
			//判断是否有文件选中
			if(selectFileFlag!=true){
				swal({
					  title:"",
					  text: upload_submitBtntips1,
					  type: "warning",
					  confirmButtonClass: "btn-danger",
					  confirmButtonText: upload_ok,
					  closeOnConfirm: false
					});
				return;
			}
			//判断是否选中项目
			if($("#selectUpLoadPro").val()===''){
				swal({
					  title:"",
					  text: Dynamic.upload_submitBtntips0,
					  type: "warning",
					  confirmButtonClass: "btn-danger",
					  confirmButtonText: upload_ok,
					  closeOnConfirm: false
					});
				return;
			}
			e.preventDefault();
			var l = Ladda.create(this);

			swal({
				  title:Dynamic.upload_upLoadtitle1,
				  text: upload_submitBtntips2,
				  type: "info",
				  html:true,
				  showConfirmButton:false,
				  closeOnConfirm: false
				})
					var options = {
							type:"POST",
							beforeSend:function(){
								l.start();
							},
							uploadProgress:function(event,position,total,percentComplete){
								l.setProgress(percentComplete/100)
							},
							url:"/upload?productname=campass&userid="+userID+"&projectid="+projectids+"&product_id="+roleType,
							success:function(data){
								console.log(data)
								var noodData=data;
								l.stop()
							var uploadInterval=setInterval(function(){
								$.ajax({
									async: true,
									type: "post",
									url: "/api/upload.open?cmd=WEL:VALIDAEXCESS",
									data:{
										capacity:data.capacity
									},
									success: function(data) {
										console.log(data)
										if(data==false){
											return
										}else{
											clearInterval(uploadInterval)
										}
										if(data.isExcessData==="10"){
											swal({
												title: upload_submitBtntips3,
												text: upload_submitBtntips4,
												type: "info",
												html:true,
												showCancelButton: true,
												confirmButtonClass: "btn-success",
												confirmButtonText: upload_submitBtntips5,
												cancelButtonText: upload_submitBtntips6,
												closeOnConfirm: false
											},function(isConfirm){
												if(isConfirm){
													swal({
														title: upload_submitBtntips3,
														text: Dynamic.upload_isExcessData2+data.excessPrice+Dynamic.upload_isExcessData3,
														type: "info",
														html:true,
														showCancelButton: true,
														confirmButtonClass: "btn-success",
														confirmButtonText: upload_submitBtntips8,
														cancelButtonText: upload_submitBtntips6,
														closeOnConfirm: false
													},function(isConfirm){
														if(isConfirm){
															//检测账户余额
															if(data.isExcessAmount=="1"){
																swal({
																	  title:upload_submitBtntips9,
																	  text: upload_submitBtntips10,
																	  type: "warning",
																	  html:true,
																	  confirmButtonClass: "btn-danger",
																	  confirmButtonText: upload_ok,
																	  closeOnConfirm: false
																},function(){
																	$.ajax({
																		async: true,
																		type: "post",
																		url: "/api/upload.open?cmd=WEL:NOUPLOAD",
																		data:{
																			file_id:noodData.file_id,
																			filepath:noodData.ssh_path,
																			host:noodData.ssh_host,
																			project_id:noodData.project_id
																		},
																		success: function(data) {
																			swal.close()
																		}
																	})
																});
															}else{
																swal({
																	  title:Dynamic.upload_upLoadtitle1,
																	  text: upload_submitBtntips2,
																	  type: "info",
																	  html:true,
																	  showConfirmButton:false,
																	  closeOnConfirm: false
																	})
																$.ajax({
																	async: true,
																	type: "post",
																	url: "/api/upload.open?cmd=WEL:CONFIRMUPLOAD",
																	data:{
																		file_id:noodData.file_id,
																		filepath:noodData.ssh_path,
																		host:noodData.ssh_host,
																		project_id:noodData.project_id
																	},
																	success: function(data) {
																		swal({
																			title: upload_submitBtntips14,
																			text: "",
																			html:true,
																			confirmButtonText: upload_ok,
																			type: "success"
																		},function(){
																			location.href="#/manage";
																		});
																	}
																})
																//调转到预解析页面
																if(roleType!=2){
																	// initCompirePage(data);
																}else{
																	$("#init_file_id").val(data.fileId);
																	fileId=noodData.file_id
																}
															}
														}else{
															$.ajax({
																async: true,
																type: "post",
																url: "/api/upload.open?cmd=WEL:NOUPLOAD",
																data:{
																	file_id:noodData.file_id,
																	filepath:noodData.ssh_path,
																	host:noodData.ssh_host,
																	project_id:noodData.project_id
																},
																success: function(data) {
																	swal.close()
																}
															})
														}
												})
											}else{
												$.ajax({
													async: true,
													type: "post",
													url: "/api/upload.open?cmd=WEL:NOUPLOAD",
													data:{
														file_id:noodData.file_id,
														filepath:noodData.ssh_path,
														host:noodData.ssh_host,
														project_id:noodData.project_id
													},
													success: function(data) {
														swal.close()
													}
												})
											}
												return;
											}

										   );
										}else if(data.isExcessData==='8'){
											$.ajax({
												async: true,
												type: "post",
												url: "/api/upload.open?cmd=WEL:CONFIRMUPLOAD",
												data:{
													file_id:noodData.file_id,
													filepath:noodData.ssh_path,
													host:noodData.ssh_host,
													project_id:noodData.project_id
												},
												success: function(data) {
													swal({
														title: Dynamic.upload_submitBtntips14,
														text: Dynamic.upload_isExcessData1,
														html:true,
														confirmButtonText: Dynamic.upload_ok,
														type: "warning"
													},function(){
														swal.close()
														location.href="#/manage"
													});
												}
											})

										}else{
											$.ajax({
												async: true,
												type: "post",
												url: "/api/upload.open?cmd=WEL:CONFIRMUPLOAD",
												data:{
													file_id:noodData.file_id,
													filepath:noodData.ssh_path,
													host:noodData.ssh_host,
													project_id:noodData.project_id
												},
												success: function(data) {
													swal({
														title: upload_submitBtntips14,
														text: "",
														html:true,
														confirmButtonText: upload_ok,
														type: "success"
													},function(){
														location.href="#/manage";
													});
												}
											})
											if(roleType!=2){
												// initCompirePage(data);
											}else{
												$("#init_file_id").val(data.fileId);
												fileId=noodData.file_id
											}
										}
									},
									error:function(){
									}
								})
							},1000)

							return
								if(roleType==2){
									selectFileFlag=false;
									swal({
										title: '上传完成，请等待预解析通知并确认预解析格式。',
										text: "",
										confirmButtonText: upload_ok,
										type: "success"
									},function(){
										location.href="#/manage";
									});
								}
							},
							error:function(XMLHttpRequest, textStatus, errorThrown){
								l.stop();
								console.log(XMLHttpRequest)
								console.log(textStatus)
								console.log(errorThrown)
							}
			            };
					$("#upLoadForm").ajaxSubmit(options);
		});

		//option change delegate
		$(".parseFormatTable").delegate(".formatSelect","change",function(){
			$("option",$(this)).not($("option:selected",$(this))).removeAttr("selected");
			$("option",$(this)).not($("option:selected",$(this))).attr("data-select",0);
			$("option:selected",$(this)).attr("selected",true);
			$("option:selected",$(this)).attr("data-select",1);
		})
		//save按钮事件委托
		var upload_saveonly=Dynamic.upload_saveonly;
		var upload_saveexp=Dynamic.upload_saveexp;
		var upload_submitBtntips14=Dynamic.upload_submitBtntips14
		//select绑定选择事件
		$("body").delegate(".formatTable select","change",function(){
			var secNum=$(this)[0].selectedIndex;
			// $("option",$(this)).removeAttr("selected");
			$("option",$(this)).attr("data-select",0);
			$("option:eq("+secNum+")",$(this)).attr("data-select",1);
		})
		//点击TAB
		$("body").delegate(".scriptUpload","click",function(){
			$('.uploadCaptionTitle').html(upload_StreamingData);
		})
		$("body").delegate(".brUpload","click",function(){
			$('.uploadCaptionTitle').html(upload_Attachment);
		})
		//生成Format列表
//		function dataFormatTable(data){
//			$(".formatTable thead").empty();
//			for(var j in data.selected_header){
//				var newTh=$("<th></th>");
//				var newSec=$('<select class="pro_choose formatSelect" data-style="btn border-blue font-blue btn-default dropdown-toggle"></select>');
//				for(var i in data.selected_header){
//					newSec.append($('<option value="'+data.selected_header[i]+'"data-select=0>'+data.selected_header[i]+'</option>'))
//				}
//				newSec.selectpicker({
//					width:"100px",
//					size: 10,
//				});
//				$("option",newSec).each(function(){
//					if($(this).attr("value")==data.selected_header[j]){
//						$(this).attr("selected",true)
//						$(this).attr("data-select",1)
//					}
//				})
//				newTh.append(newSec)
//				$(".formatTable thead tr").append(newTh);
//			}
//			for(var i in data.body_content){
//				var newTr=$("<tr></tr>");
//				for(var l in data.body_content[i]){
//					newTr.append($("<td>"+data.body_content[i][l]+"</td>"))
//				}
//				$(".formatTable").append(newTr);
//			}
//		}
		  //新建项目
		var addProCheck=false;
		$("#go_sumb2").attr("class","btn default disabled")
		$("#new_name").blur(function(){
			$.ajax({
                async: true,
                type: "post",
                url: "/api/project.open?cmd=WEL:VALIDATEPROJECTNAME",
                data: {
                	name:$("#new_name").val()
                },
                success: function(data) {
                	if(data.code === "20007" && $("#new_name").val()!==''){
                		addProCheck=true;
                		$("#go_sumb2").attr("class","btn btn-primary")
                		$("#new_name").parent().removeClass("has-error")
                		$("#new_name").next().text("")
                	}else if(data.code === "20000"){
                		addProCheck=false;
                		$("#go_sumb2").attr("class","btn default disabled")
                		$("#new_name").parent().addClass("has-error")
                		$("#new_name").next().text(Dynamic.upload_proRepetition)
                	}
					if($("#new_name").val()==''){
						addProCheck=false;
                		$("#go_sumb2").attr("class","btn default disabled")
                		$("#new_name").parent().addClass("has-error")
                		$("#new_name").next().text(Dynamic.upload_proNameEmpty)
					}
                },
                error: function(data){
                }
			})
		})
		$("#newModal").on("hide.bs.modal", function () {
			$("#new_name").val('')
			$("#new_des").val('')
			$("#new_name").next().text("")
			addProCheck=false
			$("#new_name").parent().removeClass("has-error")
			$("#go_sumb2").attr("class","btn default disabled")
		})
        $("#go_sumb2").click(function() {
        	if(addProCheck){
	        	var n_name="";
	        	var n_des="";
	        	$("#new_name").val() === "" ? n_name = Dynamic.manage_newP : n_name = $("#new_name").val();
                $("#new_des").val() === "" ? n_des = Dynamic.manage_newD : n_des = $("#new_des").val();
	        	var _data={
					projectName:$("#new_name").val(),
					projectDesc:$("#new_des").val()
				};
	            $.ajax({
	                async: true,
	                type: "post",
	                url: "/api/project.open?cmd=WEL:insertfile",
	                data: _data,
	                success: function(data) {
	                	$.ajax({
	            			url:"/api/project.open?cmd=WEL:SELECTPROJECTNAME",
	            			data: {
	                        	roleId:roleID
	                        },
	            			success:function(data){
	            				projectList=data;
	            				var upload_n_setupprojectsuc=Dynamic.upload_n_setupprojectsuc
	            				$('.modal,.modal-backdrop').fadeOut(350);
	            				swal({
			                        title: upload_n_setupprojectsuc,
			                        confirmButtonText: upload_ok,
			                        type: "success",
			                    });
	            				$("#selectUpLoadPro").empty();
	            				for(var i=0;i<data.all.length;i++){
	        						$("#selectUpLoadPro").append("<option value="+data.all[i].name+" data-fileid="+(i)+" data-id="+data.all[i].id+">"+data.all[i].name+"</option>")
	            				}
	            				$("#selectUpLoadPro").append('<option value="'+upload_skipStep+'" data-fileid="" data-id="">'+upload_skipStep+'</option>')
	            				$('#selectUpLoadPro').selectpicker('refresh');

	            				$("#onlineInitProject").empty();
	            				if(data.stream.length!=0){
	            					$("#onlineInitProject").append('<option value="'+Dynamic.upload_skipStep+'" data-fileid="" data-id="">'+Dynamic.upload_skipStep+'</option>')
	            					for(var i=0;i<data.stream.length;i++){
	            						$("#onlineInitProject").append("<option value="+data.stream[i].id+" data-fileid="+(i)+" data-id="+data.stream[i].id+">"+data.stream[i].name+"</option>")
	            					}
	            				}else{
	            					$("#onlineInitProject").append('<option value="'+Dynamic.upload_streamCreatProject+'" data-fileid="" data-id="">'+Dynamic.upload_streamCreatProject+'</option>')
	            				}
	            			}
	            		})
	    			},
	                error: function() {
	                	swal({
	                        title: "操作失败",
	                        confirmButtonText: upload_ok,
	                        type: "error",
	                    });
	                }
	            });
			}else{
				return
			}
        })

        $(".copyScript").click(function(){
        	$("#config_file_out_path").select();
        	document.execCommand("Copy"); // 执行浏览器复制命令
        	swal({
                title:"",
                text: Dynamic.upload_copySuccess,
                type: "info",
                confirmButtonClass: "btn-success",
                confirmButtonText: upload_ok,
                closeOnConfirm: false
           });
        })
		//uploadForm
		// var options={
		// 	success:function(data){
		// 	}
		// }
		// $("#uploadForm").ajaxForm(options)
		//buildScript 1to2
		//buildScript 1to2
        $("#customTag").keyup(function(e){
        	 e = e || window.event;
        	 var that=$(this).val();
				$.ajax({
					type:"post",
					url:"/api/project.open?cmd=WEL:IFNAMEEXIST",
					data:{
						tag:that
					},
					async:true,
					cache : true,
					//dataType : "json", //返回json格式
					success:function(data){
						if(that==data.name){
							$('#customTag').val('')
							//判断是否有文件选中
					              swal({
					                    title:"",
					                    text: upload_submitBtntips11,
					                    type: "warning",
					                    confirmButtonClass: "btn-danger",
					                    confirmButtonText: upload_ok,
					                    closeOnConfirm: false
					                  });
					              return;
						}
					},
					error : function() {// 请求失败处理函数
						swal({
							title: "Session过期，请重新登录！",
							text: "",
							type: "info",
							confirmButtonText: upload_ok,
							closeOnConfirm: false
						})
					}

					})
			});
		$(".buildBtn").click(function(){
			var path=$("#logPath").val();
			var logType=$("#logTypeSelect").val();
//			var tag=$("#customTag").val();
			var initPids = $("option:selected",$("#onlineInitProject")).attr("data-id")
			//判断是否有文件选中
			if(initPids == ""){
				swal({
					  title:"",
					  text: upload_submitBtntips16,
					  type: "warning",
					  confirmButtonClass: "btn-danger",
					  confirmButtonText: upload_ok,
					  closeOnConfirm: false
					});
				return;
			}

			if(path.trim()==""){
				swal({
					  title:"",
					  text: upload_submitBtntips12,
					  type: "warning",
					  confirmButtonClass: "btn-danger",
					  confirmButtonText: upload_ok,
					  closeOnConfirm: false
					});
				return;
			}

			if(logType.trim()=="选择日志类型"){
				swal({
					  title:"",
					  text: upload_submitBtntips13,
					  type: "warning",
					  confirmButtonClass: "btn-danger",
					  confirmButtonText: upload_ok,
					  closeOnConfirm: false
					});
				return;
			}

			//得到页面填写打事实上传参数，调用后台，生成下载的配置文件
			var l = Ladda.create(this);
			l.start();
			$.ajax({
				async: true,
				cache: true,
				type: "get",
				dataType: "json", //返回json格式
				url: "/api/upload.open?cmd=WEL:GETCURLCOMMAND",
				data:{
					roleId:roleID,
					path:path,
					logType:logType,
					projectIds:initPids
				},
				success: function(data) { //请求成功后处理函数。
					l.stop();
					$("#config_file_out_path").val(data.pattern);
					$(".flowUploadStep:eq(0)").addClass("done");
					$(".flowUploadStep:eq(1)").addClass("active");
					$(".scriptUploadBox1").fadeOut();
					setTimeout(function(){
						$(".scriptUploadBox2").fadeIn();
					}, 100)

					$(".scriptUploadFlow li:eq(1)").addClass("scriptUploadFlowActive");
				}
			});

		})
		//nextPage
		$(".nextPage").each(function(index){
			$(this).click(function(){
				$(".scriptUploadBox"+(index+2)).hide();
				$(".scriptUploadBox"+(index+3)).show();
				$(".flowUploadStep:eq("+(index+1)+")").addClass("done");
				$(".flowUploadStep:eq("+(index+2)+")").addClass("active");
			})
		})
		//prevPage
		$(".prevPage").each(function(index){
			$(this).click(function(){
				$(".scriptUploadBox"+(index+2)).hide();
				$(".scriptUploadBox"+(index+1)).show();
				$(".flowUploadStep:eq("+(index)+")").removeClass("done");
				$(".flowUploadStep:eq("+(index+1)+")").removeClass("active");
			})
		})
	}
	return {
		render:render
	}
})


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var hour=date.getHours();
    if (hour >= 1 && hour <= 9) {
    	hour = "0" + hour;
    }
    var minutes=date.getMinutes();
    if (minutes >= 1 && minutes <= 9) {
    	minutes = "0" + minutes;
    }
    var seconds=date.getSeconds();
    if (seconds >= 1 && seconds <= 9) {
    	seconds = "0" + seconds;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + minutes
            + seperator2 + seconds;
    return currentdate;
}
