define(["text!/tpl/package.html","ion","jqueryForm"],function(a){function n(){$(".page-content").html(a),$(function(){var a=0,n=0,e=0,t=Dynamic.package_value1,c=Dynamic.package_value2,s=Dynamic.package_value3;$.ajax({async:!1,type:"get",dataType:"json",url:"/api/check.open?cmd=WEL:SELECTPACKAGEBYUSERIDROLEID",success:function(i){i&&"{}"!=JSON.stringify(i)?(a=$.inArray(i.comp[0],t),n=$.inArray(i.comp[1],c),e=$.inArray(i.comp[2],s),a==-1||n==-1||e==-1?($("#mspan1").val(t[1]),$("#mspan2").val(c[1]),$("#mspan3").val(s[1]),$("#mspan4").text(Dynamic.package_sum)):($("#mspan1").val(t[a]),$("#mspan2").val(c[n]),$("#mspan3").val(s[e]),$("#mspan4").text(i.comp[3]))):($("#mspan1").val(t[1]),$("#mspan2").val(c[1]),$("#mspan3").val(s[1]),$("#mspan4").text(Dynamic.package_sum))}}),changeLanguage("package"),$("#range_01").ionRangeSlider({grid:!0,from:a,hide_min_max:!0,from_min:1,force_edges:!0,values:t}),$("#range_01").change(function(){$("#mspan1").val($(this).val())}),$("#range_02").ionRangeSlider({grid:!0,from:n,hide_min_max:!0,from_min:1,values:c}),$("#range_02").change(function(){$("#mspan2").val($(this).val())}),$("#range_03").ionRangeSlider({grid:!0,from:e,hide_min_max:!0,from_min:1,values:s}),$(".mod2 .portlet-body .small").css("left","0"),$("#range_03").change(function(){$("#mspan3").val($(this).val())}),$("#trans").click(function(){$.post("/api/check.open?cmd=WEL:NOTICESALER",function(){swal({title:Dynamic.package_tell,text:Dynamic.package_hours,confirmButtonText:Dynamic.manage_sl_apply,type:"success"})})}),$("#myForm").ajaxForm(function(){swal({title:Dynamic.package_tell,confirmButtonText:Dynamic.manage_sl_apply,type:"success"},function(){$("#myModal").modal("hide")})}),$("#sure").click(function(){var a=$("#mspan1").val(),n=$("#mspan2").val(),e=$("#mspan3").val(),t=$("#mspan4").text();"zh"==localStorage.getItem("language")?(a=a.substring(0,a.length-4),n=n.substring(0,n.length-2),e=e.substring(0,e.length-1),t=t.substring(0,t.length-1)):(a=a.substring(0,a.length-8),n=n.substring(0,n.length-6),e=e.substring(0,e.length-3),t=t.substring(0,t.length-4));var c={deploy:a,compact:n,duration:e,total:t};$.post("/api/check.open?cmd=WEL:INSERTPACKAGEORDER",c,function(){swal({title:Dynamic.package_sure,text:Dynamic.package_create,confirmButtonText:Dynamic.manage_sl_apply,type:"success"})})}),$(".trange").change(function(){var a=$("#range_01").val(),n=$("#range_02").val(),e=$("#range_03").val();"zh"==localStorage.getItem("language")?(a=a.substring(0,a.length-4),n=n.substring(0,n.length-2),e=e.substring(0,e.length-1)):(a=a.substring(0,a.length-8),n=n.substring(0,n.length-6),e=e.substring(0,e.length-3));var t={data_config:a,contract_period:n,storage_days:e};$.ajax({async:!0,type:"post",dataType:"json",data:t,url:"/api/check.open?cmd=WEL:SELECTPACKAGEPRICE",success:function(a){$("#mspan4").html(a.contractPrice+Dynamic.package_yuan)}})})})}return{render:n}});