function titleTime(num) {
    //	var timeType=storageArr[num].split("|")[2];

    //	if(timeType=="day"){
    //		time.add("d",-1);
    //	}else if(timeType=="week"){
    //		time.add("d",-7);
    //	}else if(timeType=="oneMonth"){
    //		time.add("m",-1);
    //	}else if(timeType=="threeMonth"){
    //		time.add("m",-3);
    //	}else if(timeType=="sixMonth"){
    //		time.add("m",-6);
    //	}else if(timeType=="year"){
    //		time.add("y",-1);
    //	}else if(timeType=="twoYear"){
    //		time.add("y",-2);
    //	}
    titleProId = storageArr[num].split("|")[2];
    titleProName = projectNameList[num];
    if (localStorage.getItem("ANALYSIS_START_TIME") != "" && localStorage.getItem("ANALYSIS_START_TIME") != null) {
        titleEndTime = moment(localStorage.getItem("ANALYSIS_END_TIME").toString()).format("YYYY-MM-DD HH:mm")
        titleStartTime = moment(localStorage.getItem("ANALYSIS_START_TIME").toString()).format("YYYY-MM-DD HH:mm");
    } else {
        var time = new Date();
        titleEndTime = new Date();
        titleEndTime.add("d", +1);
        titleEndTime.setHours(0, 0, 0, 0);
        time.setHours(0, 0, 0, 0);
        titleEndTime = titleEndTime.Format("yyyy-MM-dd hh:mm")
        titleStartTime = time.Format("yyyy-MM-dd hh:mm");
    }
}
changeLanguage("home");
var home_projectitem = Dynamic.home_projectitem;
function pvChartViewCheck(e, data, num) {
    if (e.indexOf("line") != (-1)) {
        var lineView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title1;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['rgba(90,184,222,0.2)', 'rgba(247,186,148,0.2)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            xAxis: {
                type: 'category',
                data: data.map(function(item) {
                    return item.time;
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
            legend: {
                left: '13%',
                top: '3%',
                data: {
                    name: Dynamic.analysis_ViewNum,
                    icon: 'roundRect'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
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
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'line',
                data: data.map(function(item) {
                    return item.pvNum;
                }),
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: { normal: {} },
                symbolSize: 10,
                showSymbol: false
            }]
        };
        lineView.setOption(option);
        addLoadEvent(lineView.resize);
    }
    if (e.indexOf("map") != (-1)) {
        e.indexOf("global_map") != (-1)?homeMapType="World":homeMapType="China";
        var geoArr = [];
        for (var i = 0; i < data.length; i++) {
            var geoObj = {};
            geoObj.name = data[i].province;
            geoObj.value = data[i].pvNum;
            geoArr.push(geoObj);
        }
        var mapView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title2;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#00628b', '#0089bb', '#32bbdb'],
            visualMap: {
                show: true,
                min: 0,
                max: 2500,
                left: '5%',
                top: 'bottom',
                calculable: true,
                inRange: {
                    color: ['#94bdce', '#00628b']
                },
                textStyle: {
                    color: "#999999"
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesName == Dynamic.analysis_DataNum && data.geographyByteList[params.dataIndex] != undefined) {
                        return params.name + "<br />" + params.seriesName + ":" + data.geographyByteList[params.dataIndex].byteNum + "(" + data.geographyByteList[params.dataIndex].unit + ")";
                    } else {
                        if (isNaN(params.value)) {
                            params.value = 0;
                        }
                        return params.name + "<br />" + params.seriesName + ":" + params.value;
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'map',
                mapType: homeMapType,
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#111',
                        textStyle: '#999999'
                    },
                    emphasis: {
                        areaColor: '#b2e4f6',
                        borderColor: '#999999',
                        borderWidth: 1
                    }
                },
                roam: true,
                data: geoArr
            }]
        };
        option.visualMap.max = (function() {
            var maxNum = 0;
            for (var i = 0; i < geoArr.length; i++) {
                if (maxNum < geoArr[i].value) {
                    maxNum = geoArr[i].value;
                }
            }
            if (maxNum == 0) {
                maxNum = 1000;
            }
            return maxNum;
        })();
        mapView.setOption(option);
        addLoadEvent(mapView.resize);
    };
    if (e.indexOf("vBar") != (-1)) {
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title3;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataUrlNum = 50;
        var urlI = 10;
        var option = {
            color: ['#32bbdb'],
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0].dataIndex].url + "<br />" + Dynamic.analysis_ViewNum + "：" + data[params[0].dataIndex].urlNum
                }
            },
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_ViewNum,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                inverse:true,
                name: Dynamic.analysis_viewRanking,
                data: data.map(function(item) {
                    var formatUrl;
                    if (item.url.length > 30) {
                        formatUrl = item.url.substring(0, 30)
                        return formatUrl
                    } else {
                        return item.url;
                    }
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.urlNum;
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title4;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            dataArr[i].name = data[i].url;
            dataArr[i].value = data[i].urlNum;
        }
        var option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            tooltip: {
                trigger: 'item',
                formatter: "url:{b}</br> " + Dynamic.analysis_ViewNum + ":{c}"
            },
            series: [{
                name: '页面访问量统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    }
                },
                data: dataArr
            }]
        };
        areaView.setOption(option);
        addLoadEvent(areaView.resize);
    }
}

