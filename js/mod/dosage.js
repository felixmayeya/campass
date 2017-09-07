define(["text!/tpl/dosage.html"],function(html){
	function render(){
		//HTML节点注入section中
		$(".page-content").html(html);
		$.ajax({
			async: true,
			cache: true,
			type: "post",
			dataType: "json", //返回json格式
			url: "/api/dosage.open",
			data: {},
			success: function(data) { //请求成功后处理函数。
				console.log(data)
				$.each(data, function(index, values) { // 解析出data对应的Object数组
					if(values.projectname == null && values.projectdesc == null) {
						values.projectname = "";
						values.projectdesc = "";
					}
						var tr = $("<tr class='tr_mid' data-chose='0'>" +
								"<td ><input type='checkBox' name='name' value='' class='checkBoxInput'></td>" +
								"<td class='listNum'>" + (index + 1) + "</td>" +
								"<td style='display:none' id='fileId'>"+values.ds_id+"</td>" +
								"<td>"+ values.uptime +"</td>" +
								"<td>" + values.deadtime + "</td>" +
								"<td>"+values.name+"</td>" +
								"<td>" + values.projectname + "</td>" +
								"<td>" + values.filesize+"b</td>" +
								"<td style='display:none' id='projectid'>" + values.projectid + "</td>" +
								"</tr>");
					$("table").append(tr);
				})
			}
			});

		$(".tr_mid").each(function() {
			$(this).on("click", function() {
				if($(this).attr("data-chose") == 0) {
					$(this).css("border-color", "#265577");
					$(".checkBoxInput",$(this)).prop("checked",true);
					$(this).attr("data-chose","1");
				}else{
					$(this).removeAttr("style");
					$(this).attr("data-chose","0");
					$(".checkBoxInput",$(this)).prop("checked",false);
				}
			});
		});
		$("#allCheck").click(function(){
			var allCheckMark=0;
			$(".tr_mid").each(function() {
				if($(this).attr("data-chose") == 0){
					allCheckMark++;
				}
			});
			if(allCheckMark==0){
				$(".tr_mid").each(function() {
					$(this).removeAttr("style");
					$(this).attr("data-chose","0");
					$(".checkBoxInput",$(this)).prop("checked",false);
				});
			} else {
				$(".tr_mid").each(function() {
					$(this).css("border-color", "#265577");
					$(this).attr("data-chose","1");
					$(".checkBoxInput",$(this)).prop("checked",true);
				});
			}
		});
		$("#delChose").click(function(){
			$(".tr_mid[data-chose='1']").each(function(){
				$(this).remove();
			});
		});
	}
	return {
		render:render
	};
});
