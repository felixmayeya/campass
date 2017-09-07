//cvr Button
var dataTable_1 = false;
function cvrBtn() {
    btnUrl = "/api/conversion.open";
    moreDateMark = 0;
    pageName = "CVR";
    var timeInterval = "";
    if (localStorage.getItem("ANALYSISINTERVAL") != "" && localStorage.getItem("ANALYSISINTERVAL") != null) {
        // if (localStorage.getItem("ANALYSISINTERVAL") == 'year') {
        //     timeInterval = 'YEAR'
        // } else if (localStorage.getItem("ANALYSISINTERVAL") == 'month') {
        //     timeInterval = 'MONTH'
        // } else if (localStorage.getItem("ANALYSISINTERVAL") == 'daily') {
        //     timeInterval = 'DAILY'
        // } else if (localStorage.getItem("ANALYSISINTERVAL") == 'hour') {
        //     timeInterval = 'HOUR'
        // } else if (localStorage.getItem("ANALYSISINTERVAL") == 'minute') {
        //     timeInterval = 'MINUTE'
        // }
        timeInterval = 'HOUR'
    } else {
        timeInterval = 'HOUR'
    }
    var urlArr = [];
    var cvrBtnName;
    var cvrMapType;
    chartTxt=[Dynamic.analysis_cvr_steps,"URL1","URL2",Dynamic.analysis_cvr];
    var cvrNum = "0";
    //添加到首页开关
    $("#addChart").removeClass();
    $("#addChart").addClass("btn default disabled");

    $(".general").empty();
    //swiper插件配置与初始化
    var paginationArr = Dynamic.analysis_cvr_paginationArr
    if (swiper) {
        swiper.destroy(false)
    }
    swiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-12 col-xs-12" style="text-align:left;border-color:transparent !important;">' + paginationArr[index] + '</li>'
        }
    });
    if (xhr != undefined) {
        xhr.abort();
    }
    $('#selectMapType').selectpicker({
        width: "auto",
        size: 10,
        title: (function(){
          for(var i=0;i<$("#selectMapType option").length;i++){
            if($("#selectMapType option").eq(i).val()==cvrMapType){
              $("#selectMapType option").eq(i).attr("selected","selected")
            }
          }
          cvrMapType=mapType;
          return $("#selectMapType option").eq(i).attr("selected","selected").text();
        })()
    });
    $("#selectMapType").on('change',function(){
      cvrMapType=$("#selectMapType option:selected").val()
    })
    $(".box2").show();
    loadcharts = echarts.init(document.getElementById("loadbox"));
    loadcharts.showLoading({
        text: 'loading',
        color: '#678098',
        textColor: '#678098',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
    });
    xhr = $.ajax({
            type: "get",
            url: "/api/conversion.open?cmd=WEL:GETCVRINFO",
            data: {
                startTime: startTime,
                endTime: endTime,
                project_id: projectID,
                timeZone:timeZone
            },
            async: true,
            success: function(data) {
                cvrMoreData = data;
                loadcharts.hideLoading();
                $(".box2").hide()
                if (data.length > 0&&typeof data!== "string") {
                    cvrUrlData = data;
                    var description = [];
                    var cvrUrl = [];
                    var pcCount = [];
                    for (var i = 0; i < data.length; i++) {
                        cvrUrl.push(data[i].url);
                        description.push(data[i].desc);
                        pcCount.push(data[i].pvCount)
                    }
                    $(".cvrBox_line4").css("display", "block");
                    $(".cvrBox_line3").css("display", "none");
                    $(".cvrBox_line2").css("display", "none");
                    $(".echarts_funnel").css({ "height": "100%" });
                    $(".echarts_more").css({ "height": "0%" });
                    $(".echarts_more").empty();
                    //漏斗图判断与初始化
                    if (document.getElementsByClassName("echarts_funnel")[0]) {
                        var funnelName = [];
                        var cvrCountArr = [];
                        for (var i = 0; i < description.length; i++) {
                            var obj = {};
                            if (pcCount[i - 1] != 0) {
                                obj.value = pcCount[i];
                                var val = toDecimal2(ForDight(((pcCount[i] * 100) / pcCount[i - 1]), 4));
                                obj.name = description[i];
                            } else {
                                var val = obj.value = "∞";
                                obj.name = description[i];
                            }
                            if (i != 0) {
                                cvrCountArr.push(ForDight(((pcCount[i]) / pcCount[i - 1]), 4))
                            }
                            funnelName.push(obj);
                        }
                        /*	var cvrCount_1=cvrCountArr[0];
                        	for(var l=1;l<cvrCountArr.length;l++){
                        		if(cvrCount_1 == 0 || cvrCountArr[l] == 0){
                        			cvrCount_1 = 0;
                        		}else{
                        			cvrCount_1=cvrCountArr[l]*cvrCount_1;
                        		}
                        	}
                        	var cvrNum = toDecimal2(ForDight(cvrCount_1*100,2));
                        	if(cvrNum == false){
                        		cvrNum='0';
                        	}
                        	$(".cvrCount").html(cvrNum+"%");*/
                        //	$(".cvrCount").html(toDecimal2(ForDight((data[0].cvrCount_1*100/data[data.length-1].cvrCount_1),2))+"%");
                        op01Funnel(funnelName);
                    }
                } else {
                    $(".cvrBox_line4").css("display", "none");
                    $(".cvrBox_line3").css("display", "none");
                    $(".cvrBox_line2").css("display", "block");
                }
            },
            error: function() {}
        })
        //设置转化流程
    $("#optionCvr").unbind("click");
    $("#optionCvr").click(function() {
    	if (projectID == 0 && localStorage.getItem("LINK_STATUS") !== "0") {
            swal({
                title: analysis_cvr_text0,
                type: "error",
                confirmButtonText: analysis_ok,
                closeOnConfirm: false
            })
        }else{
            $(".cvrBox_line2").css("display", "none");
            $(".cvrBox_line3").css("display", "block");
        }
    })
        //添加转化流程
    $(".cvrAddBtn").unbind("click");
    $(".cvrAddBtn").on("click", function() {
            if ($(".cvrBox_line3 table tr").length < 14) {
                var listNum = $(".cvrBox_line3 table tr:last-child td:nth-child(1) span").text();
                $(".cvrBox_line3 table tbody").append('<tr>\
            				<td>' + Dynamic.analysis_cvr_steps + '<span>' + (parseInt(listNum) + 1) + '</span></td>\
            				<td><input type="text" name="cvrText1" id="cvrText1" value="" placeholder="' + Dynamic.analysis_cvr_placeholder1 + '"/></td>\
            				<td><input type="url" name="cvrText1" id="cvrText1" value="" placeholder="' + Dynamic.analysis_cvr_placeholder2 + '"/></td>\
            			</tr>')
            }
        })
        //移除转化流程
    $(".cvrRemoveBtn").unbind("click");
    $(".cvrRemoveBtn").on("click", function() {
            if ($(".cvrBox_line3 table tr").length > 3) {
                $(".cvrBox_line3 table tbody tr:last-child").remove()
            }
        })
        //重新编辑转化流程
    $(".cvrBack").unbind("click");
    $(".cvrBack").on("click", function() {
            $(".cvrDataTable tr").not("tr:eq(0)").remove();
            for (var i = 0; i < cvrUrlData.length; i++) {
                $(".cvrDataTable").append('<tr>\
    				<td>' + Dynamic.analysis_cvr_steps + '<span>' + (parseInt(i) + 1) + '</span></td>\
    				<td><input type="text" name="cvrText1" id="cvrText1" value="' + cvrUrlData[i].desc + '" placeholder="' + Dynamic.analysis_cvr_placeholder1 + '"/></td>\
    				<td><input type="url" name="cvrText1" id="cvrText1" value="' + cvrUrlData[i].url + '" placeholder="' + Dynamic.analysis_cvr_placeholder2 + '"/></td>\
    			</tr>')
            }
            $(".cvrBox_line4").css("display", "none");
            $(".cvrBox_line3").css("display", "block");
        })
        //保存转化流程
    $(".cvrSaveBtn").click(function() {
            var description = [];
            var cvrUrl = [];
            for (var i = 0; i < $(".cvrBox_line3 table tr").length - 1; i++) {
                description.push($(".cvrBox_line3 table tr:eq(" + (i + 1) + ") td:nth-child(2) input").val());
                cvrUrl.push($(".cvrBox_line3 table tr:eq(" + (i + 1) + ") td:nth-child(3) input").val());
            }

            function inputCheck() {
                for (var i = 0; i < $(".cvrBox_line3 input").length; i++) {
                    if ($(".cvrBox_line3 input").eq(i).val() == "") {
                        return false;
                    }
                }
            }
            if (inputCheck() != false) {
                if (xhr != undefined) {
                    xhr.abort();
                }
                xhr = $.ajax({
                    type: "get",
                    url: btnUrl + "?cmd=WEL:INSERTCVRINFO",
                    async: true,
                    cache: true,
                    data: {
                        project_id: projectID,
                        desc: description,
                        url: cvrUrl
                    },
                    dataType: "json", //返回json格式
                    success: function(data) {
                        xhr = $.ajax({
                            type: "get",
                            url: "/api/conversion.open?cmd=WEL:GETCVRINFO",
                            data: {
                                startTime: startTime,
                                endTime: endTime,
                                project_id: projectID,
                                timeZone:timeZone
                            },
                            async: true,
                            success: function(data) {
                                cvrMoreData = data;
                                swal({
                                    title: Dynamic.manage_sl_savasuccess,
                                    text: "",
                                    confirmButtonText: Dynamic.upload_ok,
                                    type: "success"
                                });
                                cvrUrlData = data;
                                var description = [];
                                var cvrUrl = [];
                                var pcCount = [];
                                $(".cvrBox_line3").css("display", "none");
                                $(".cvrBox_line4").css("display", "block");
                                for (var i = 0; i < data.length; i++) {
                                    cvrUrl.push(data[i].url);
                                    description.push(data[i].desc);
                                    pcCount.push(data[i].pvCount)
                                }
                                //漏斗图判断与初始化
                                if (document.getElementsByClassName("echarts_funnel")[0]) {
                                    var funnelName = [];
                                    var cvrCountArr = [];
                                    for (var i = 0; i < description.length; i++) {
                                        var obj = {};
                                        if (pcCount[i - 1] != 0) {
                                            obj.value = pcCount[i];
                                            var val = toDecimal2(ForDight(((pcCount[i] * 100) / pcCount[i - 1]), 4));
                                            obj.name = description[i];
                                        } else {
                                            var val = obj.value = "∞";
                                            obj.name = description[i];
                                        }
                                        if (i != 0) {
                                            cvrCountArr.push(ForDight(((pcCount[i]) / pcCount[i - 1]), 4))
                                        }
                                        funnelName.push(obj);
                                    }
                                    /*var cvrCount_1=cvrCountArr[0];
    	    					for(var l=1;l<cvrCountArr.length;l++){
    	    						if(cvrCount_1 == 0 || cvrCountArr[l] == 0){
    	    							cvrCount_1 = 0;
    	    						}else{
    	    							cvrCount_1=cvrCountArr[l]*cvrCount_1;
    	    						}
    	    					}
    	    					var cvrNum = toDecimal2(ForDight(cvrCount_1*100,2));
    							if(cvrNum == false){
    								cvrNum='0';
    							}
    							$(".cvrCount").html(cvrNum+"%");*/
                                    //$(".cvrCount").html(toDecimal2(ForDight(cvrCount_1*100,2))+"%");
                                    op01Funnel(funnelName);
                                }
                            },
                        })
                    },
                    error: function() { // 请求失败处理函数
                    }
                })
            } else {
                swal({
                    title: Dynamic.analysis_cvr_text3,
                    confirmButtonText: Dynamic.upload_ok,
                    type: "error",
                });
            }
        })
        //timeIntervalCheck
    function timeIntervalCheck(cvrBtnName) {
        var urlArr = [];
        if (xhr != undefined) {
            xhr.abort();
        }
                for (var i = 0; i < cvrUrlData.length; i++) {
                    urlArr.push(cvrUrlData[i].url)
                }
                if (cvrBtnName == "cvrTime") {
                    urlCmd = '?cmd=WEL:GETPV'
                } else if (cvrBtnName == "cvrAddres") {
                    urlCmd = '?cmd=WEL:GETGE'
                } else if (cvrBtnName == "cvrBrowser") {
                    urlCmd = '?cmd=WEL:GETBROWSER'
                } else if (cvrBtnName == "cvrOs") {
                    urlCmd = '?cmd=WEL:GETOS'
                }
                if (xhr != undefined) {
                    xhr.abort();
                }
                xhr = $.ajax({
                    type: "get",
                    url: btnUrl + urlCmd + timeInterval,
                    async: true,
                    cache: true,
                    data: {
                        project_id: projectID,
                        urls: urlArr,
                        startTime: startTime,
                        endTime: endTime,
                        country: cvrMapType,
                        timeZone:timeZone
                    },
                    success: function(data) {
                        hideLoading();
                        $(".echarts_funnel").css({ "height": "60%" });
                        $(".echarts_more").css({ "height": "39%" });
                        funnelChart.resize();
                        if (cvrBtnName == "cvrTime") {
                            cvrLine(data);
                        } else if (cvrBtnName == "cvrAddres") {
                            cvrMap(data);
                        } else if (cvrBtnName == "cvrBrowser") {
                            cvrBr(data);
                        } else if (cvrBtnName == "cvrOs") {
                            cvrOs(data);
                        }
                    },
                    error: function() { // 请求失败处理函数
                    }
                })
    }
    //cvrTime click
    $(".cvrTime").click(function() {
            showLoading();
            cvrBtnName = "cvrTime";
            timeIntervalCheck(cvrBtnName);
        })
        //cvrMap click
    $(".cvrAddres").click(function() {
            showLoading();
            cvrBtnName = "cvrAddres";
            timeIntervalCheck(cvrBtnName);
        })
        //cvrBr click
    $(".cvrBrowser").click(function() {
            showLoading();
            cvrBtnName = "cvrBrowser";
            timeIntervalCheck(cvrBtnName);
        })
        //cvrOs click
    $(".cvrOs").click(function() {
        showLoading();
        cvrBtnName = "cvrOs";
        timeIntervalCheck(cvrBtnName);
    })
}
//转化率
function op01Funnel(data) {
    if (toDecimal2(ForDight((data[data.length - 1].value * 100 / data[0].value), 2)) != false) {
        $(".cvrCount").html(toDecimal2(ForDight((data[data.length - 1].value * 100 / data[0].value), 2)) + "%");
    } else {
        $(".cvrCount").html("0%");
    }
    hideLoading();
    var maxValue = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].value > maxValue) {
            maxValue = data[i].value;
        }
    }
    funnelChart = echarts.init(document.getElementsByClassName("echarts_funnel")[0]);
    var option = {
        title: {
            show: false,
            text: Dynamic.analysis_cvr_paginationArr[0],
            subtext: 'areaDemo',
            left: 'center',
            textStyle: {
                color: "#999999"
            }
        },
        color: ['#67809f', '#4b77be', '#4c87b9', '#5e738b', '#5c9bd1'],
        tooltip: {
            trigger: 'item',
            formatter: "{b}<br/>" + Dynamic.analysis_pageViewNum + "：{c}"
        },
        toolbox: {
            show: true,
            right: "10%",
            top: '20%',
            iconStyle: {
                normal: {
                    borderColor: '#999999'
                },
                emphasis: {
                    borderColor: '#999999'
                }
            },
            orient: 'vertical',
            feature: {
                restore: { title: Dynamic.analysis_tools7 },
                saveAsImage: { backgroundColor: 'rgba(0,0,0,0)', title: Dynamic.analysis_tools6 }
            }
        },
        legend: {
            orient: 'vertical',
            left: '10%',
            top: '20%',
            data: data.map(function(item) {
                return item.name;
            }),
            textStyle: {
                color: "#999999"
            }
        },
        series: [{
            name: title,
            type: 'funnel',
            left: '10%',
            top: 60,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: maxValue,
            minSize: '0%',
            maxSize: '60%',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        if (params.dataIndex != 0) {
                            var perc = toDecimal2(ForDight((data[params.dataIndex].value * 100 / data[params.dataIndex - 1].value), 2));
                            var _perc = toDecimal2(ForDight((data[params.dataIndex].value * 100 / data[0].value), 2));
                            if (perc == false) {
                                perc = "0";
                            }
                            if (_perc == false) {
                                _perc = "0";
                            }
                            return params.name + "\n" + Dynamic.analysis_pageViewNum + "：" + params.value + "\n" + Dynamic.analysis_cvr_text1 + "：" +
                                perc + "%\n" + Dynamic.analysis_cvr_text2 + "：" +
                                _perc + "%";
                        } else {
                            return params.name + "\n" + Dynamic.analysis_pageViewNum + "：" + params.value
                        }
                    }
                },
                emphasis: {
                    textStyle: {
                        fontSize: 15
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 30,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#999999',
                    borderWidth: 1
                }
            },
            data: data
        }]
    };
    funnelChart.setOption(option);
    addLoadEvent(funnelChart.resize);
    //根据数据量循环创建tr、td
    if (dataTable_1) {
        dataTable_1.destroy();
    }
    var table = $(".cvrBox_line4 table").eq(0)
    $("tbody tr", table).remove()
    for (var i = 0; i < cvrMoreData.length - 1; i++) {
        var fz = cvrMoreData[i].pvCount;
        var bz;
        if (fz == 0) {
            bz = "∞"
        } else {
            bz = (toDecimal2(ForDight(((cvrMoreData[i + 1].pvCount * 100) / cvrMoreData[i].pvCount), 2)));
        }
        var tr = $("<tr><td>" + (i + 1) + "</td>" +
            "<td style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'>" + cvrMoreData[i].url + "&nbsp;&nbsp;(" + cvrMoreData[i].pvCount + "次)</td>" +
            "<td>" + cvrMoreData[i + 1].url + "&nbsp;&nbsp;(" + cvrMoreData[i + 1].pvCount + "次)</td>" +
            "<td>" + bz + "%</td></tr>");
        $("tbody", table).append(tr);
    }
    dataTable_1 = dataTableInit(table);
}
//cvrTimeCharts
function cvrLine(data, time) {
    lineChart = echarts.init(document.getElementsByClassName("echarts_more")[0]);
    var i = 0;
    var option = {
        color: ['#67809f', '#4b77be', '#4c87b9', '#5e738b', '#5c9bd1'],
        // color:['rgba(135,171,221,0.3)','rgba(239,162,134,0.15)'],
        title: {
            show: false,
            //		    	text: "自定义转化率时间轨迹分析",
            text: Dynamic.analysis_cvr_paginationArr[0],
            subtext: 'areaDemo',
            left: 'center',
            textStyle: {
                color: "#999999"
            }
        },
        legend: {
            left: '13%',
            top: '3%',
            data: function() {
                var dataArr = [];
                for (var i in data) {
                    if (i != "time") {
                        var obj = {};
                        obj.name = i;
                        obj.icon = "roundRect";
                        dataArr.push(obj)
                    }
                }
                return dataArr;
            }()
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#999999'
                }
            },
            formatter: function(params) {
                var str = params[0].name + "<br />" + Dynamic.analysis_ViewNum + "<br />"
                for (i = 0; i < params.length; i++) {
                    str += params[i].seriesName + ":" + params[i].value + "<br />";
                }
                return str
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data["time"].map(function(item) {
                return item;
            }),
            axisLable: {
                formatter: function(value, idx) {
                    var date = new Date(value);
                    return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            solitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: [{
            name: Dynamic.analysis_ViewNum,
            type: 'value',
            scale: { power: 1, precision: 1 },
            axisLabel: {
                formatter: "{value}"
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            }
        }],
        toolbox: {
            show: true,
            right: "10%",
            top: "15px",
            iconStyle: {
                normal: {
                    borderColor: '#999999'
                },
                emphasis: {
                    borderColor: '#999999'
                }
            },
            feature: {
                saveAsImage: { backgroundColor: 'rgba(0,0,0,0)', title: Dynamic.analysis_tools6 },
                myTool1: {
                    show: true,
                    title: Dynamic.analysis_tools8,
                    icon: "image://img/close.png",
                    onclick: function() {
                        $(".echarts_funnel").css({ "height": "100%" });
                        $(".echarts_more").css({ "height": "0%" });
                        funnelChart.resize();
                        $(".echarts_more").empty();
                    }
                }
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
            throttle: 0
        }, ],
        series: function() {
            var serie = [];
            for (var i in data) {
                if (i != "time") {
                    var serieObj = {
                        name: i,
                        type: 'line',
                        areaStyle: { normal: {} },
                        data: data[i].map(function(item) {
                            return item;
                        })
                    }
                    serie.push(serieObj);
                }
            }
            return serie;
        }()
    }
    lineChart.setOption(option)
    addLoadEvent(lineChart.resize);
}
//CVR地图
function cvrMap(data) {
    lineChart = echarts.init(document.getElementsByClassName("echarts_more")[0]);
    var i = 0;
    var urlArr = [];
    for (var i in data) {
        urlArr.push(i);
    }
    var option = {
        title: {
            show: false,
            //		    	text: "自定义转化率地理分析",
            text: Dynamic.analysis_cvr_paginationArr[0],
            subtext: 'areaDemo',
            left: 'center',
            textStyle: {
                color: "#999999"
            }
        },
        color: ['#67809f', '#4b77be', '#4c87b9', '#5e738b', '#5c9bd1'],
        // color:['rgba(135,171,221,0.3)','rgba(239,162,134,0.15)'],
        legend: {
            left: '13%',
            top: '3%',
            data: function() {
                var dataArr = [];
                for (var i in data) {
                    if (i != "time") {
                        var obj = {};
                        obj.name = i;
                        obj.icon = "roundRect";
                        dataArr.push(obj)
                    }
                }
                return dataArr;
            }()
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#999999'
                }
            },
            formatter: function(params) {
                var str = params[0].name + "<br />" + Dynamic.analysis_ViewNum + "<br />"
                for (i = 0; i < params.length; i++) {
                    str += params[i].seriesName + ":" + params[i].value + "<br />";
                }
                return str
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data[urlArr[0]].map(function(item) {
                return item.name
            }),
            axisLable: {
                formatter: function(value, idx) {
                    var date = new Date(value);
                    return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            solitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: [{
            name: Dynamic.analysis_ViewNum,
            type: 'value',
            scale: { power: 1, precision: 1 },
            axisLabel: {
                formatter: "{value}"
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            }
        }],
        toolbox: {
            show: true,
            right: "10%",
            top: "15px",
            iconStyle: {
                normal: {
                    borderColor: '#999999'
                },
                emphasis: {
                    borderColor: '#999999'
                }
            },
            feature: {
                saveAsImage: { backgroundColor: 'rgba(0,0,0,0)', title: Dynamic.analysis_tools6 },
                myTool1: {
                    show: true,
                    title: Dynamic.analysis_tools8,
                    icon: "image://img/close.png",
                    onclick: function() {
                        $(".echarts_funnel").css({ "height": "100%" });
                        $(".echarts_more").css({ "height": "0%" });
                        funnelChart.resize();
                        $(".echarts_more").empty();
                    }
                }
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
            throttle: 0
        }, ],
        series: function() {
            var serie = [];
            for (var i in data) {
                if (i != "time") {
                    var serieObj = {
                        name: i,
                        type: 'line',
                        areaStyle: { normal: {} },
                        data: data[i].map(function(item) {
                            return item["value"];
                        })
                    }
                    serie.push(serieObj);
                }
            }
            return serie;
        }()
    }
    lineChart.setOption(option)
    addLoadEvent(lineChart.resize);
};
//cvrBrowserCharts
function cvrBr(data, time) {
    lineChart = echarts.init(document.getElementsByClassName("echarts_more")[0]);
    var i = 0;
    for (var i in data) {
        for (var j in data[i]) {
            if (data[i][j].browserType == "others") {
                data[i][j].browserType = Dynamic.analysis_br_others;
            }
            if (data[i][j].browserType == '') {
                data[i][j].browserType = Dynamic.analysis_cvr_othersBr;
            }
        }
    }
    var urlArr = [];
    for (var i in data) {
        urlArr.push(i);
    }
    var option = {
        color: ['#67809f', '#4b77be', '#4c87b9', '#5e738b', '#5c9bd1'],
        title: {
            show: false,
            //		    	text: "自定义转化率浏览器分析",
            text: Dynamic.analysis_cvr_paginationArr[0],
            subtext: 'areaDemo',
            left: 'center',
            textStyle: {
                color: "#999999"
            }
        },
        // color:['rgba(135,171,221,0.3)','rgba(239,162,134,0.15)'],
        legend: {
            left: '13%',
            top: '3%',
            data: function() {
                var dataArr = [];
                for (var i in data) {
                    if (i != "time") {
                        var obj = {};
                        obj.name = i;
                        obj.icon = "roundRect";
                        dataArr.push(obj)
                    }
                }
                return dataArr;
            }()
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#999999'
                }
            },
            formatter: function(params) {
                var str = params[0].name + "<br />" + Dynamic.analysis_ViewNum + "<br />"
                for (i = 0; i < params.length; i++) {
                    str += params[i].seriesName + ":" + params[i].value + "<br />";
                }
                return str
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data[urlArr[0]].map(function(item) {
                return item.browserType
            }),
            axisLable: {
                formatter: function(value, idx) {
                    var date = new Date(value);
                    return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            solitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: [{
            name: Dynamic.analysis_ViewNum,
            type: 'value',
            scale: { power: 1, precision: 1 },
            axisLabel: {
                formatter: "{value}"
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            }
        }],
        toolbox: {
            show: true,
            right: "10%",
            top: "15px",
            iconStyle: {
                normal: {
                    borderColor: '#999999'
                },
                emphasis: {
                    borderColor: '#999999'
                }
            },
            feature: {
                saveAsImage: { backgroundColor: 'rgba(0,0,0,0)', title: Dynamic.analysis_tools6 },
                myTool1: {
                    show: true,
                    title: Dynamic.analysis_tools8,
                    icon: "image://img/close.png",
                    onclick: function() {
                        $(".echarts_funnel").css({ "height": "100%" });
                        $(".echarts_more").css({ "height": "0%" });
                        funnelChart.resize();
                        $(".echarts_more").empty();
                    }
                }
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
            throttle: 0
        }, ],
        series: function() {
            var serie = [];
            for (var i in data) {
                if (i != "time") {
                    var serieObj = {
                        name: i,
                        type: 'line',
                        areaStyle: { normal: {} },
                        data: data[i].map(function(item) {
                            return item.browserNum;
                        })
                    }
                    serie.push(serieObj);
                }
            }
            return serie;
        }()
    }
    lineChart.setOption(option)
    addLoadEvent(lineChart.resize);
}
//cvrOSCharts
function cvrOs(data, time) {
    lineChart = echarts.init(document.getElementsByClassName("echarts_more")[0]);
    var i = 0;
    for (var i in data) {
        for (var j in data[i]) {
            if (data[i][j].osType == "others") {
                data[i][j].osType = Dynamic.analysis_br_others;
            }
            if (data[i][j].osType == '') {
                data[i][j].osType = Dynamic.analysis_cvr_othersOs;
            }
        }
    }
    var urlArr = [];
    for (var i in data) {
        urlArr.push(i);
    }
    var option = {
        color: ['#67809f', '#4b77be', '#4c87b9', '#5e738b', '#5c9bd1'],
        title: {
            show: false,
            //		    	text: "自定义转化率操作系统分析",
            text: Dynamic.analysis_cvr_paginationArr[0],
            subtext: 'areaDemo',
            left: 'center',
            textStyle: {
                color: "#999999"
            }
        },
        // color:['rgba(135,171,221,0.3)','rgba(239,162,134,0.15)'],
        legend: {
            left: '13%',
            top: '3%',
            data: function() {
                var dataArr = [];
                for (var i in data) {
                    if (i != "time") {
                        var obj = {};
                        obj.name = i;
                        obj.icon = "roundRect";
                        dataArr.push(obj)
                    }
                }
                return dataArr;
            }()
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#999999'
                }
            },
            formatter: function(params) {
                var str = params[0].name + "<br />" + Dynamic.analysis_ViewNum + "<br />"
                for (i = 0; i < params.length; i++) {
                    str += params[i].seriesName + ":" + params[i].value + "<br />";
                }
                return str
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data[urlArr[0]].map(function(item) {
                return item.osType
            }),
            axisLable: {
                formatter: function(value, idx) {
                    var date = new Date(value);
                    return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            solitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: [{
            name: Dynamic.analysis_ViewNum,
            type: 'value',
            scale: { power: 1, precision: 1 },
            axisLabel: {
                formatter: "{value}"
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            }
        }],
        toolbox: {
            show: true,
            right: "10%",
            top: "15px",
            iconStyle: {
                normal: {
                    borderColor: '#999999'
                },
                emphasis: {
                    borderColor: '#999999'
                }
            },
            feature: {
                saveAsImage: { backgroundColor: 'rgba(0,0,0,0)', title: Dynamic.analysis_tools6 },
                myTool1: {
                    show: true,
                    title: Dynamic.analysis_tools8,
                    icon: "image://img/close.png",
                    onclick: function() {
                        $(".echarts_funnel").css({ "height": "100%" });
                        $(".echarts_more").css({ "height": "0%" });
                        funnelChart.resize();
                        $(".echarts_more").empty();
                    }
                }
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
            throttle: 0
        }, ],
        series: function() {
            var serie = [];
            for (var i in data) {
                if (i != "time") {
                    var serieObj = {
                        name: i,
                        type: 'line',
                        areaStyle: { normal: {} },
                        data: data[i].map(function(item) {
                            return item.osNum;
                        })
                    }
                    serie.push(serieObj);
                }
            }
            return serie;
        }()
    }
    lineChart.setOption(option)
    addLoadEvent(lineChart.resize);
}