//首页IP图例
function ipChartViewCheck(e, data, num) {
    if (e.indexOf("line") != (-1)) {
        var lineView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title5;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['rgba(90,184,222,0.2)', 'rgba(247,186,148,0.2)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            xAxis: {
                type: 'category',
                data: data.map(function(item) {
                    return item.time;
                }),
                axisLable: {
                    formatter: function(value, idx) {
                        var date = new Date(value);
                        return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    },
                    interval: 0,
                    rotate: 60
                },
                splitArea: {
                    interval: 2
                },
                splitNumber: 1,
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
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: [{
                name: Dynamic.analysis_IpNum,
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
            series: [{
                name: Dynamic.analysis_IpNum,
                type: 'line',
                data: data.map(function(item) {
                    return item["ipNum"];
                }),
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: { normal: {} },
                symbolSize: 10,
                showSymbol: false
            }]
        };
        lineView.setOption(option);
        addLoadEvent(lineView.resize);
    }
    if (e.indexOf("map") != (-1)) {
      e.indexOf("global_map") != (-1)?homeMapType="World":homeMapType="China";
        var geoArr = [];
        for (var i = 0; i < data.length; i++) {
            var geoObj = {};
            geoObj.name = data[i].province;
            geoObj.value = data[i].pvNum;
            geoArr.push(geoObj);
        }
        var mapView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title6;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#0089bb', '#00628b', '#32bbdb'],
            visualMap: {
                show: true,
                min: 0,
                max: 2500,
                left: '5%',
                top: 'bottom',
                calculable: true,
                inRange: {
                    color: ['#cbe7f1', '#0089bb']
                },
                textStyle: {
                    color: "#999999"
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesName == Dynamic.analysis_DataNum && data.geographyByteList[params.dataIndex] != undefined) {
                        return params.name + "<br />" + params.seriesName + ":" + data.geographyByteList[params.dataIndex].byteNum + "(" + data.geographyByteList[params.dataIndex].unit + ")";
                    } else {
                        if (isNaN(params.value)) {
                            params.value = 0;
                        }
                        return params.name + "<br />" + params.seriesName + ":" + params.value;
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_IpNum,
                type: 'map',
                mapType: homeMapType,
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#111',
                        textStyle: '#999999'
                    },
                    emphasis: {
                        areaColor: '#b2e4f6',
                        borderColor: '#999999',
                        borderWidth: 1
                    }
                },
                data: geoArr
            }]
        };
        option.visualMap.max = (function() {
            var maxNum = 0;
            for (var i = 0; i < geoArr.length; i++) {
                if (maxNum < geoArr[i].value) {
                    maxNum = geoArr[i].value;
                }
            }
            if (maxNum == 0) {
                maxNum = 1000;
            }
            return maxNum;
        })();
        mapView.setOption(option);
        addLoadEvent(mapView.resize);
    };
    if (e.indexOf("vBar") != (-1)) {
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title7;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0].dataIndex].ip + "<br />" + Dynamic.analysis_ViewNum + "：" + data[params[0].dataIndex].ipNum
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_ViewNum,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                inverse:true,
                name: Dynamic.analysis_IpRanking,
                data: data.map(function(item) {
                    return item.ip;
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.ipNum;
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title8;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            dataArr[i].name = data[i].ip;
            dataArr[i].value = data[i].ipNum;
        }
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "IP:{b}</br> " + Dynamic.analysis_ViewNum + ":{c}"
            },
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            series: [{
                name: '页面访问量统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    }
                },
                data: dataArr
            }]
        };
        areaView.setOption(option);
        addLoadEvent(areaView.resize);
    };
}

//首页data图例
function dataChartViewCheck(e, data, num) {
    if (e.indexOf("line") != (-1)) {
        var lineView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title9;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['rgba(90,184,222,0.2)', 'rgba(247,186,148,0.2)'],
            xAxis: {
                type: 'category',
                data: data.map(function(item) {
                    return item.time;
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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
                },
                formatter: function(params) {
                    return params[0].name + "<br />" + params[0].seriesName + ":" + data[params[0].dataIndex].byteNum + "(" + data[params[0].dataIndex].unit + ")";
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: [{
                name: Dynamic.analysis_DataTraffic,
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
            series: [{
                name: Dynamic.analysis_DataTraffic,
                type: 'line',
                data: data.map(function(item) {
                    return item["bytes"];
                }),
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: { normal: {} },
                symbolSize: 10,
                showSymbol: false
            }]
        };
        lineView.setOption(option);
        addLoadEvent(lineView.resize);
    };
    if (e.indexOf("map") != (-1)) {
      e.indexOf("global_map") != (-1)?homeMapType="World":homeMapType="China";
        var geoArr = [];
        for (var i = 0; i < data.length; i++) {
            var geoObj = {};
            geoObj.name = data[i].province;
            geoObj.value = data[i].pvNum;
            geoArr.push(geoObj);
        }
        var mapView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title10;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb', '#00628b', '#0089bb'],
            visualMap: {
                show: false,
                min: 0,
                max: 2500,
                left: '5%',
                top: 'bottom',
                calculable: true,
                inRange: {
                    color: ['#d9f3f8', '#32bbdb']
                },
                show: false,
                textStyle: {
                    color: "#999999"
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (data[params.dataIndex] != undefined) {
                        return params.name + "<br />" + params.seriesName + ":" + data[params.dataIndex].byteNum + "(" + data[params.dataIndex].unit + ")";
                    } else {
                        if (isNaN(params.value)) {
                            params.value = 0;
                        }
                        return params.name + "<br />" + params.seriesName + ":" + params.value;
                    }
                }
            },
            visualMap: {
                min: 0,
                max: 200,
                left: '5%',
                top: 'bottom',
                inRange: {
                    color: ['#dcf6ff', '#00a3e0']
                },
                calculable: true,
                textStyle: {
                    color: "#999999"
                }
            },
            series: [{
                name: Dynamic.analysis_DataTraffic,
                type: 'map',
                mapType: homeMapType,
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#111',
                        textStyle: '#999999'
                    },
                    emphasis: {
                        areaColor: '#b2e4f6',
                        borderColor: '#999999',
                        borderWidth: 1
                    }
                },
                data: geoArr
            }]
        };
        option.visualMap.max = (function() {
            var maxNum = 0;
            for (var i = 0; i < geoArr.length; i++) {
                if (maxNum < geoArr[i].value) {
                    maxNum = geoArr[i].value;
                };
            }
            if (maxNum == 0) {
                maxNum = 1000;
            }
            return maxNum;
        })();
        mapView.setOption(option);
        addLoadEvent(mapView.resize);
    };
    if (e.indexOf("vBar") != (-1)) {
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title11;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return data[params.dataIndex].url + "<br />" + Dynamic.analysis_DataTraffic + "：" + data[params.dataIndex].byteNum + "(" + data[params.dataIndex].unit + ")";
                }
            },
            grid: {
                left: '3%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                start: 80,
                end: 100,
                textStyle: {
                    color: "#999999"
                }
            }],
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_DataTraffic,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                inverse:true,
                name: Dynamic.analysis_dataRanking,
                data: data.map(function(item) {
                    var formatUrl;
                    if (item.url.length > 30) {
                        formatUrl = item.url.substring(0, 30)
                        return formatUrl
                    } else {
                        return item.url;
                    }
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_DataTraffic,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.bytes;
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title12;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            dataArr[i].name = data[i].ip;
            dataArr[i].value = data[i].bytes;
        }
        var option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return "IP:" + data[params.dataIndex - 1].ip + "<br />" + Dynamic.analysis_DataTraffic + "：" + data[params.dataIndex - 1].byteNum + "(" + data[params.dataIndex - 1].unit + ")"
                }
            },
            series: [{
                name: '数据传输量统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    }
                },
                data: dataArr
            }]
        };
        areaView.setOption(option);
        addLoadEvent(areaView.resize);
    };
}

