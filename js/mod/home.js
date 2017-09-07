define([
    "text!/tpl/home.html",
    'css!/css/home.css',
    "homeCharts",
    "jqueryUi"
], function(html) {
    var calendar,
        loadcharts,
        home_delete = Dynamic.home_delete,
        home_deletesuc = Dynamic.home_deletesuc,
        home_deletefaild = Dynamic.home_deletefaild,
        home_ok = Dynamic.home_ok,
        home_cancel = Dynamic.home_cancel;
    function render() {
        //HTML节点注入section中
        $(".page-content").html(html);
        //判断变量跳转至升级套餐页面
        if(localStorage.getItem("OPTION_PACKAGE") && localStorage.getItem("OPTION_PACKAGE") == '1'){
        	window.location.href="#/package";
        	localStorage.setItem("OPTION_PACKAGE",0)
        }
        //判断变量跳转至资源管理页面
        if(localStorage.getItem("OPTION_MANAGE") && localStorage.getItem("OPTION_MANAGE") == '1'){
        	window.location.href="#/manage";
        	localStorage.setItem("OPTION_MANAGE",0)
        }
        var homePro_chooseTxt = Dynamic.home_chooseTxt;
        //选择项目初始化
        $('#selectPro').selectpicker({
            width: "100px",
            title: homePro_chooseTxt,
            size: 10,
        });
        //注册地图
        registMap(mapType)
        $.ajax({
            url: "/api/project.open?cmd=WEL:SELECTPROJECTNAME",
            data: {
                roleId: roleID
            },
            success: function(data) {
            	var tpl='';
            	$('#selectPro').empty();
            	$('#selectPro').append('<option value="" data-fileid="1" data-id="" data-i18n="home_allProject">' + homePro_chooseTxt + '</option>')
                for (var i = 0; i < data.use.length; i++) {
                	tpl+="<option value=" + data.use[i].name + " data-fileid=" + (i + 1) + " data-id=" + data.use[i].id + ">" + data.use[i].name + "</option>"
                }
              //获取到数据后重新渲染下拉框并刷新
                $('#selectPro').append(tpl)
                $('#selectPro').selectpicker('render');
                $('#selectPro').selectpicker('refresh');
                $('#selectPro').selectpicker({
                    width: "100px",
                    title: homePro_chooseTxt,
                    size: 10,
                });
            }
        })
        // var indexEndTime, indexStartTime;
        if (localStorage.getItem("ANALYSIS_START_TIME") != "" && localStorage.getItem("ANALYSIS_START_TIME") != null) {
            endTime = moment(localStorage.getItem("ANALYSIS_END_TIME").toString()).format("YYYYMMDDHHmm");
            startTime = moment(localStorage.getItem("ANALYSIS_START_TIME").toString()).format("YYYYMMDDHHmm");
        } else {
            // indexEndTime = new Date();
            // indexStartTime = new Date();
            // indexStartTime.setHours(0, 0, 0, 0);
            // indexEndTime.setHours(0, 0, 0, 0);
            // indexEndTime.add("d", +1);
            // startTime = indexStartTime.Format("yyyyMMddhhmm");
            // endTime = indexEndTime.Format("yyyyMMddhhmm");

            startTime = moment().startOf("day").format("YYYYMMDDHHmm");
            endTime = moment().add(1, "d").startOf("day").format("YYYYMMDDHHmm");
        }
        console.log("正在获取首页信息...")
        $(".box2").show();
        loadcharts = echarts.init(document.getElementById("loadbox"));
        loadcharts.showLoading({
            text: 'loading',
            color: '#678098',
            textColor: '#678098',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        });
        $.ajax({
            type: "get",
            url: "/api/toppage.open?cmd=WEL:GETTOPLIST",
            async: true,
            cache: true,
            data: {
                startTime: startTime,
                endTime: endTime,
                // startTime: timeZoneChange(startTime+""),
                // endTime: timeZoneChange(endTime+""),
                country: mapType,
                timeZone: 8
            },
            dataType: "json", // 返回json格式
            success: function(data) {
                console.log("成功获取首页信息...")
                loadcharts.hideLoading();
                $(".box2").hide();
                setTimeout(function() {
                    $(".loadingBox").fadeOut();
                }, 1000)
                if (data.cList != "" && data.cList != undefined) {
                    storageArr = data.cList;
                    projectNameList = data.nameList;
                    //<--循环创建图表-->
                    if (storageArr != []) {
                        $(".chartViewBox").empty();
                        for (var i = 0; i < storageArr.length; i++) {
                            var dataP = data.sList[i];
                            var chartViewProId = storageArr[i].split("|")[3];
                            //图和上面的项目下拉框左侧不对齐，暂时增加一个padding..不修改css文件 style='padding:15px 15px 15px 15px;'
                            var chartView = $("<li class='portlet portlet-sortable light col-lg-6 col-xs-12 col-sm-12'  style='padding:15px 15px 15px 15px;'>" +
                                "<div class='chartViewBlock portlet light bordered'>" +
                                "<div class='chartViewTitle portlet-title'>" +
                                "<div class='caption'><i class='fa fa-folder-o font-blue-sharp'>" +
                                "</i></div><div class='actions'>" +
                                "<a class='btn btn-circle btn-icon-only btn-default shadeBox' title='跳转至该报表' href='javascript:;'>" +
                                "<i class=' icon-action-redo'></i></a> " +
                                "<a class='btn btn-circle btn-icon-only btn-default delChartView' title='删除' href='javascript:;'>" +
                                "<i class='icon-trash'></i></a></div></div><div class='chartView portlet-body'><div class='chartBox viewNum" + i + "'>" +
                                "</div></div></div></div></li>");
                            $(".chartViewBox").append(chartView);
                            ajaxCheck(storageArr[i], i, dataP);
                        }
                        $(".shadeBox").tooltip();
                        $(".delChartView").tooltip();
                        //sortable初始化
                        $("#sortable").sortable({
                            revert: 330,
                            distance: 50,
                            forcePlaceholderSize: true,
                            items: "li",
                            handle: ".chartViewTitle",
                            containment: "body",
                            update: function() { //首页图表拖拽后保存
                                if (indexProjectSelected == false) {
                                    var indexArr = new Array;
                                    var newStorageArr = new Array;
                                    $(".chartBox").each(function() {
                                        indexArr.push(parseInt($(this).attr("class").replace("chartBox viewNum", "")))
                                    })
                                    for (var i = 0; i < indexArr.length; i++) {
                                        newStorageArr.push(storageArr[indexArr[i]])
                                    }
                                    $.ajax({
                                        type: "post",
                                        url: "/api/toppage.open",
                                        data: {
                                            storageArr: newStorageArr
                                        },
                                        async: true,
                                        cache: true,
                                        success: function(data) {
                                        },
                                        error: function() { // 请求失败处理函数
                                            alert('Error');
                                        }
                                    })
                                }
                            }
                        });
                        $(".chartViewBox").append("<div class='col-lg-6 col-xs-12 col-sm-12' style='padding:15px;'>\
							<div class='chartViewBlock bordered' style='border:2px dashed #c2cddc;padding-bottom: 25px;'>\
								<div class='chartView' style='height:363px;top:0;'>\
									<div class='addChartView'>\
									</div>\
								</div>\
							</div>\
						</div>");
                        $(".chartView:last").click(function() {
                            skipPage = 'PV';
                            skipSwiper = 0;
                            location.href = "#/analysis/pv"
                        })
                    } else {
                        $(".chartView:last").click(function() {
                            skipPage = 'PV';
                            skipSwiper = 0;
                            location.href = "#/analysis/pv"
                        })
                    }
                } else {
                    storageArr = [];
                    $(".chartView:last").click(function() {
                        skipPage = 'PV';
                        skipSwiper = 0;
                        location.href = "#/analysis/pv"
                    })
                }
            },
            error: function() { // 请求失败处理函数
                console.log('获取信息失败...')
//                swal({
//                    title: "获取信息失败，请重新登录！",
//                    text: "",
//                    type: "info",
//                    confirmButtonText: "确定",
//                    closeOnConfirm: false
//                }, function() {
//                    window.location.href = "index.html";
//                })
            }
        })

        function ajaxCheck(e, num, data) {
        	var page=e.split("|")[0]
            if (page === "PV") {
              e.indexOf("global_map") != (-1)?homeMapType="World":homeMapType="China";
              (function(item){
                $.get('js/map/json/'+ item.toLowerCase() +'.json', function (json) {
                  echarts.registerMap(item, json);
                  pvChartViewCheck(e, data, num)
                });
              })(homeMapType)
            } else if (page === "IP") {
              e.indexOf("global_map") != (-1)?homeMapType="World":homeMapType="China";
              (function(item){
                $.get('js/map/json/'+ item.toLowerCase() +'.json', function (json) {
                  echarts.registerMap(item, json);
                  ipChartViewCheck(e, data, num)
                });
              })(homeMapType)
            } else if (page === "DATA") {
              e.indexOf("global_map") != (-1)?homeMapType="World":homeMapType="China";
              (function(item){
                $.get('js/map/json/'+ item.toLowerCase() +'.json', function (json) {
                  echarts.registerMap(item, json);
                  dataChartViewCheck(e, data, num)
                });
              })(homeMapType)
            } else if (page === "STATUS") {
                statusChartViewCheck(e, data, num)
            } else if (page === "BR") {
                brChartViewCheck(e, data, num)
            } else if (page === "OS") {
                osChartViewCheck(e, data, num)
            } else if (page === "REQUEST") {
                requestChartViewCheck(e, data, num)
            } else if (page === "TP") {
                tpChartViewCheck(e, data, num)
            } else if (page === "REFERRER") {
                rfChartViewCheck(e, data, num)
            } else if (page === "CRAWLER") {
                crawlerChartViewCheck(e, data, num)
            } else if (page === "INJECTION") {
                sqlChartViewCheck(e, data, num)
            } else if (page === "LOOPHOLE") {
                fiChartViewCheck(e, data, num)
            } else if (page === "SCRIPT") {
            	xssChartViewCheck(e, data, num)
            }
        }
        //<----------->
        //projectSelectBtn
        $(".homePageHead").delegate(".homePro_choose", "change", function() {
                var i = Number($("li.selected").attr("data-original-index"));
                var _i = $(".homePro_choose option:eq(" + i + ")").attr("data-id");
                if (_i == "") {
                    indexProjectSelected = false;
                    $(".titleProIdSpan").parents(".portlet").show();
                } else {
                    indexProjectSelected = true;
                    $(".titleProIdSpan").each(function() {
                        if ($(this).attr("data-id") == _i) {
                            $(this).parents(".portlet").show();
                        } else {
                            $(this).parents(".portlet").hide();
                        }
                    })
                }
            })
            //<--------------->
            //日期选择
        var weekStTime = (function() {
            if (moment().weekday() == 0) {
                return moment().subtract(7, "d").weekday(1).startOf('day');
            } else {
                return moment().weekday(1).startOf('day');
            }
        })();
        var weekEdTime = (function() {
            if (moment().weekday() == 0) {
                return moment().subtract(7, "d").weekday(1).startOf('day').add(7, "d");
            } else {
                return moment().weekday(1).startOf('day').add(7, "d");
            }
        })();
        var dateRangePickerStartTime = (function() {
            if (localStorage.getItem("ANALYSIS_START_TIME") != "" && localStorage.getItem("ANALYSIS_START_TIME") != null) {
                startTime = moment(localStorage.getItem("ANALYSIS_START_TIME").toString()).format("YYYYMMDDHHmm");
                return moment(localStorage.getItem("ANALYSIS_START_TIME").toString())
            } else {
                return moment().startOf('day')
            }
        })();
        var dateRangePickerEndTime = (function() {
            if (localStorage.getItem("ANALYSIS_END_TIME") != "" && localStorage.getItem("ANALYSIS_END_TIME") != null) {
                endTime = moment(localStorage.getItem("ANALYSIS_END_TIME").toString()).format("YYYYMMDDHHmm");
                return moment(localStorage.getItem("ANALYSIS_END_TIME").toString())
            } else {
                return moment().add(1, "d").startOf('day')
            }
        })();
        var daterange, daterangeArr, datarangeLocal,
            viewData = Dynamic.analysis_viewData;
        if (localStorage.getItem("language") == "zh") {
            daterange = {
                "今日": [
                    moment().startOf('day'),
                    moment().add(1, "d").startOf('day')
                ],
                "昨日": [moment().subtract('days', 1).startOf('day'), moment().startOf('day')],
                "本周": [
                    weekStTime,
                    weekEdTime
                ],
                "本月": [
                    moment().startOf('month'),
                    moment().add(1, "M").startOf('month')
                ],
                "本年": [
                    moment().startOf('year'),
                    moment().add(1, "years").startOf('year')
                ]
            }
            daterangeArr = ['今日', '昨日', '本周', '本月', '本年']
            datarangeLocal = {
                applyLabel: '确定',
                cancelLabel: '关闭',
                customRangeLabel: "自定义日期",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        } else {
            daterange = {
                "Today": [
                    moment().startOf('day'),
                    moment().add(1, "d").startOf('day')
                ],
                "Yesterday": [moment().subtract('days', 1).startOf('day'), moment().startOf('day')],
                "This Week": [
                    weekStTime,
                    weekEdTime
                ],
                "This Month": [
                    moment().startOf('month'),
                    moment().add(1, "M").startOf('month')
                ],
                "This Year": [
                    moment().startOf('year'),
                    moment().add(1, "years").startOf('year')
                ]
            }
            daterangeArr = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Year']
            datarangeLocal = {
                customRangeLabel: "Custom Range"
            }
        }
        if (localStorage.getItem("ANALYSIS_DATE_HTML") != "" && localStorage.getItem("ANALYSIS_DATE_HTML") != null) {
            $("#reportrange>span").html(localStorage.getItem("ANALYSIS_DATE_HTML"))
        } else {
            $("#reportrange>span").html(daterangeArr[0] + "&nbsp;" + (new Date).Format('yyyy-MM-dd') + " -- " + (new Date).add("d", +1).Format('yyyy-MM-dd'));
        }
        $('#reportrange').daterangepicker({
            "ranges": daterange,
            "startDate": dateRangePickerStartTime,
            "endDate": dateRangePickerEndTime,
            locale: datarangeLocal,
            "timePicker": true,
            "timePicker24Hour": true
        }, function(start, end, label) {
            var customStartTime = start.format('YYYYMMDDHHmm');
            var customEndTime = end.format('YYYYMMDDHHmm');
            if (label == "自定义日期" || label == "Custom Range") {
                $("#reportrange>span").html(start.format('YYYY-MM-DD HH:mm') + ' -- ' + end.format('YYYY-MM-DD HH:mm'))
            } else {
                $("#reportrange>span").html(label + "&nbsp;" + start.format('YYYY-MM-DD HH:mm') + ' -- ' + end.format('YYYY-MM-DD HH:mm'))
            }
            localStorage.setItem("ANALYSIS_DATE_HTML", $("#reportrange>span").html())
            localStorage.setItem("ANALYSIS_START_TIME", new Date(start));
            localStorage.setItem("ANALYSIS_END_TIME", new Date(end));
            localStorage.setItem("ANALYSIS_LABLE", label);
            if (label == daterangeArr[0] || label == daterangeArr[1]) {
                interval = "day";
            } else if (label == daterangeArr[2]) {
                interval = "week";
            } else if (label == daterangeArr[3]) {
                interval = "oneMonth";
            } else if (label == daterangeArr[4]) {
                interval = "year";
            }
            if (xhr != undefined) {
                xhr.abort();
            }
            xhr = $.ajax({
                type: "post",
                url: "/api/analysis.open?cmd=WEL:GETDATERYPE",
                data: {
                    startTime: customStartTime,
                    endTime: customEndTime
                    // startTime: timeZoneChange(customStartTime+""),
                    // endTime: timeZoneChange(customEndTime+"")
                },
                async: true,
                cache: true,
                dataType: "json", //返回json格式
                success: function(data) {
                    _interval = data.dateType;
                }
            });
            $(".box2").show();
            loadcharts = echarts.init(document.getElementById("loadbox"));
            loadcharts.showLoading({
                text: 'loading',
                color: '#678098',
                textColor: '#678098',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0
            });
            $.ajax({
                type: "get",
                url: "/api/toppage.open?cmd=WEL:GETTOPLIST",
                async: true,
                cache: true,
                data: {
                    startTime: customStartTime,
                    endTime: customEndTime
                    // startTime: timeZoneChange(customStartTime+""),
                    // endTime: timeZoneChange(customEndTime+"")
                },
                dataType: "json", // 返回json格式
                success: function(data) {
                    loadcharts.hideLoading();
                    $(".box2").hide();
                    if (data.cList != "" && data.cList != undefined) {
                        storageArr = data.cList;
                        projectNameList = data.nameList;
                        //<--循环创建图表-->
                        if (storageArr != []) {
                            $(".chartViewBox").empty();
                            for (var i = 0; i < storageArr.length; i++) {
                                var dataP = data.sList[i];
                                var chartViewProId = storageArr[i].split("|")[3];
                                var chartView = $("<li class='portlet portlet-sortable light col-lg-6 col-xs-12 col-sm-12'  style='padding:15px 15px 15px 15px;'>" +
                                    "<div class='chartViewBlock portlet light bordered'>" +
                                    "<div class='chartViewTitle portlet-title'>" +
                                    "<div class='caption'><i class='fa fa-folder-o font-blue-sharp'>" +
                                    "</i></div><div class='actions'>" +
                                    "<a class='btn btn-circle btn-icon-only btn-default shadeBox' title='跳转至该报表' href='javascript:;'>" +
                                    "<i class=' icon-action-redo'></i></a> " +
                                    "<a class='btn btn-circle btn-icon-only btn-default delChartView' title='删除' href='javascript:;'>" +
                                    "<i class='icon-trash'></i></a></div></div><div class='chartView portlet-body'><div class='chartBox viewNum" + i + "'>" +
                                    "</div></div></div></div></li>");
                                $(".chartViewBox").append(chartView);
                                ajaxCheck(storageArr[i], i, dataP);
                                $(".chartViewDateSpan").html(start.format('YYYY-MM-DD HH:mm') + " -- " + end.format('YYYY-MM-DD HH:mm'))
                            }
                            $(".shadeBox").tooltip();
                            $(".delChartView").tooltip();
                            //sortable初始化
                            $("#sortable").sortable({
                                revert: 330,
                                distance: 50,
                                forcePlaceholderSize: true,
                                items: "li",
                                handle: ".chartViewTitle",
                                containment: "body",
                                update: function() { //首页图表拖拽后保存
                                    if (indexProjectSelected == false) {
                                        var indexArr = new Array;
                                        var newStorageArr = new Array;
                                        $(".chartBox").each(function() {
                                            indexArr.push(parseInt($(this).attr("class").replace("chartBox viewNum", "")))
                                        })
                                        for (var i = 0; i < indexArr.length; i++) {
                                            newStorageArr.push(storageArr[indexArr[i]])
                                        }
                                        $.ajax({
                                            type: "post",
                                            url: "/api/toppage.open",
                                            data: {
                                                storageArr: newStorageArr
                                            },
                                            async: true,
                                            cache: true,
                                            success: function(data) {
                                                storageArr = newStorageArr;
                                            },
                                            error: function() { // 请求失败处理函数
                                              console.log(error)
                                                alert('Error');
                                            }
                                        })
                                    }
                                }
                            });
                            $(".chartViewBox").append("<div class='col-lg-6 col-xs-12 col-sm-12' style='padding:15px;'>\
								<div class='chartViewBlock bordered' style='border:2px dashed #c2cddc;padding-bottom: 25px;'>\
									<div class='chartView' style='height:363px;top:0;'>\
										<div class='addChartView'>\
										</div>\
									</div>\
								</div>\
							</div>");
                            $(".chartView:last").click(function() {
                                skipPage = 'PV';
                                skipSwiper = 0;
                                location.href = "#/analysis"
                            })
                        } else {
                            $(".chartView:last").click(function() {
                                skipPage = 'PV';
                                skipSwiper = 0;
                                location.href = "#/analysis"
                            })
                        }
                    } else {
                        storageArr = [];
                        $(".chartView:last").click(function() {
                            skipPage = 'PV';
                            skipSwiper = 0;
                            location.href = "#/analysis"
                        })
                    }
                },
                error: function() { // 请求失败处理函数
                    swal({
                        title: "获取信息失败，请重新登录！",
                        text: "",
                        type: "info",
                        confirmButtonText: "确定",
                        closeOnConfirm: false
                    }, function() {
                        window.location.href = "login.html";
                    })
                }
            })
        });
        changeLanguage("home");
    }

    //点击切换到分析报表相应页面
    $("body").delegate(".shadeBox", "click", function() {
        var routerName = "";
        projectID = $(".caption .titleProIdSpan", $(this).parents(".chartViewTitle")).attr("data-id");
        indexToAnalysis = true
        var skipNum = parseInt($(this).parent().parent().parent().parent().index());
        var skipArr = storageArr[skipNum].split("|");
        skipPage = skipArr[0];
        var skipType = skipArr[1];
        if (skipPage == "PV") {
            if (skipType == "line") {
                skipSwiper = 0
            } else if (skipType == "global_map"||skipType == "cn_map") {
                skipType==="global_map"?homeSkipMapType="World":homeSkipMapType="China";
                skipSwiper = 1
            } else if (skipType == "vBar") {
                skipSwiper = 2
            } else if (skipType == "area") {
                skipSwiper = 3
            }
            routerName = "#/analysis/pv"
        } else if (skipPage == "IP") {
            if (skipType == "line") {
                skipSwiper = 0
            } else if (skipType == "global_map"||skipType == "cn_map") {
                skipType==="global_map"?homeSkipMapType="World":homeSkipMapType="China";
                skipSwiper = 1
            } else if (skipType == "vBar") {
                skipSwiper = 2
            } else if (skipType == "area") {
                skipSwiper = 3
            }
            routerName = "#/analysis/ip"
        } else if (skipPage == "DATA") {
            if (skipType == "line") {
                skipSwiper = 0
            } else if (skipType == "global_map"||skipType == "cn_map") {
                skipType==="global_map"?homeSkipMapType="World":homeSkipMapType="China";
                skipSwiper = 1
            } else if (skipType == "vBar") {
                skipSwiper = 2
            } else if (skipType == "area") {
                skipSwiper = 3
            }
            routerName = "#/analysis/data"
        } else if (skipPage == "STATUS") {
            if (skipType == "bar1") {
                skipSwiper = 0
            } else if (skipType == "bar2") {
                skipSwiper = 1
            } else if (skipType == "vBar1") {
                skipSwiper = 2
            } else if (skipType == "vBar2") {
                skipSwiper = 3
            }
            routerName = "#/analysis/status"
        } else if (skipPage == "BR") {
            if (skipType == "vBar") {
                skipSwiper = 0
            } else if (skipType == "area") {
                skipSwiper = 1
            }
            routerName = "#/analysis/br"
        } else if (skipPage == "OS") {
        	if (skipType == "vBar") {
                skipSwiper = 0
            } else if (skipType == "area") {
                skipSwiper = 1
            }
            routerName = "#/analysis/os"
        } else if (skipPage == "REQUEST") {
        	if (skipType == "vBar") {
                skipSwiper = 0
            } else if (skipType == "area") {
                skipSwiper = 1
            }
            routerName = "#/analysis/request"
        } else if (skipPage == "REFERRER") {
        	if (skipType == "vBar") {
                skipSwiper = 0
            } else if (skipType == "area") {
                skipSwiper = 1
            }
            routerName = "#/analysis/rf"
        } else if (skipPage == "TP") {
        	if (skipType == "vBar") {
                skipSwiper = 0
            } else if (skipType == "area") {
                skipSwiper = 1
            }
            routerName = "#/analysis/tp"
        } else if (skipPage === "CRAWLER") {
            if (skipType == "fBar") {
                skipSwiper = 0
            } else if (skipType == "ipBar") {
                skipSwiper = 1
            } else if (skipType == "urlBar") {
                skipSwiper = 2
            } else if (skipType == "statusBar") {
                skipSwiper = 3
            }
            routerName = "#/analysis/crawler"
        } else if (skipPage === "INJECTION") {
            if (skipType == "fBar") {
                skipSwiper = 0
            } else if (skipType == "ipBar") {
                skipSwiper = 1
            } else if (skipType == "urlBar") {
                skipSwiper = 2
            } else if (skipType == "statusBar") {
                skipSwiper = 3
            }
            routerName = "#/analysis/sqlinjection"
        } else if (skipPage === "LOOPHOLE") {
            if (skipType == "fBar") {
                skipSwiper = 0
            } else if (skipType == "ipBar") {
                skipSwiper = 1
            } else if (skipType == "urlBar") {
                skipSwiper = 2
            } else if (skipType == "statusBar") {
                skipSwiper = 3
            }
            routerName = "#/analysis/fileinclusion"
        } else if (skipPage === "SCRIPT") {
            if (skipType == "fBar") {
                skipSwiper = 0
            } else if (skipType == "ipBar") {
                skipSwiper = 1
            } else if (skipType == "urlBar") {
                skipSwiper = 2
            } else if (skipType == "statusBar") {
                skipSwiper = 3
            }
            routerName = "#/analysis/xss"
        }
        localStorage.setItem('PROJECTID', projectID);
        $.ajax({
            type: "POST",
            url: "/api/toppage.open?cmd=WEL:UPDATEPROJECTID",
            data: {
                projectID: projectID
            },
            async: true,
            cache: true,
            dataType: "json", //返回json格式
            success: function(data) {
                location.href = routerName
            }
        })
    })

    //注册点击删除事件
    $("body").delegate(".delChartView", "click", function() {
        var that = $(this);
        swal({
                title: home_delete,
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: home_ok,
                cancelButtonText: home_cancel,
                closeOnConfirm: false
            },
            function() {
                var delNum = that.parent().parent().parent().parent().index();
                that.parent().parent().parent().parent().remove();
                storageArr.splice(delNum, 1);
                $.ajax({
                    type: "post",
                    url: "/api/toppage.open",
                    data: {
                        storageArr: storageArr
                    },
                    async: true,
                    cache: true,
                    success: function(data) {
                        swal({
                            title: home_deletesuc,
                            confirmButtonText: home_ok,
                            type: "success",
                        });
                        if (storageArr.length == 0) {
                            $(".chartViewBox").html("<div class='col-lg-6 col-xs-12 col-sm-12' style='padding:15px;'>\
							<div class='chartViewBlock bordered' style='border:2px dashed #c2cddc;padding-bottom: 25px;'>\
								<div class='chartView' style='height:363px;top:0;'>\
									<div class='addChartView'>\
									</div>\
								</div>\
							</div>\
						</div>")
                            $(".chartView:last").click(function() {
                                skipPage = 'PV';
                                skipSwiper = 0;
                                location.href = "#/analysis";
                            })
                        }
                    },
                    error: function() { // 请求失败处理函数
                        swal({
                            title: home_deletefaild,
                            confirmButtonText: home_ok,
                            type: "error",
                        });
                    }
                })
            });
    });

    return {
        render: render
    }
})
