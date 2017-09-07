define([
    "text!/tpl/ehome.html",
    'css!/css/ehome.css',
    "jqueryUi"
], function(html) {

    function render() {
        //HTML节点注入section中
        $(".page-content").html(html);
        changeLanguage("ehome");
        //选择项目初始化
        $('#selectProject').selectpicker({
            width: "auto",
            title: Dynamic.home_chooseTxt,
            size: 10,
        });
        $.ajax({
            url: "/api/project.open?cmd=WEL:SELECTPROJECTNAME",
            data: {
                roleId: roleID
            },
            success: function(data) {
                $("#selectProject").empty();
                $("#selectProject").append('<option data-id="all" data-i18n="ehome_allProject">' + Dynamic.home_chooseTxt + '</option>');
                for (var i = 0; i < data.use.length; i++) {
                    $("#selectProject").append("<option value=" + data.use[i].name + " data-id=" + data.use[i].id + ">" + data.use[i].name + "</option>");
                }
                $("#selectProject").selectpicker('render');
                $("#selectProject").selectpicker('refresh');
            }
        });
      //判断变量跳转至升级套餐页面
        if(localStorage.getItem("OPTION_PACKAGE") == '1'){
        	window.location.href="#/package";
        	localStorage.setItem("OPTION_PACKAGE",0)
        }
        //频率格式转换
        var mintoday = function(frequency, units) {
            var _freq;
            if (units == "MM") {
                _freq = frequency + Dynamic.emonitor_t_s;
            } else if (units == "HH") {
                _freq = frequency / 60 + Dynamic.emonitor_t_h;
            } else if (units == "DD") {
                _freq = frequency / 1440 + Dynamic.emonitor_t_d;
            } else if (units == "WW") {
                _freq = frequency / 10080 + Dynamic.emonitor_t_w;
            }
            return _freq;
        };
        //任务列表生成
        function task() {
            $.ajax({
                async: true,
                type: "GET",
                dataType: "json",
                url: "/api/monitortask.open?cmd=WEL:GETALLTASK",
                success: function(data) {
                    if (data.homeOrder == null) {
                        return;
                    }
                    var _index = data.homeOrder.reporttype.split(",");
                    var _cont = "";
                    var _conts = [];
                    $.each(data.monitortask, function(index, values) {
                        var hours1 = mintoday(values.frequency, values.time_units);
                        var hours2 = mintoday(values.range, values.range_units);
                        var startDate = "",endDate = "";
                        values.detailstart_date == null?startDate = "":startDate = values.detailstart_date;
                        values.detailend_date == null?endDate = "":endDate = values.detailend_date;
                        var ifEmail="";
                    	if(values.email==""){
                    		ifEmail="";
                    	}else if(values.email!="" && values.send_mail==0){
                    		ifEmail=' <button type="button" class="btn yellow btn-outline uppercase memail ladda-button" data-status="1" data-style="zoom-in"><span class="ladda-label">' + Dynamic.ehome_yemail + '</span></button>';
                    	}else if(values.email!="" && values.send_mail==1){
                    		ifEmail=' <button type="button" class="btn yellow btn-outline uppercase memail ladda-button" data-status="0" data-style="zoom-in"><span class="ladda-label">' + Dynamic.ehome_nemail + '</span></button>';
                    	}
                        _cont += '<li class="portlet portlet-sortable col-lg-6 col-xs-12 col-sm-12 portbox" style="padding:15px;margin-bottom:0;" data-key="' + values.key_word + '" data-id="' + values.id + '" data-proid="' + values.project_id + '">\
									<div class="portlet light bordered port1" style="margin-bottom:0;">\
										<div class="portlet-title ui-sortable-handle porttitle">\
											<div class="caption">&nbsp;\
												<span class="titleProIdSpan">' + values.project_name + '</span>\
											</div>\
											<div class="actions">\
												<button type="button" class="btn green btn-outline uppercase mesearch">' + Dynamic.emonitor_detail + '</button>\
												<button type="button" class="btn blue btn-outline uppercase medetail">' + Dynamic.emonitor_godetail + '</button>'+ifEmail
												+'<i class="fa fa-close mission_del"></i>\
											</div>\
										</div>\
										<div class="portlet-body row">\
											<div class="col-xs-12 leftport">\
												<h1>' + values.data_count + '<e data-i18n="ehome_allProject">' + Dynamic.emonitor_span + '</e></h1>\
												<p>' + startDate + ' -- ' + endDate + '</p>\
											</div>\
											<div class="col-xs-12 rightport">\
												<p><b>' + Dynamic.emonitor_cont + '</b>：' + values.key_word + '</p>\
												<p><b>' + Dynamic.emonitor_project + '</b>：' + values.project_name + '</p>\
												<p><b>' + Dynamic.emonitor_frequency + '</b>：' + hours1 + '</p>\
												<p><b>' + Dynamic.emonitor_range + '</b>：' + hours2 + '</p>\
												<p><b>' + Dynamic.emonitor_create + '</b>：' + values.input_date + '</p>\
											</div>\
										</div>\
									</div>\
								</li>';
              });
                    //排序
                    $("#portable").prepend(_cont);
                    $.each(_index, function(index) {
                        _conts.push($("#portable li[data-id='" + this + "']"));
                    });
                    $("#portable li").remove();
                    $("#portable").prepend(_conts);
                }
            });
        }
        task();
        //sortable初始化
        $("#portable").sortable({
            revert: 330,
            distance: 50,
            forcePlaceholderSize: true,
            items: "li",
            handle: ".portlet-title",
            containment: "body",
            update: function() { //首页图表拖拽后保存
                var indexArr = [];
                $(".portbox").each(function() {
                    indexArr.push($(this).attr("data-id"));
                });
                var arr = indexArr.join(",");
                $.ajax({
                    type: "post",
                    url: "/api/monitortask.open?cmd=WEL:INSERTHOMEPAGE",
                    data: {
                        reporttype: arr
                    },
                    success: function(data) {
                        storageArr = newStorageArr;
                    },
                    error: function() { // 请求失败处理函数
                        console.log(Dynamic.strings_senderror);
                    }
                });
            }
        });
        //项目筛选
        $("#selectProject").change(function() {
            var _pid = $("#selectProject").find("option:selected").attr("data-id");
            $("#portable li").hide();
            if (_pid == "all") {
                $("#portable li").show();
            } else {
                $("#portable li[data-proid='" + _pid + "']").show();
            }
        });
        //删除任务
        $("body").delegate(".mission_del", "click", function() {
            var _mid = $(this).parents(".portbox").attr("data-id");
            swal({
                    title: Dynamic.home_delete,
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: Dynamic.home_ok,
                    cancelButtonText: Dynamic.home_cancel,
                    closeOnConfirm: false,
                    closeOnCancel: true,
                    showLoaderOnConfirm: true
                },
                function() {
                    $.ajax({
                        type: "post",
                        url: "/api/monitortask.open?cmd=WEL:DELETEMONITORTASK",
                        data: {
                            monitor_id: _mid
                        },
                        success: function() {
                            swal({
                                title: Dynamic.home_deletesuc,
                                confirmButtonText: Dynamic.home_ok,
                                type: "success",
                            }, function() {
                                $("#portable li").remove();
                                task();
                            });
                        },
                        error: function() { // 请求失败处理函数
                            console.log(Dynamic.strings_senderror);
                        }
                    });
                });

        });
        //历史趋势跳转
        $("body").delegate(".medetail", "click", function() {
            localStorage.setItem("MESEARCH", $(this).parents("li").attr("data-id"));
            location.href = "#/task_detail";
        });
        //详情跳转
        $("body").delegate(".mesearch", "click", function() {
            localStorage.setItem("SEARCH_PID", $(this).parents("li").attr("data-proid"));
            localStorage.setItem("SEARCH_KEY", $(this).parents("li").attr("data-key"));
            location.href = "#/search";
        });
        //开启、关闭邮件提醒
        $("body").delegate(".memail", "click", function() {
        	var that=$(this);
        	var l = Ladda.create(this);
        	l.start();
            var _mid = that.parents(".portbox").attr("data-id");
            var _status=that.attr("data-status");
            $.ajax({
                type: "post",
                url: "/api/monitortask.open?cmd=WEL:CANCELEMAIL",
                data: {
                    monitor_id: _mid,
                    changeEmailStatus:_status
                },
                success: function() {
                	if(_status == 0){
                		swal({
                            title: Dynamic.ehome_nemailA,
                            confirmButtonText: Dynamic.home_ok,
                            type: "success",
                        },function(){
                        	that.attr("data-status","1").html(Dynamic.ehome_yemail);
                        	l.stop();
                        });
                	}else{
                		swal({
                            title: Dynamic.ehome_yemailA,
                            confirmButtonText: Dynamic.home_ok,
                            type: "success",
                        },function(){
                        	that.attr("data-status","0").html(Dynamic.ehome_nemail);
                        	l.stop();
                        });
                	}

                },
                error: function() { // 请求失败处理函数
                    console.log(Dynamic.strings_senderror);
                }
            });

        });

    }
    return {
        render: render
    };
});