//首页status图例
function statusChartViewCheck(e, data, num) {
    if (e.indexOf("bar1") != (-1)) {
        var barView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title13;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '80px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                name: Dynamic.analysis_status,
                data: data.map(function(item) {
                    return item['status'].toString();
                }),
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                name: Dynamic.analysis_Frequency,
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            }, ],
            series: [{
                name: Dynamic.analysis_FrequencyNum,
                type: 'bar',
                barWidth: '60%',
                data: data.map(function(item) {
                    return item['statusNum'];
                }),
            }]
        };
        barView.setOption(option);
        addLoadEvent(barView.resize);
    };
    if (e.indexOf("bar2") != (-1)) {
        var barView2 = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title14;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];
        for (var i in data) {
            dataArr.push(data[i])
        }
        if (dataArr.length == 0) {
            dataArr.push([]);
            dataArr.pvNum = 0;
            dataArr.time = "";
        }
        var option = {
            color: ['#32bbdb'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function(params) {
                    var str = Dynamic.analysis_status + ": " + params[0].seriesName + "<br />" + Dynamic.analysis_ViewNum + ": "
                    for (i = 0; i < params.length; i++) {
                        str += params[i].value + "<br />";
                    }
                    return str
                }
            },
            xAxis: [{
                type: 'category',
                data: dataArr[0].map(function(item) {
                    return item['time'];
                }),
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                name: Dynamic.analysis_Frequency,
                scale: { power: 1, precision: 1 },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            }, ],
            series: [{
                name: '200',
                type: 'line',
                data: dataArr[0].map(function(item) {
                    return item['pvNum'];
                })
            }]
        };
        barView2.setOption(option);
        addLoadEvent(barView2.resize);
    };
    if (e.indexOf("vBar1") != (-1)) {
        var dataArr = [];
        for (var i in data) {
            dataArr.push(data[i])
        }
        if (dataArr.length == 0) {
            dataArr.push([]);
            dataArr.pvNum = 0;
            dataArr.time = "";
        }

        var statusListNum = dataArr.length;
        var vBar1View = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title15;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var str = "";
                    for (i = 0; i < params.length; i++) {
                        str += data[params[i].seriesName][params[i].dataIndex].url + "<br />" + Dynamic.analysis_status + ":" + params[i].seriesName + "<br />" + Dynamic.analysis_ViewNum + ":" + params[i].value + "<br />";
                    }
                    return str
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                start: 0,
                end: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                left: '3%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_ViewNum,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                inverse:true,
                name: Dynamic.analysis_status_RankingURL,
                data: dataArr[0].map(function(item) {
                    var formatUrl;
                    if (item.url.length > 30) {
                        formatUrl = item.url.substring(0, 30)
                        return formatUrl
                    } else {
                        return item.url;
                    }
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: "200",
                type: 'bar',
                data: dataArr[0].map(function(item) {
                    return item.statusNum;
                })
            }]
        };
        vBar1View.setOption(option);
        addLoadEvent(vBar1View.resize);
    };
    if (e.indexOf("vBar2") != (-1)) {
        var testNum = 1;
        var dataArr = [];
        for (var i in data) {
            dataArr.push(data[i])
        }
        if (dataArr.length == 0) {
            dataArr.push([]);
            dataArr.pvNum = 0;
            dataArr.time = "";
        }
        var statusListNum = dataArr.length;
        var vBar1View = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title16;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        option = {
            color: ['#32bbdb'],
            grid: {
                left: '3%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                start: 0,
                end: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: {
                type: 'category',
                inverse:true,
                name: Dynamic.analysis_status_RankingIP,
                data: dataArr[0].map(function(item) {
                    return item.ip;
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: "200",
                type: 'bar',
                data: dataArr[0].map(function(item) {
                    return item.statusNum;
                })
            }]
        };
        vBar1View.setOption(option);
        addLoadEvent(vBar1View.resize);
    };
}

//browser首页图例
function brChartViewCheck(e, data, num) {
    if (e.indexOf("vBar") != (-1)) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].browserType == 'others') {
                data[i].browserType = '其他';
            }
        }
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title17;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_ViewNum,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_br,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                    return item.browserType;
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                data: data.map(function(item) {
                    return item['browserNum'];
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    } else if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title19;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            if (data[i].browserType == 'others') {
                dataArr[i].name = '其他';
            } else {
                dataArr[i].name = data[i].browserType;
            }
            dataArr[i].value = data[i].browserNum;
        }
        areaView.setOption(option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            calculable: false,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return Dynamic.analysis_br + ":" + dataArr[params.dataIndex - 1].name + "</br>" + Dynamic.analysis_ViewNum + ":" + dataArr[params.dataIndex - 1].value + "</br>";
                }
            },
            series: [{
                name: '访问流量统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "IP"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: dataArr
            }]
        });
        addLoadEvent(areaView.resize);

    }
}

//os首页图例
function osChartViewCheck(e, data, num) {
    if (e.indexOf("vBar") != (-1)) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].osType == 'others') {
                data[i].osType = '其他';
            }
        }
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title20;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_ViewNum,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_os,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                    return item.osType;
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                data: data.map(function(item) {
                    return item['osNum'];
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title21;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];


        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            if (data[i].osType == 'others') {
                dataArr[i].name = '其他';
            } else {
                dataArr[i].name = data[i].osType;
            }
            dataArr[i].value = data[i].osNum;
        }
        areaView.setOption(option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            calculable: false,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return Dynamic.analysis_os + ":" + dataArr[params.dataIndex - 1].name + "</br>" + Dynamic.analysis_ViewNum + ":" + dataArr[params.dataIndex - 1].value + "</br>";
                }
            },
            series: [{
                name: '请求类型统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "IP"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: dataArr
            }]
        });
        addLoadEvent(areaView.resize);

    };
}

//request首页图例
function requestChartViewCheck(e, data, num) {
    if (e.indexOf("vBar") != (-1)) {
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title22;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_RequsetFrequency,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_Requesttype2,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                    return item.requestType;
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                data: data.map(function(item) {
                    return item['requestNum'];
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title23;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            dataArr[i].name = data[i].requestType;
            dataArr[i].value = data[i].requestNum;
        }
        areaView.setOption(option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            calculable: false,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return Dynamic.analysis_Requesttype2 + ":" + dataArr[params.dataIndex - 1].name + "</br>" + Dynamic.analysis_ViewNum + ":" + dataArr[params.dataIndex - 1].value + "</br>";
                }
            },
            series: [{
                name: '请求数量统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "IP"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: dataArr
            }]
        });
        addLoadEvent(areaView.resize);

    };
}

