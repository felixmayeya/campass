define(["text!/tpl/uploadParse.html",
"jqueryForm",
],function(html){
	function render(){
		var noAnalysis=false;
		$(".formatTable thead").empty();
		$(".formatTable tbody").empty();
		$(".parseLoading").css("display","block");
		$("#parseSave").undelegate();
		$("#saveFormat").undelegate();
		$("#saveAndAnalysis").undelegate();
		//HTML节点注入section中
		$(".page-content").html(html);
		changeLanguage("upload")
		if(localStorage.getItem("FILE_PATH_DATA")!=""){
			console.log("local")
			filePath=JSON.parse(localStorage.getItem("FILE_PATH_DATA"));
			localStorage.setItem("FILE_PATH_DATA","");
		}
		console.log(filePath)
		if(filePath!=""){
			var _filePath=filePath.file_path
			console.log(_filePath)
			$.ajax({
				url:"/api/preResolution.open?cmd=WEL:SELECTPRERESOLUTIONBYTAG",
				async : true,
				cache : false,
				type : "post",
				data : {
					fileId:_filePath
				},
				success:function(data){
					console.log(data)

					if(!data.error && data!=false){
						$(".parseLoading").css("display","none");
						var selectTr=$("<tr id='selectTr'></tr>")
						for(var i=0;i<data["header"].length;i++){
							var selectTh=$("<th></th>")
							var selectDom=$('<select class="pro_choose formatSelect" data-style="btn border-blue font-blue btn-default dropdown-toggle"></select>')
									for(var j=0;j<data.header.length;j++){
										var optionTh=$("<option value="+data["header"][j]+" data-select=0>"+data["header"][j]+"</option>")
										if(optionTh.val()==data["header"][i]){
											optionTh.attr("selected",true);
											optionTh.attr("data-select",1);
										}
										selectDom.append(optionTh)
									}
							selectTh.append(selectDom)
							selectTr.append(selectTh)
						}
						$(".formatTable thead").append(selectTr);
						for(var i=0;i<data["body"].length;i++){
							var prewDataTr=$("<tr></tr>");
							for(var j=0;j<data["body"][i].length;j++){
								var prewDataTd=$("<td>"+data["body"][i][j]+"</td>")
								prewDataTr.append(prewDataTd)
							}
							$(".formatTable tbody").append(prewDataTr);
						}
						if(data.streamTag!=null){
							$(".parseFormatTable th select").attr("disabled",true)
							$("#uploadTitle").text(Dynamic.upload_Streamingtxt1)
							//save按钮事件委托
							$("#parseSave").show();
							$("body").delegate('#parseSave','click',function(){
									swal({
										title: Dynamic.uploadParse_saveAnalysis,
										text:  Dynamic.uploadParse_saveAnalysisexp,
										type: "info",
										showCancelButton: true,
										closeOnConfirm:false,
										confirmButtonClass: "btn-success",
										confirmButtonText: Dynamic.upload_confirm,
										cancelButtonText: Dynamic.upload_cancel,
									},function(){
										swal({
											title: Dynamic.upload_saveAnalysistips,
											showConfirmButton: false
											})
										var confirmPrewData=[];
										for(var i=0;i<$(".resolvingBox option[data-select=1]").length;i++){
											confirmPrewData.push($(".resolvingBox option[data-select=1]").eq(i).val())
										}
										console.log(confirmPrewData)
										$.ajax({
											async: true,
											cache: true,
											type: "post",
											url: "/api/preResolution.open?cmd=WEL:CONFIRMPRERESOLUTION",
											data: {
												header:confirmPrewData.toString(),
												fileId:_filePath
											},
											success: function(data) { //请求成功后处理函数。
												selectFileFlag=false;
												swal({
													title: "操作成功",
													text: "",
													confirmButtonText: "确定",
													type: "success"
												},function(){
													closeThisMessage(filePath.id,userID)
													localStorage.setItem("OPTION_MANAGE",1)
													location.href="#/index";
												});
											}
										});
									})
							});
						}else{
							$("#saveFormat").show();
							$("#saveAndAnalysis").show();
							$("body").delegate("#saveFormat","click",function(){
								swal({
									title: Dynamic.upload_save,
									text: Dynamic.upload_saveexp,
									type: "info",
									showCancelButton: true,
									closeOnConfirm:false,
									confirmButtonClass: "btn-success",
									confirmButtonText: Dynamic.upload_ok,
									cancelButtonText: Dynamic.upload_cancel,
								},function(){
									swal({
										title: Dynamic.upload_saveAnalysistips,
										showConfirmButton: false
										})
									var confirmPrewData=[];
									for(var i=0;i<$(".resolvingBox option[data-select=1]").length;i++){
										confirmPrewData.push($(".resolvingBox option[data-select=1]").eq(i).val())
									}
				 					$.ajax({
										async: true,
										cache: true,
										type: "post",
										url: "/api/upload.open?cmd=WEL:SAVENOTCOMPIRE",
										data: {
											projectId:data.projectId,
											fileId:data.fileId,
											header:confirmPrewData.toString()
										},
										success: function(data) { //请求成功后处理函数。
											selectFileFlag=true;
											swal({
												title: Dynamic.upload_submitBtntips14,
												text: "",
												confirmButtonText: Dynamic.upload_ok,
												type: "success"
											}
											,function(){
												localStorage.setItem("OPTION_MANAGE",1)
												location.href="#/index";
												closeThisMessage(filePath.id,userID)
											});
 										},
										error: function(XMLHttpRequest, textStatus, errorThrown) {
											 alert(XMLHttpRequest.status);
											 alert(XMLHttpRequest.readyState);
											 alert(textStatus);
									   }
									});
								})
						});
						$("body").delegate("#saveAndAnalysis","click",function(){
							if(noAnalysis===false){

								swal({
									title: Dynamic.upload_saveAnalysis,
									text: Dynamic.upload_saveAnalysisexp,
									type: "info",
									showCancelButton: true,
									closeOnConfirm:false,
									confirmButtonClass: "btn-success",
									confirmButtonText: Dynamic.upload_confirm,
									cancelButtonText: Dynamic.upload_cancel,
								},function(){
									swal({
										title: Dynamic.upload_saveAnalysistips,
										showConfirmButton: false
										})
									var confirmPrewData=[];
									for(var i=0;i<$(".resolvingBox option[data-select=1]").length;i++){
										confirmPrewData.push($(".resolvingBox option[data-select=1]").eq(i).val())
									}
									$.ajax({
										async: true,
										cache: true,
										type: "post",
										url: "/api/upload.open?cmd=WEL:SUBMITFILECOMPIE",
				   						data: {
				   							header:confirmPrewData.toString(),
											fileId:data.fileId,
											projectId:data.projectId
										},
										success: function(data) { //请求成功后处理函数。
											selectFileFlag=false;
											swal({
												title: Dynamic.upload_submitBtntips14,
												text: "",
												confirmButtonText: Dynamic.upload_ok,
												type: "success"
											},function(){
												closeThisMessage(filePath.id,userID)
												localStorage.setItem("OPTION_MANAGE",1)
												location.href="#/index";
											});
										}
									});
								})
							}
						});
						}
					}else if(data.error && data!=false){
						swal({
							title: data.error,
							text: "",
							confirmButtonText: Dynamic.upload_ok,
							type: "error"
						},function(){
							closeThisMessage(filePath.id,userID)
							location.href="#/upload";
						});
					}
				}
			})
			$(".parseFormatTable").delegate(".formatSelect","change",function(){
				$("option",$(this)).not($("option:selected",$(this))).removeAttr("selected");
				$("option",$(this)).not($("option:selected",$(this))).attr("data-select",0);
				$("option:selected",$(this)).attr("selected",true);
				$("option:selected",$(this)).attr("data-select",1);
			})
		}else{
			location.href="/index.html"
		}
	}
    return {
      render:render
    }
  })