//tp首页图例
function tpChartViewCheck(e, data, num) {
    var data = data[0].timeSlot;
    if (e.indexOf("vBar") != (-1)) {
        var rfAllUrl = data.length;
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title24;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0].dataIndex].url + "<br />" + Dynamic.analysis_Timeonpath + "：" + data[params[0].dataIndex].stayTimeType
                }
            },
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_Timeonpath,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            yAxis: {
                type: 'category',
                inverse:true,
                name: Dynamic.analysis_TimeonpathRank,
                data: data.map(function(item) {
                    var formatUrl;
                    if (item.url.length > 30) {
                        formatUrl = item.url.substring(0, 30)
                        return formatUrl
                    } else {
                        return item.url;
                    }
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                barMinHeight: 10,
                data: data.map(function(item) {
                    return item['stayTimeType'];
                })
            }]
        };
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title25;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
            //	var data=data[0].timeSlot
        var dataArr = [];
        var allNum = 0;
        for (var i = 0; i < data.length; i++) {
            dataArr.push({});
            dataArr[i].name = data[i].url;
            dataArr[i].value = data[i].stayTimeType;
            allNum += data[i].stayTimeType;
        }
        areaView.setOption(option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            calculable: false,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return "URL:" + dataArr[params.dataIndex - 1].name + "</br>" + Dynamic.analysis_Timeonpath + ":" + dataArr[params.dataIndex - 1].value + "</br>占比:" + ((ForDight(dataArr[params.dataIndex - 1].value * 100 / allNum, 2))) + "%";
                }
            },
            series: [{
                name: '访问来源统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "IP"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: dataArr
            }]
        });
        addLoadEvent(areaView.resize);
    }
}

//rf首页图例
function rfChartViewCheck(e, data, num) {
    if (e.indexOf("vBar") != (-1)) {
        var data2 = data[0];
        var data = [];
        for (var i = 0; i < data2.length; i++) {
            data.push({});
            data[i].url = data2[i].url;
            data[i].urlNum = data2[i].urlNum;
        }
        var vBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title26;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0].dataIndex].url + "<br />" + Dynamic.analysis_ViewNum + "：" + data[params[0].dataIndex].urlNum
                }
            },
            color: ['#32bbdb'],
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_ViewNum,
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '71px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            yAxis: {
                type: 'category',
                inverse: true,
                name: Dynamic.analysis_TrafficS,
                nameLocation: 'start',
                data: data.map(function(item) {
                    var formatUrl;
                    if (item.url.length > 30) {
                        formatUrl = item.url.substring(0, 30)
                        return formatUrl
                    } else {
                        return item.url;
                    }
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_ViewNum,
                type: 'bar',
                barMinHeight: 10,
                data: data.map(function(item) {
                    return item['urlNum'];
                })
            }]
        }
        vBarView.setOption(option);
        addLoadEvent(vBarView.resize);
    };
    if (e.indexOf("area") != (-1)) {
        var areaView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title27;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
        var data2 = data[0];
        var dataArr = [];
        for (var i = 0; i < data2.length; i++) {
            dataArr.push({});
            dataArr[i].name = data2[i].url;
            dataArr[i].value = data2[i].urlNum;
        }
        areaView.setOption(option = {
            color: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
            calculable: false,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return "URL:" + dataArr[params.dataIndex - 1].name + "</br>" + Dynamic.analysis_ViewNum + ":" + dataArr[params.dataIndex - 1].value;
                }
            },
            series: [{
                name: '访问来源统计',
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "IP"
                        },
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: dataArr
            }]
        })
        addLoadEvent(areaView.resize);
    }
};
//首页crawler图例
function crawlerChartViewCheck(e, data, num) {
    if (e.indexOf("fBar") != (-1)) {
    	 var fBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
         var title = Dynamic.homeCharts_title28;
         titleTime(num);
         $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

         option = {
             color: ['rgba(90,184,222,1)','rgba(247,186,148,1)'],
             legend: {
                 left: '13%',
                 top: '3%',
                 data: [{
                     name: Dynamic.analysis_crawler_notCrawler,
                     icon: 'roundRect'
                 },{
                     name: Dynamic.analysis_crawler_crawlerNum,
                     icon: 'roundRect'
                 }],
                 textStyle: {
                     color: '#999999'
                 }
             },
             tooltip: {
                 trigger: 'axis',
                 formatter: function(params) {
                	var str,formatCount,val1,val2;
                	val1=params[0].value;
                	val2=params[1].value;
                	formatCount=val1+val2;
                 	str=params[0]["name"]+"<br />"+
		                 	params[1]["seriesName"]+":"+val2+"("+ForDight(val2/formatCount*100,2)+"%)<br />"+
                 			params[0]["seriesName"]+":"+val1+"("+ForDight(val1/formatCount*100,2)+"%)<br />"+
                 			Dynamic.analysis_crawler_PvNum+":"+formatCount;
                 	return str
                 },
                 axisPointer: {
                     type: 'line',
                     lineStyle: {
                         color: '#999999'
                     }
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
                 data: data.map(function(item) {
                     return item.time;
                 }),
                 axisLable: {
                     formatter: function(value, idx) {
                         var date = new Date(value);
                         return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                     }
                 },
                 boundaryGap: ['20%', '20%'],
                 axisTick: {
                     alignWithLabel: true
                 },
                 axisLine: {
                     lineStyle: {
                         color: '#999999'
                     }
                 },
                 solitLine: {
                     show: false
                 }
             },
             yAxis: [{
                 name: Dynamic.analysis_ViewNum,
                 type: 'value',
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
             series: [{
                 name: Dynamic.analysis_crawler_notCrawler,
                 type: 'bar',
                 data: data.map(function(item) {
                     return item["noCrawlerNum"];
                 }),
                 stack:Dynamic.analysis_pageViewNum,
                 lineStyle: {
                     normal: {
                         color: 'rgba(247,186,148,1)'
                     }
                 },
                 areaStyle: {
                     normal: {
                         color: 'rgba(247,186,148,0.2)'
                     }
                 },
                 symbolSize: 10,
                 showSymbol: false
             },{
                 name: Dynamic.analysis_crawler_crawlerNum,
                 type: 'bar',
                 data: data.map(function(item) {
                     return item["crawlerNum"];
                 }),
                 stack:Dynamic.analysis_pageViewNum,
                 lineStyle: {
                     normal: {
                         color: 'rgba(90,184,222,1)'
                     }
                 },
                 areaStyle: {
                     normal: {
                         color: 'rgba(90,184,222,0.2)'
                     }
                 },
                 symbolSize: 10,
                 showSymbol: false
             }]
         }
         fBarView.setOption(option)
         addLoadEvent(fBarView.resize);
    }
    if (e.indexOf("ipBar") != (-1)) {
    	var ipBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
	    var title = Dynamic.homeCharts_title29;
	    titleTime(num);
	    $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
	    var option = {
	        title: {
	            text: Dynamic.analysis_sql_paginationArr[1],
	            show: false,
	            subtext: 'BAR DEMO',
	            left: 'center',
	            textStyle: {
	                color: "#999999"
	            }
	        },
	        color: ['#32bbdb'],
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'shadow'
	            },
	            formatter: function(params) {
	                return data[params[0]["dataIndex"]]["ip"] + "<br />"+Dynamic.analysis_sql_attackNum+"：" + params[0].value
	            }
	        },
	        legend: {
	            data: [{
	                name: Dynamic.analysis_sql_attackNum,
	                icon: 'roundRect'
	            }],
	            left: 'center',
	            top: '0',
	            textStyle: {
	                color: '#999999'
	            }
	        },
	        dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
	        grid: {
	            left: '2%',
	            right: '100px',
	            bottom: '3%',
	            containLabel: true
	        },
	        xAxis: {
	            type: 'value',
	            name: Dynamic.analysis_sql_attackNum,
	            nameLocation: 'end',
	            boundaryGap: [0, 0.01],
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        yAxis: {
	            type: 'category',
	            name: Dynamic.analysis_sql_attackRanking,
	            nameLocation: 'start',
	            inverse: true,
	            data: data.map(function(item) {
	            		return item.ip;
	            }),
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        series: [{
	            name: Dynamic.analysis_sql_attackNum,
	            type: 'bar',
	            barMinHeight: 20,
	            data: data.map(function(item) {
	                return item['ipNum'];
	            })
	        }]
	    }
	    ipBarView.setOption(option)
	    addLoadEvent(ipBarView.resize);
    };
    if (e.indexOf("urlBar") != (-1)) {
    	var urlBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title30;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0]["dataIndex"]]["url"] + "<br />"+Dynamic.analysis_ViewNum+"：" + params[0].value;
                }
            },
            legend: {
                data: [{
                    name: Dynamic.analysis_ViewNum,
                    icon: 'roundRect'
                }],
                left: 'center',
                top: '0',
                textStyle: {
                    color: '#999999'
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_pageViewNum,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_viewRanking,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                	var formatUrl;
    	        	if(item.url.length>50){
    	        		formatUrl=item.url.substring(0,50)
    	        		return formatUrl
    	        	}else{
    	        		return item.url;
    	        	}
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.urlNum;
                })
            }]
        }
        urlBarView.setOption(option)
        addLoadEvent(urlBarView.resize);
    };
    if (e.indexOf("statusBar") != (-1)) {
    	var statusBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title31;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            title: {
                text: Dynamic.analysis_crawler_paginationArr[3],
                show: false,
                left: 'center',
                textStyle: {
                    color: '#999999'
                }
            },
            color: ['rgba(247,186,148,1)', 'rgba(90,184,222,1)', 'rgba(92,155,209,1)'],
            legend: {
            	left: '20%',
                top: '0',
                data: [{
                    name: Dynamic.analysis_crawler_status1,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status2,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status3,
                    icon: 'roundRect'
                }],
                textStyle: {
                    color: '#999999'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                	var str,formatCount,val1,val2,val3;
                	val1=params[0].value;
                	val2=params[1].value;
                	val3=params[2].value;
                	if(val1==undefined){
                		val1=0;
                	}
                	if(val2==undefined){
                		val2=0;
                	}
                	if(val3==undefined){
                		val3=0;
                	}
                	formatCount=val1+val2+val3;
                	str=params[0]["name"]+"<br />"+
	                	Dynamic.analysis_sql_attackStatus1+":"+val1+"("+ForDight(val1/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus2+":"+val2+"("+ForDight(val2/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus3+":"+val3+"("+ForDight(val3/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatusNum+":"+formatCount;
                	return str
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
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
                data: data.map(function(item) {
                    return item.time;
                }),
                axisLable: {
                    formatter: function(value, idx) {
                        var date = new Date(value);
                        return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    }
                },
                boundaryGap: ['20%', '20%'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                },
                solitLine: {
                    show: false
                }
            },
            yAxis: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'value',
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
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                throttle: 0
            }, ],
            series: [{
                name: Dynamic.analysis_crawler_status1,
                type: 'bar',
                data: data.map(function(item) {
                    return item["2XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(247,186,148,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(247,186,148,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status2,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["3XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(90,184,222,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status3,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["45X"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(92,155,209,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(92,155,209,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }]
        }
        statusBarView.setOption(option)
        addLoadEvent(statusBarView.resize);
    };
}
//首页sql图例
function sqlChartViewCheck(e, data, num) {

	if (e.indexOf("fBar") != (-1)) {
   	 var fBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
     var title = Dynamic.homeCharts_title32;
     titleTime(num);
     $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

     option = {
         color: ['rgba(90,184,222,1)'],
         legend: {
             left: '13%',
             top: '3%',
             data: [{
                 name: Dynamic.analysis_sql_attackNum,
                 icon: 'roundRect'
             }],
             textStyle: {
                 color: '#999999'
             }
         },
         tooltip: {
             trigger: 'axis',
             formatter: function(params) {
            	var str,val1;
            	val1=params[0].value;
             	str=params[0]["name"]+"<br />"+
             			params[0]["seriesName"]+":"+val1;
             	return str
             },
             axisPointer: {
                 type: 'line',
                 lineStyle: {
                     color: '#999999'
                 }
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
             data: data.map(function(item) {
                 return item.time;
             }),
             axisLable: {
                 formatter: function(value, idx) {
                     var date = new Date(value);
                     return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                 }
             },
             boundaryGap: ['20%', '20%'],
             axisTick: {
                 alignWithLabel: true
             },
             axisLine: {
                 lineStyle: {
                     color: '#999999'
                 }
             },
             solitLine: {
                 show: false
             }
         },
         yAxis: [{
             name: Dynamic.analysis_sql_attackNum,
             type: 'value',
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
         series: [{
             name: Dynamic.analysis_sql_attackNum,
             type: 'bar',
             data: data.map(function(item) {
                 return item["pvNum"];
             }),
             stack:Dynamic.analysis_pageViewNum,
             lineStyle: {
                 normal: {
                     color: 'rgba(90,184,222,1)'
                 }
             },
             areaStyle: {
                 normal: {
                     color: 'rgba(90,184,222,0.2)'
                 }
             },
             symbolSize: 10,
             showSymbol: false
         }]
     }
     fBarView.setOption(option)
     addLoadEvent(fBarView.resize);
	}
    if (e.indexOf("ipBar") != (-1)) {
    	var ipBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
	    var title = Dynamic.homeCharts_title33;
	    titleTime(num);
	    $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
	    var option = {
	        title: {
	            text: Dynamic.analysis_sql_paginationArr[1],
	            show: false,
	            subtext: 'BAR DEMO',
	            left: 'center',
	            textStyle: {
	                color: "#999999"
	            }
	        },
	        color: ['#32bbdb'],
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'shadow'
	            },
	            formatter: function(params) {
	                return data[params[0]["dataIndex"]]["ip"] + "<br />"+Dynamic.analysis_sql_attackNum+"：" + params[0].value
	            }
	        },
	        legend: {
	            data: [{
	                name: Dynamic.analysis_sql_attackNum,
	                icon: 'roundRect'
	            }],
	            left: 'center',
	            top: '0',
	            textStyle: {
	                color: '#999999'
	            }
	        },
	        dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '90px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
	        grid: {
	            left: '2%',
	            right: '120px',
	            bottom: '3%',
	            containLabel: true
	        },
	        xAxis: {
	            type: 'value',
	            name: Dynamic.analysis_sql_attackNum,
	            nameLocation: 'end',
	            boundaryGap: [0, 0.01],
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        yAxis: {
	            type: 'category',
	            name: Dynamic.analysis_sql_attackRanking,
	            nameLocation: 'start',
	            inverse: true,
	            data: data.map(function(item) {
	            		return item.ip;
	            }),
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        series: [{
	            name: Dynamic.analysis_sql_attackNum,
	            type: 'bar',
	            barMinHeight: 20,
	            data: data.map(function(item) {
	                return item['ipNum'];
	            })
	        }]
	    }
	    ipBarView.setOption(option)
	    addLoadEvent(ipBarView.resize);
    };
    if (e.indexOf("urlBar") != (-1)) {
    	var urlBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title34;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0]["dataIndex"]]["url"] + "<br />"+Dynamic.analysis_ViewNum+"：" + params[0].value;
                }
            },
            legend: {
                data: [{
                    name: Dynamic.analysis_ViewNum,
                    icon: 'roundRect'
                }],
                left: 'center',
                top: '0',
                textStyle: {
                    color: '#999999'
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                left: '2%',
                right: '120px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_pageViewNum,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_viewRanking,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                	var formatUrl;
    	        	if(item.url.length>50){
    	        		formatUrl=item.url.substring(0,50)
    	        		return formatUrl
    	        	}else{
    	        		return item.url;
    	        	}
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.urlNum;
                })
            }]
        }
        urlBarView.setOption(option)
        addLoadEvent(urlBarView.resize);
    };
    if (e.indexOf("statusBar") != (-1)) {
    	var statusBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title35;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            title: {
                text: Dynamic.analysis_crawler_paginationArr[3],
                show: false,
                left: 'center',
                textStyle: {
                    color: '#999999'
                }
            },
            color: ['rgba(247,186,148,1)', 'rgba(90,184,222,1)', 'rgba(92,155,209,1)'],
            legend: {
            	left: '20%',
                top: '0',
                data: [{
                    name: Dynamic.analysis_crawler_status1,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status2,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status3,
                    icon: 'roundRect'
                }],
                textStyle: {
                    color: '#999999'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                	var str,formatCount,val1,val2,val3;
                	val1=params[0].value;
                	val2=params[1].value;
                	val3=params[2].value;
                	if(val1==undefined){
                		val1=0;
                	}
                	if(val2==undefined){
                		val2=0;
                	}
                	if(val3==undefined){
                		val3=0;
                	}
                	formatCount=val1+val2+val3;
                	str=params[0]["name"]+"<br />"+
	                	Dynamic.analysis_sql_attackStatus1+":"+val1+"("+ForDight(val1/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus2+":"+val2+"("+ForDight(val2/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus3+":"+val3+"("+ForDight(val3/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatusNum+":"+formatCount;
                	return str
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
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
                data: data.map(function(item) {
                    return item.time;
                }),
                axisLable: {
                    formatter: function(value, idx) {
                        var date = new Date(value);
                        return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    }
                },
                boundaryGap: ['20%', '20%'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                },
                solitLine: {
                    show: false
                }
            },
            yAxis: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'value',
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
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                throttle: 0
            }, ],
            series: [{
                name: Dynamic.analysis_crawler_status1,
                type: 'bar',
                data: data.map(function(item) {
                    return item["2XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(247,186,148,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(247,186,148,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status2,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["3XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(90,184,222,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status3,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["45X"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(92,155,209,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(92,155,209,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }]
        }
        statusBarView.setOption(option)
        addLoadEvent(statusBarView.resize);
    };
}
//首页fi图例
function fiChartViewCheck(e, data, num) {


	if (e.indexOf("fBar") != (-1)) {
	   	 var fBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
	     var title = Dynamic.homeCharts_title36;
	     titleTime(num);
	     $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

	     option = {
	         color: ['rgba(90,184,222,1)'],
	         legend: {
	             left: '13%',
	             top: '3%',
	             data: [{
	                 name: Dynamic.analysis_fi_attackNum,
	                 icon: 'roundRect'
	             }],
	             textStyle: {
	                 color: '#999999'
	             }
	         },
	         tooltip: {
	             trigger: 'axis',
	             formatter: function(params) {
	            	var str,val1;
	            	val1=params[0].value;
	             	str=params[0]["name"]+"<br />"+
	             			params[0]["seriesName"]+":"+val1;
	             	return str
	             },
	             axisPointer: {
	                 type: 'line',
	                 lineStyle: {
	                     color: '#999999'
	                 }
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
	             data: data.map(function(item) {
	                 return item.time;
	             }),
	             axisLable: {
	                 formatter: function(value, idx) {
	                     var date = new Date(value);
	                     return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
	                 }
	             },
	             boundaryGap: ['20%', '20%'],
	             axisTick: {
	                 alignWithLabel: true
	             },
	             axisLine: {
	                 lineStyle: {
	                     color: '#999999'
	                 }
	             },
	             solitLine: {
	                 show: false
	             }
	         },
	         yAxis: [{
	             name: Dynamic.analysis_fi_attackNum,
	             type: 'value',
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
	         series: [{
	             name: Dynamic.analysis_fi_attackNum,
	             type: 'bar',
	             data: data.map(function(item) {
	                 return item["pvNum"];
	             }),
	             stack:Dynamic.analysis_pageViewNum,
	             lineStyle: {
	                 normal: {
	                     color: 'rgba(90,184,222,1)'
	                 }
	             },
	             areaStyle: {
	                 normal: {
	                     color: 'rgba(90,184,222,0.2)'
	                 }
	             },
	             symbolSize: 10,
	             showSymbol: false
	         }]
	     }
	     fBarView.setOption(option)
	     addLoadEvent(fBarView.resize);
		}
    if (e.indexOf("ipBar") != (-1)) {
    	var ipBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
	    var title = Dynamic.homeCharts_title37;
	    titleTime(num);
	    $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
	    var option = {
	        title: {
	            text: Dynamic.analysis_sql_paginationArr[1],
	            show: false,
	            subtext: 'BAR DEMO',
	            left: 'center',
	            textStyle: {
	                color: "#999999"
	            }
	        },
	        color: ['#32bbdb'],
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'shadow'
	            },
	            formatter: function(params) {
	                return data[params[0]["dataIndex"]]["ip"] + "<br />"+Dynamic.analysis_sql_attackNum+"：" + params[0].value
	            }
	        },
	        legend: {
	            data: [{
	                name: Dynamic.analysis_sql_attackNum,
	                icon: 'roundRect'
	            }],
	            left: 'center',
	            top: '0',
	            textStyle: {
	                color: '#999999'
	            }
	        },
	        dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
	        grid: {
	            left: '2%',
	            right: '120px',
	            bottom: '3%',
	            containLabel: true
	        },
	        xAxis: {
	            type: 'value',
	            name: Dynamic.analysis_sql_attackNum,
	            nameLocation: 'end',
	            boundaryGap: [0, 0.01],
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        yAxis: {
	            type: 'category',
	            name: Dynamic.analysis_sql_attackRanking,
	            nameLocation: 'start',
	            inverse: true,
	            data: data.map(function(item) {
	            		return item.ip;
	            }),
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        series: [{
	            name: Dynamic.analysis_sql_attackNum,
	            type: 'bar',
	            barMinHeight: 20,
	            data: data.map(function(item) {
	                return item['ipNum'];
	            })
	        }]
	    }
	    ipBarView.setOption(option)
	    addLoadEvent(ipBarView.resize);
    };
    if (e.indexOf("urlBar") != (-1)) {
    	var urlBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title38;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0]["dataIndex"]]["url"] + "<br />"+Dynamic.analysis_ViewNum+"：" + params[0].value;
                }
            },
            legend: {
                data: [{
                    name: Dynamic.analysis_ViewNum,
                    icon: 'roundRect'
                }],
                left: 'center',
                top: '0',
                textStyle: {
                    color: '#999999'
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                left: '2%',
                right: '120px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_pageViewNum,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_viewRanking,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                	var formatUrl;
    	        	if(item.url.length>50){
    	        		formatUrl=item.url.substring(0,50)
    	        		return formatUrl
    	        	}else{
    	        		return item.url;
    	        	}
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.urlNum;
                })
            }]
        }
        urlBarView.setOption(option)
        addLoadEvent(urlBarView.resize);
    };
    if (e.indexOf("statusBar") != (-1)) {
    	var statusBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title39;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            title: {
                text: Dynamic.analysis_crawler_paginationArr[3],
                show: false,
                left: 'center',
                textStyle: {
                    color: '#999999'
                }
            },
            color: ['rgba(247,186,148,1)', 'rgba(90,184,222,1)', 'rgba(92,155,209,1)'],
            legend: {
            	left: '20%',
                top: '0',
                data: [{
                    name: Dynamic.analysis_crawler_status1,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status2,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status3,
                    icon: 'roundRect'
                }],
                textStyle: {
                    color: '#999999'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                	var str,formatCount,val1,val2,val3;
                	val1=params[0].value;
                	val2=params[1].value;
                	val3=params[2].value;
                	if(val1==undefined){
                		val1=0;
                	}
                	if(val2==undefined){
                		val2=0;
                	}
                	if(val3==undefined){
                		val3=0;
                	}
                	formatCount=val1+val2+val3;
                	str=params[0]["name"]+"<br />"+
	                	Dynamic.analysis_sql_attackStatus1+":"+val1+"("+ForDight(val1/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus2+":"+val2+"("+ForDight(val2/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus3+":"+val3+"("+ForDight(val3/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatusNum+":"+formatCount;
                	return str
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
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
                data: data.map(function(item) {
                    return item.time;
                }),
                axisLable: {
                    formatter: function(value, idx) {
                        var date = new Date(value);
                        return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    }
                },
                boundaryGap: ['20%', '20%'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                },
                solitLine: {
                    show: false
                }
            },
            yAxis: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'value',
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
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                throttle: 0
            }, ],
            series: [{
                name: Dynamic.analysis_crawler_status1,
                type: 'bar',
                data: data.map(function(item) {
                    return item["2XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(247,186,148,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(247,186,148,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status2,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["3XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(90,184,222,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status3,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["45X"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(92,155,209,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(92,155,209,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }]
        }
        statusBarView.setOption(option)
        addLoadEvent(statusBarView.resize);
    };
}
//首页xss图例
function xssChartViewCheck(e, data, num) {

	if (e.indexOf("fBar") != (-1)) {
	   	 var fBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
	     var title = Dynamic.homeCharts_title40;
	     titleTime(num);
	     $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

	     option = {
	         color: ['rgba(90,184,222,1)'],
	         legend: {
	             left: '13%',
	             top: '3%',
	             data: [{
	                 name: Dynamic.analysis_xss_attackNum,
	                 icon: 'roundRect'
	             }],
	             textStyle: {
	                 color: '#999999'
	             }
	         },
	         tooltip: {
	             trigger: 'axis',
	             formatter: function(params) {
	            	var str,val1;
	            	val1=params[0].value;
	             	str=params[0]["name"]+"<br />"+
	             			params[0]["seriesName"]+":"+val1;
	             	return str
	             },
	             axisPointer: {
	                 type: 'line',
	                 lineStyle: {
	                     color: '#999999'
	                 }
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
	             data: data.map(function(item) {
	                 return item.time;
	             }),
	             axisLable: {
	                 formatter: function(value, idx) {
	                     var date = new Date(value);
	                     return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
	                 }
	             },
	             boundaryGap: ['20%', '20%'],
	             axisTick: {
	                 alignWithLabel: true
	             },
	             axisLine: {
	                 lineStyle: {
	                     color: '#999999'
	                 }
	             },
	             solitLine: {
	                 show: false
	             }
	         },
	         yAxis: [{
	             name: Dynamic.analysis_xss_attackNum,
	             type: 'value',
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
	         series: [{
	             name: Dynamic.analysis_xss_attackNum,
	             type: 'bar',
	             data: data.map(function(item) {
	                 return item["pvNum"];
	             }),
	             stack:Dynamic.analysis_pageViewNum,
	             lineStyle: {
	                 normal: {
	                     color: 'rgba(90,184,222,1)'
	                 }
	             },
	             areaStyle: {
	                 normal: {
	                     color: 'rgba(90,184,222,0.2)'
	                 }
	             },
	             symbolSize: 10,
	             showSymbol: false
	         }]
	     }
	     fBarView.setOption(option)
	     addLoadEvent(fBarView.resize);
		}
    if (e.indexOf("ipBar") != (-1)) {
    	var ipBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
	    var title = Dynamic.homeCharts_title41;
	    titleTime(num);
	    $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")
	    var option = {
	        title: {
	            text: Dynamic.analysis_sql_paginationArr[1],
	            show: false,
	            subtext: 'BAR DEMO',
	            left: 'center',
	            textStyle: {
	                color: "#999999"
	            }
	        },
	        color: ['#32bbdb'],
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'shadow'
	            },
	            formatter: function(params) {
	                return data[params[0]["dataIndex"]]["ip"] + "<br />"+Dynamic.analysis_sql_attackNum+"：" + params[0].value
	            }
	        },
	        legend: {
	            data: [{
	                name: Dynamic.analysis_sql_attackNum,
	                icon: 'roundRect'
	            }],
	            left: 'center',
	            top: '0',
	            textStyle: {
	                color: '#999999'
	            }
	        },
	        dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
	        grid: {
	            left: '2%',
	            right: '120px',
	            bottom: '3%',
	            containLabel: true
	        },
	        xAxis: {
	            type: 'value',
	            name: Dynamic.analysis_sql_attackNum,
	            nameLocation: 'end',
	            boundaryGap: [0, 0.01],
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        yAxis: {
	            type: 'category',
	            name: Dynamic.analysis_sql_attackRanking,
	            nameLocation: 'start',
	            inverse: true,
	            data: data.map(function(item) {
	            		return item.ip;
	            }),
	            axisLine: {
	                lineStyle: {
	                    color: '#999999'
	                }
	            }
	        },
	        series: [{
	            name: Dynamic.analysis_sql_attackNum,
	            type: 'bar',
	            barMinHeight: 20,
	            data: data.map(function(item) {
	                return item['ipNum'];
	            })
	        }]
	    }
	    ipBarView.setOption(option)
	    addLoadEvent(ipBarView.resize);
    };
    if (e.indexOf("urlBar") != (-1)) {
    	var urlBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title42;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            color: ['#32bbdb'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return data[params[0]["dataIndex"]]["url"] + "<br />"+Dynamic.analysis_ViewNum+"：" + params[0].value;
                }
            },
            legend: {
                data: [{
                    name: Dynamic.analysis_ViewNum,
                    icon: 'roundRect'
                }],
                left: 'center',
                top: '0',
                textStyle: {
                    color: '#999999'
                }
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                right: '70px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                left: '2%',
                right: '120px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: Dynamic.analysis_pageViewNum,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: Dynamic.analysis_viewRanking,
                nameLocation: 'start',
                inverse: true,
                data: data.map(function(item) {
                	var formatUrl;
    	        	if(item.url.length>50){
    	        		formatUrl=item.url.substring(0,50)
    	        		return formatUrl
    	        	}else{
    	        		return item.url;
    	        	}
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'bar',
                barMinHeight: 20,
                data: data.map(function(item) {
                    return item.urlNum;
                })
            }]
        }
        urlBarView.setOption(option)
        addLoadEvent(urlBarView.resize);
    };
    if (e.indexOf("statusBar") != (-1)) {
    	var statusBarView = echarts.init(document.getElementsByClassName("viewNum" + num)[0]);
        var title = Dynamic.homeCharts_title43;
        titleTime(num);
        $(".viewNum" + num).parent().prev().children(".caption").append("<span class='titleProIdSpan' data-id=" + titleProId + " >" + home_projectitem + "：" + titleProName + "</span><br /><i class='fa fa-bar-chart-o font-blue-sharp'></i><span class='chartViewTitleSpan'>" + title + "</span><br /><i class='fa fa-clock-o font-blue-sharp'></i><span class='chartViewDateSpan'>" + titleStartTime + " -- " + titleEndTime + "</span>")

        var option = {
            title: {
                text: Dynamic.analysis_crawler_paginationArr[3],
                show: false,
                left: 'center',
                textStyle: {
                    color: '#999999'
                }
            },
            color: ['rgba(247,186,148,1)', 'rgba(90,184,222,1)', 'rgba(92,155,209,1)'],
            legend: {
                left: '20%',
                top: '0',
                data: [{
                    name: Dynamic.analysis_crawler_status1,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status2,
                    icon: 'roundRect'
                }, {
                    name: Dynamic.analysis_crawler_status3,
                    icon: 'roundRect'
                }],
                textStyle: {
                    color: '#999999'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                	var str,formatCount,val1,val2,val3;
                	val1=params[0].value;
                	val2=params[1].value;
                	val3=params[2].value;
                	if(val1==undefined){
                		val1=0;
                	}
                	if(val2==undefined){
                		val2=0;
                	}
                	if(val3==undefined){
                		val3=0;
                	}
                	formatCount=val1+val2+val3;
                	str=params[0]["name"]+"<br />"+
	                	Dynamic.analysis_sql_attackStatus1+":"+val1+"("+ForDight(val1/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus2+":"+val2+"("+ForDight(val2/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatus3+":"+val3+"("+ForDight(val3/formatCount*100,2)+"%)<br />"+
	                    Dynamic.analysis_sql_attackStatusNum+":"+formatCount;
                	return str
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999999'
                    }
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
                data: data.map(function(item) {
                    return item.time;
                }),
                axisLable: {
                    formatter: function(value, idx) {
                        var date = new Date(value);
                        return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    }
                },
                boundaryGap: ['20%', '20%'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                },
                solitLine: {
                    show: false
                }
            },
            yAxis: [{
                name: Dynamic.analysis_pageViewNum,
                type: 'value',
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
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                throttle: 0
            }, ],
            series: [{
                name: Dynamic.analysis_crawler_status1,
                type: 'bar',
                data: data.map(function(item) {
                    return item["2XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(247,186,148,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(247,186,148,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status2,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["3XX"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(90,184,222,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(90,184,222,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }, {
                name: Dynamic.analysis_crawler_status3,
                type: 'bar',
                data: data.map(function(item, index) {
                    return item["45X"];
                }),
                stack:Dynamic.analysis_pageViewNum,
                lineStyle: {
                    normal: {
                        color: 'rgba(92,155,209,1)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(92,155,209,0.2)'
                    }
                },
                symbolSize: 10,
                showSymbol: false
            }]
        }
        statusBarView.setOption(option)
        addLoadEvent(statusBarView.resize);
    };
}
