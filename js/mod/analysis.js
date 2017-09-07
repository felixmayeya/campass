//检查图表的时间
//dataTable对象
var dataTableObj = [],
    chartTime = [],
    smChartObj = [],

    //打印chartType
    chartType,
    chartTxt = [];

//dataTables初始化
function dataTableInit(dom) {
    var table = dom.DataTable({
        "autoWidth": false,
        "info": true,
        "ordering": true,
        "searching": true,
        "lengthChange": true,
        "paging": true,
        "scrollY": "360px",
        "scrollX": true,
        "scrollCollapse": false,
        "deferRender": true,
        "language": Lang
    });
    $("input", dom.parents(".txtData")).addClass("form-control input-sm input-small input-inline")
    addLoadEvent(function() {
        $(".urlTd").css("width", (dom.parents(".countent").width()) * 0.65)
    })
    return table;
}

function checkDateType(startTime, endTime, datetype) {
    // var customStartTime = timeZoneChange(startTime+"");
    // var customEndTime = timeZoneChange(endTime+"");
    var customStartTime = startTime;
    var customEndTime = endTime;
    var datetypeUrl = '';
    if (datetype == 'year') {
        customStartTime = Number(customStartTime.substring(0, 4));
        customEndTime = Number(customEndTime.substring(0, 4));
        var num = customEndTime - customStartTime;
        if (num == 1 && customStartTime != customEndTime) {
            customEndTime += 1
        }
        datetypeUrl = "?cmd=WEL:SELECTYEAR";
    } else if (datetype == 'month') {
        customStartTime = Number(customStartTime.substring(0, 6));
        customEndTime = Number(customEndTime.substring(0, 6));
        var num = customEndTime - customStartTime;
        if (num == 1 && customStartTime != customEndTime) {
            customEndTime += 1
        }
        datetypeUrl = "?cmd=WEL:SELECTMONTH";
    } else if (datetype == 'daily') {
        customStartTime = Number(customStartTime.substring(0, 8));
        customEndTime = Number(customEndTime.substring(0, 8));
        var num = customEndTime - customStartTime;
        if (num == 1 && customStartTime != customEndTime) {
            customEndTime += 1
        }
        datetypeUrl = "?cmd=WEL:SELECTDAILY";
    } else if (datetype == 'hour') {
        customStartTime = Number(customStartTime.substring(0, 10));
        customEndTime = Number(customEndTime.substring(0, 10));
        var num = customEndTime - customStartTime;
        if (num == 1 && customStartTime != customEndTime) {
            customEndTime += 1
        }
        datetypeUrl = "?cmd=WEL:SELECTHOUR";
    } else if (datetype == 'minute') {
        customStartTime = Number(customStartTime);
        customEndTime = Number(customEndTime);
        datetypeUrl = "?cmd=WEL:SELECTMINUTE";
    }

    return {
        startTime: customStartTime,
        endTime: customEndTime,
        datetypeUrl: datetypeUrl
    };
}

/*
获取图表数据方法

startTime 起始日期
endTime 结束日期
url 当前图表后端接口
datetype 图表时间段类型（年，月，日，小时）
rpType 图表类型
projectID 項目id
isSmallChartLoad 是否加載小圖（可不传）, 传入字符串为'false', 则不加载小图， 不传或传其他，加载小图
chart 图表对象数组（如果是一组对象，同一数据，一组对象同时都会渲染）
mapType 如果获取地图数据，需要获取地图的国家名称
setLocalStorage 如果多张共用一个数据，true，会把数据存在本地存储
*/

// // tableName=test01-url_ip_test&threshold=10&dimension=url&aggregations=count:count&metric=count&intervals=2017-05-30T00:00:00/2017-06-01T08:00:00" 
// // http://192.168.1.208:3000/api/query/topn
// function getChartDataDruid(obj) {
//     var obj = obj,
//         chartList = obj.chart,
//         rpType = obj.rpType,
//         isSmallChartLoad = true,
//         tempMapType = obj.mapType || mapType,
//         setLS = obj.setLocalStorage || false,
//         smCharts = obj.smCharts;

//     $.ajax({
//         type: "post",
//         url: "/druid/api/query/topn",
//         data: {
//             tableName: 'kaishu_data-url_ip_test',
//             threshold: 10,
//             dimension: 'url',
//             aggregations: 'count:count',
//             metric: 'count',
//             intervals: '2017-05-30T00:00:00/2017-06-01T08:00:00'
//         },
//         async: true,
//         cache: true,
//         dataType: "json", //返回json格式
//         success: function(data){
            
//             var currentIndex = swiper.activeIndex,
//                 currentChart = chartList[0];

//             smChartST[currentIndex] = startTime,
//             smChartET[currentIndex] = endTime;

//             renderChart(data, currentChart, currentIndex);
//         }
//     })
// }


function getChartData(obj) {

    var obj = obj,
        chartList = obj.chart,
        rpType = obj.rpType,
        isSmallChartLoad = true,
        tempMapType = obj.mapType || mapType,
        setLS = obj.setLocalStorage || false,
        smCharts = obj.smCharts;

    if (obj.isSmallChartLoad === 'false') {
        isSmallChartLoad = false;
    }

    //如果是柱状图或者散点图，rpType统一使用areaplot
    if (rpType === 'barplot' || rpType === 'scatterplot') {
        rpType === 'areaplot';
    }

    // var tempObj = checkDateType(obj.startTime, obj.endTime, obj.datetype),
    //     currentStartTime = tempObj.startTime,
    //     currentEndTime = tempObj.endTime,
    //     datetypeUrl = tempObj.datetypeUrl;

    var currentStartTime = obj.startTime,
        currentEndTime = obj.endTime;

    if (xhr != undefined) {
        xhr.abort();
    }
    xhr = $.ajax({
            type: "get",
            url: obj.url + "?cmd=WEL:SELECTHOUR",
            data: {
                date: '',
                startTime: timeZoneChange(currentStartTime),
                endTime: timeZoneChange(currentEndTime),
                rpType: rpType,
                project_id: obj.projectID,
                country: tempMapType === 'World' ? '' : tempMapType,
                timeZone: timeZone
            },
            async: true,
            cache: true,
            dataType: "json", //返回json格式
            success: function(data) {
                // loadData(data);
                var currentIndex = swiper.activeIndex;

                if (location.hash !== "#/analysis/cvr") {
                    if (chartList.length === 1) { //如果渲染一张图表，build小图时进行异步请求
                        var currentChart = chartList[0];

                        
                        if (localStorage.getItem("LINK_STATUS") === "0") {
                            smChartST[currentIndex] = '201604260000',
                                smChartET[currentIndex] = '201604270000';
                        } else {
                            smChartST[currentIndex] = startTime,
                                smChartET[currentIndex] = endTime;
                        }

                        // if (setLS) {
                        //     localStorage.setItem('CHART_DATA', JSON.stringify(data));
                        // }
                        renderChart(data, currentChart, currentIndex);

                        //如果是自定义日期不构造小图
                        if (isSmallChartLoad && !(localStorage.getItem("ANALYSIS_LABLE") === "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") === "Custom Range")) {
                            // smChartsBuild(currentIndex);
                            //buildSmChart()
                            smCharts.build();
                        }
                    }
                    // else if (chartList.length > 1) { //如果渲染多张图表，build小图时进行同步请求
                    //     $.each(chartList, function(index, item) {
                    //         if (localStorage.getItem("LINK_STATUS") === "0") {
                    //             smChartST[currentIndex] = '201604260000',
                    //                 smChartET[currentIndex] = '201604270000';
                    //         } else {
                    //             smChartST[currentIndex] = startTime,
                    //                 smChartET[currentIndex] = endTime;
                    //         }
                    //         item.resize();
                    //         renderChart(data, item, currentIndex);
                    //         //如果是自定义日期不构造小图
                    //         if (!(localStorage.getItem("ANALYSIS_LABLE") === "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") === "Custom Range")) {
                    //             (function(idx) {
                    //                 smChartsBuild(idx);
                    //             })(currentIndex)
                    //         }

                    //         //如果同时渲染多个图表，同时需要渲染datatable时，需要获取datatable对应index
                    //         if (item.opts.type === 'hbarplot') {
                    //             currentIndex++;
                    //         }
                    //         if (item.opts.type === 'treeplot') {
                    //             currentIndex--;
                    //         }
                    //     })
                    // }
                } else {
                    pageNameCheck(data);
                }

                //加载底部4块儿信息
                loadGeneralInfo(data);

                //从首页跳转的重置一下对应全局变量
                if (indexToAnalysis && indexToAnalysis == true) {
                    indexToAnalysis = false;
                    skipSwiper = 0;
                }
                //记录图表选择的时间
                // if (location.hash === "#/analysis/status" || location.hash === "#/analysis/crawler" || location.hash === "#/analysis/sqlinjection" || location.hash === "#/analysis/fileinclusion" || location.hash === "#/analysis/xss") {
                //     chartTime[swiper.activeIndex] = currentStartTime + "|" + currentEndTime;
                // } else {
                //     if (swiper.activeIndex === 3) {
                //         chartTime[swiper.activeIndex - 1] = currentStartTime + "|" + currentEndTime;
                //     } else {
                //         chartTime[swiper.activeIndex] = currentStartTime + "|" + currentEndTime;
                //     }
                // }

                // chartTime[swiper.activeIndex] = currentStartTime + "|" + currentEndTime;

            },
            error: function(xhr, textStatus, error) {
                //如果請求失敗，設置數據為空，并生成空图表
                if (textStatus !== "abort") {
                    console.error("Fail to get Data")
                    console.log(textStatus)
                    console.log(error)
                    console.log(xhr)
                    var data = { dataList: [] }
                    var currentIndex = swiper.activeIndex;
                    $.each(chartList, function(index, item) {
                        if (localStorage.getItem("LINK_STATUS") === "0") {
                            smChartST[currentIndex] = '201604260000',
                                smChartET[currentIndex] = '201604270000';
                        } else {
                            smChartST[currentIndex] = startTime,
                                smChartET[currentIndex] = endTime;
                        }
                        renderChart(data, item, currentIndex);

                        (function(currentIndex) {
                            setTimeout(function() {
                                smCharts.build()
                            }, 50)
                        })(currentIndex)
                        //如果同时渲染多个图表，同时需要渲染datatable时，需要获取datatable对应index
                        if (item.opts.type === 'hbarplot') {
                            currentIndex++;
                        } else {
                            currentIndex--;
                        }
                    })
                }
            }
        })
        // $.when(xhr).then()


}
/*
    data 当前后台返回的数据
    currentChart 当前chart对象
    index 指定生成datatable的index， 如果不指定则为当前tab的index
 */
function renderChart(data, currentChart, index) {
    var data = data,
        currentChart = currentChart,
        formatData = {},
        index = index,
        tpl = '';
    if (index === 0) {
        index = index;
    } else {
        index = index || swiper.activeIndex;
    }

    currentChart.resize();

    //line arealine bar scatter
    if (currentChart.opts.type === 'areaplot' || currentChart.opts.type === 'barplot' || currentChart.opts.type === 'scatterplot') {
        var tempObj = formatLineData(data, currentChart);

        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    } //折线图例切换图
    else if (currentChart.opts.type === 'lineSelection') {
        var tempObj = formatLineSelectData(data, currentChart);
        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    } //地图
    else if (currentChart.opts.type === 'mapplot') {
        var tempObj = formatMapData(data, currentChart);
        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    } //horizontal bar
    else if (currentChart.opts.type === 'hbarplot') {
        var tempObj = formatHBarData(data, currentChart);

        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    } //tree map
    else if (currentChart.opts.type === 'treeplot') {
        var tempObj = formatTreeData(data, currentChart);
        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    } //horizontal bar single
    else if (currentChart.opts.type === 'hbarSelection') {
        var tempObj = formatHBarSelectData(data, currentChart);
        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    } else if (currentChart.opts.type === 'barplotStack') {
        var tempObj = formatBarStackData(data, currentChart);
        formatData = tempObj.formatData;
        tpl = tempObj.tpl;
    }
    currentChart.injectData(formatData);
    currentChart.hideLoading();
    //当图表为临时打开的小图时，不执行datatable渲染
    if (currentChart.opts.toolboxType !== 'close') {
        renderDatatable(tpl, index);
    }
}

function renderDatatable(tpl, index) {
    var index = index;
    if (index === 0) {
        index = index
    } else {
        index = index || swiper.activeIndex;
    }

    if (dataTableObj[index]) {
        dataTableObj[index].destroy();
    }
    $(".table-" + index + " tbody tr").remove()

    $(".table-" + index + " tbody").append(tpl);
    dataTableObj[index] = dataTableInit($(".table-" + index));
}

//根据不同name值获取serie name
function getSerieName(name) {
    // debugger
    var serieName = "";
    if (pageName === "CRAWLER") {
        if (name === "sNum") {
            serieName = Dynamic.analysis_crawler_crawlerNum
        } else if (name === "fNum") {
            serieName = Dynamic.analysis_crawler_notCrawler
        } else if (name === "2XX") {
            serieName = Dynamic.analysis_crawler_status1
        } else if (name === "3XX") {
            serieName = Dynamic.analysis_crawler_status2
        } else if (name === "45X") {
            serieName = Dynamic.analysis_crawler_status3
        } else if (name === "ipList") {
            serieName = Dynamic.analysis_ViewIP
        }
    } else if (pageName === "PV" || pageName === "IP") {
        if (name === "pv" || name === "urlCount") {
            serieName = Dynamic.analysis_ViewNum
        } else if (name === "ip") {
            serieName = Dynamic.analysis_IpNum
        }
    } else if (pageName === "TP") {
        if (name === "staytime") {
            serieName = Dynamic.analysis_Timeonpath
        }
    } else if (pageName === "REFERRER") {
        if (name === "indirectType") {
            serieName = Dynamic.analysis_ViewNum
        }
    } else if (pageName === "OS" || pageName === "BR" || pageName === "REQUEST") {
        if (name === "os" || name === "browser" || name === "requesttype") {
            serieName = Dynamic.analysis_ViewNum
        }
    } else if (pageName === "STATUS") {
        if (name === "status") {
            serieName = Dynamic.analysis_Frequency
        } else if (name === "everyIpStatus" || name === "everyUrlStatus") {
            serieName = Dynamic.analysis_ViewNum
        }
    } else {
        if (name === "fNum" || name === "ipNum" || name === "urlNum") {
            serieName = Dynamic.analysis_sql_attackNum
        } else if (name === "2XX") {
            serieName = Dynamic.analysis_sql_attackStatus1
        } else if (name === "3XX") {
            serieName = Dynamic.analysis_sql_attackStatus2
        } else if (name === "45X") {
            serieName = Dynamic.analysis_sql_attackStatus3
        } else if (name === "ipList") {
            serieName = Dynamic.analysis_ViewIP
        }
    }
    return serieName;
}

function htmlEncode(str) {
    return $('<span/>').text(str).html();
}

function htmlDecode(str) {
    return $('<span/>').html(str).text();
}

/*#############
new data format
#############*/

//构造堆叠bar图数据
function formatBarStackData(data, currentChart) {
    var dataList = data.dataList,
        dataSum = [];

    if (dataList && dataList.length > 0) {
        //图表数据构造
        var formatData = {
            xAxis: {
                "name": "",
                "data": dataList[0].data.map(function(item) {
                    return item.name;
                })
            },
            yAxis: {},
            series: []
        }

        if (currentChart.opts.type === 'barplotStack') {
            formatData.yAxis.name = Dynamic.analysis_pageViewNum
        }

        $.each(dataList, function(idx, list) {
            var serieName = getSerieName(list.name);

            if (list.data.length > 0) {
                formatData.series.push({
                        "name": serieName,
                        "data": list.data.map(function(item) {
                            return item.value;
                        })
                    })
                    //如果返回數據爲空
            } else {
                formatData.xAxis.data = ['0']
                formatData.series.push({
                    "name": serieName,
                    "data": [0]
                })
            }
        })

        //把多组数据合并为一组
        $.each(dataList[0].data, function(index, item) {
                var value = []
                for (var i = 0; i < dataList.length; i++) {
                    value.push(dataList[i].data[index].value)
                }
                dataSum.push({
                    "name": item.name,
                    "value": value
                })
            })
            //构造datatable列
        if (dataSum && dataSum.length > 0 && currentChart.opts.toolboxType !== 'close') {
            var tpl = '';
            $.each(dataSum, function(index, item) {
                var values = item.value;
                sum = _.reduce(values, function(a, b) {
                        return a + b
                    }),
                    percent = _.map(values, function(num) {
                        if (sum === 0) {
                            sum = 1
                        }
                        return Math.round(num / sum * 10000) / 100
                    });
                if (swiper.activeIndex === 3) {
                    tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'>" + item.name + "</td><td nowrap='nowrap'>" + values[0] + "</td><td nowrap='nowrap'>" + percent[0] + "</td><td nowrap='nowrap'>" + values[1] + "</td><td nowrap='nowrap'>" + percent[1] + "</td><td nowrap='nowrap'>" + values[2] + "</td><td nowrap='nowrap'>" + percent[2] + "</td></tr>";
                } else {
                    tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'>" + item.name + "</td><td nowrap='nowrap'>" + sum + "</td><td nowrap='nowrap'>" + values[1] + "</td><td nowrap='nowrap'>" + percent[1] + "</td><td nowrap='nowrap'>" + values[0] + "</td><td nowrap='nowrap'>" + percent[0] + "</td></tr>";
                }
            })
        }

    }



    //构造datatable列
    // if (dataList && dataList.length > 0 && currentChart.opts.toolboxType !== 'close') {
    //     var tpl = '';
    //     $.each(dataList[0].data, function(index, item) {
    //         var val1 = item.value,
    //             val2 = dataList[1].data[index];
    //             sum = val1+val2,
    //             percent1 = val1/sum*100,
    //             percent2 = val2/sum*100;
    //         tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + item.name + "</div></td><td nowrap='nowrap'>" + sum + "</td><td nowrap='nowrap'>" + val1 + "</td><td nowrap='nowrap'>" + percent1 + "</td><td nowrap='nowrap'>" + val2 + "</td><td nowrap='nowrap'>" + percent2 + "</td></tr>";
    //     })
    // }

    return {
        formatData: formatData,
        tpl: tpl
    }

}

function formatHBarData(data, currentChart) {
    var dataList = data.dataList;
    if (!(dataList && dataList.length > 0)) {
        return {
            formatData: {},
            tpl: ''
        }
    }
    var formatData = {
        xAxis: {
            "name": Dynamic.analysis_ViewNum
        },
        yAxis: {
            "name": Dynamic.analysis_viewRanking,
            "data": dataList[0].data.map(function(item) {
                if (item.name && item.name.trim() === "others") {
                    item.name = Dynamic.analysis_br_others;
                }
                return htmlEncode(item.name);
            })
        },
        series: []
    }

    //var serieName = getSerieName(list.name);
    $.each(dataList, function(idx, list) {
        var serieName = getSerieName(list.name);
        if (list.name === "staytime") {
            formatData.xAxis.name = Dynamic.analysis_Timeonpath
        }
        if (pageName === "DATA" && list.name === "urlCount") {
            formatData.xAxis.name = Dynamic.analysis_DataTraffic;
            formatData.yAxis.name = Dynamic.analysis_dataRanking;
            formatData.tooltip = list.data.map(function(item) {
                return item.byteNum + item.unit
            })
        }
        formatData.series.push({
            "name": serieName,
            "data": list.data.map(function(item) {
                return item.value;
            })
        })
    })

    var tpl = '';
    $.each(formatData.series[0].data, function(index, item) {
        tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + formatData.yAxis.data[index] + "</div></td><td nowrap='nowrap'>" + item + "</td></tr>";
    })
    return {
        formatData: formatData,
        tpl: tpl
    }
}

function formatLineData(data, currentChart) {
    var dataList = data.dataList;
    if (!(dataList && dataList.length > 0)) {
        return {
            formatData: {},
            tpl: ''
        }
    }
    //图表数据构造
    var formatData = {
        xAxis: {
            "name": "",
            "data": dataList[0].data.map(function(item) {
                return item.name;
            })
        },
        yAxis: {},
        series: []
    }

    if (pageName === "STATUS") {
        formatData.xAxis.name = Dynamic.analysis_status
    }

    $.each(dataList, function(idx, list) {
        var serieName = getSerieName(list.name);
        if (pageName === "DATA") {
            formatData.tooltip = list.data.map(function(item) {
                return item.byteNum + item.unit;
            });
        }
        formatData.series.push({
            "name": serieName,
            "data": list.data.map(function(item) {
                return item.value;
            })
        })
    })

    var tpl = '';
    if (pageName === "IP" && swiper.activeIndex === 1) {
        $.each(formatData.series[1].data, function(index, item) {
            tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + formatData.xAxis.data[index] + "</div></td><td nowrap='nowrap'>" + item + "</td></tr>";
        })
    } else {
        $.each(formatData.series[0].data, function(index, item) {
            tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + formatData.xAxis.data[index] + "</div></td><td nowrap='nowrap'>" + item + "</td></tr>";
        })
    }

    return {
        formatData: formatData,
        tpl: tpl
    }
}

function formatLineSelectData(data, currentChart) {
    var dataList = data.dataList;
    //图表数据构造
    var formatData = {
        xAxis: {
            "name": "",
            "data": []
        },
        yAxis: {
            "name": Dynamic.analysis_Frequency
        },
        series: []
    }

    var dataArr = [];
    var statusArr = [];
    $.each(dataList, function(index, list) {
            dataArr.push(list.data);
            statusArr.push(list.name);
        })
        // for (var index in data) {
        //     dataArr.push(data[index]);
        //     statusArr.push(index);
        // }

    formatData.xAxis.data = dataArr[0].map(function(item) {
        return item.name;
    })
    formatData.legend = statusArr;
    $.each(dataArr, function(index, status) {
        formatData.series.push({
            "name": statusArr[index],
            "data": status.map(function(item) {
                return item.value;
            })
        })
    })

    //构造datatable列
    if (dataArr && dataArr.length > 0) {
        var tpl = '';
        $.each(formatData.series[0].data, function(index, item) {
            tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + formatData.xAxis.data[index] + "</div></td><td nowrap='nowrap'>" + item + "</td></tr>";
        })
    }

    return {
        formatData: formatData,
        tpl: tpl
    }
}

function formatMapData(data, currentChart) {
    var data = data.dataList,
        hash = location.hash,
        formatData = {};
    if (hash == "#/analysis/pv") {
        formatData = {
            legend: [Dynamic.analysis_ViewNum, Dynamic.analysis_UniqueIP, Dynamic.analysis_DataNum],
            series: [{
                "name": Dynamic.analysis_ViewNum,
                "data": []
            }, {
                "name": Dynamic.analysis_UniqueIP,
                "data": []
            }, {
                "name": Dynamic.analysis_DataNum,
                "data": []
            }],
            tooltip: []
        };
        if (data && data[0] && data[0].data) {
            formatData.series[0].data = data[0].data
        }
        if (data && data[1] && data[1].data) {
            formatData.series[1].data = data[1].data
        }
        if (data && data[2] && data[2].data) {
            $.each(data[2].data, function(index, item) {
                formatData.series[2].data.push({ "name": item.name, "value": item.value })
                formatData.tooltip.push(item.byteNum + "(" + item.unit + ")");
            })
        }
    } else if (hash == "#/analysis/ip") {
        formatData = {
            legend: [Dynamic.analysis_UniqueIP, Dynamic.analysis_ViewNum, Dynamic.analysis_DataNum],
            series: [{
                "name": Dynamic.analysis_UniqueIP,
                "data": []
            }, {
                "name": Dynamic.analysis_ViewNum,
                "data": []
            }, {
                "name": Dynamic.analysis_DataNum,
                "data": []
            }],
            tooltip: []
        };
        if (data && data[0] && data[0].data) {
            formatData.series[1].data = data[0].data
        }
        if (data && data[1] && data[1].data) {
            formatData.series[0].data = data[1].data
        }
        if (data && data[2] && data[2].data) {
            $.each(data[2].data, function(index, item) {
                formatData.series[2].data.push({ "name": item.name, "value": item.value })
                formatData.tooltip.push(item.byteNum + "(" + item.unit + ")");
            })
        }
    } else if (hash == "#/analysis/data") {
        formatData = {
            legend: [Dynamic.analysis_DataNum, Dynamic.analysis_ViewNum, Dynamic.analysis_UniqueIP],
            series: [{
                "name": Dynamic.analysis_DataNum,
                "data": []
            }, {
                "name": Dynamic.analysis_ViewNum,
                "data": []
            }, {
                "name": Dynamic.analysis_UniqueIP,
                "data": []
            }],
            tooltip: []
        };
        if (data && data[0] && data[0].data) {
            formatData.series[1].data = data[0].data
        }
        if (data && data[1] && data[1].data) {
            formatData.series[2].data = data[1].data
        }
        if (data && data[2] && data[2].data) {
            $.each(data[2].data, function(index, item) {
                formatData.series[0].data.push({ "name": item.name, "value": item.value })
                formatData.tooltip.push(item.byteNum + "(" + item.unit + ")");
            })
        }
    }

    //构造datatable列
    var tpl = '';
    $.each(formatData.series[0].data, function(index, item) {
        tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + item.name + "</div></td><td nowrap='nowrap'>" + item.value + "</td></tr>";
    })
    return {
        formatData: formatData,
        tpl: tpl
    }
}

function formatTreeData(data, currentChart) {
    var data = data.dataList;
    if (!(data && data.length > 0)) {
        return {
            formatData: {},
            tpl: ''
        }
    }
    var serieName = getSerieName(data[0].name);

    var formatData = {
        tooltip: serieName,
        series: [{
            "data": []
        }]
    }

    if (pageName === "DATA" && data[0].name === "ipCount") {
        formatData.tooltip = data[0].data.map(function(item) {
            return item.byteNum + item.unit;
        });
    }

    $.each(data[0].data, function(index, item) {
        if (item.name && item.name.trim() === 'others') {
            item.name = Dynamic.analysis_br_others;
        }

        formatData.series[0].data.push({
            name: htmlEncode(item.name),
            value: item.value
        })
    })

    //构造datatable列
    if (data && data.length > 0) {
        //构造datatable列
        var tpl = '';
        $.each(formatData.series[0].data, function(index, item) {
            tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + item.name + "</div></td><td nowrap='nowrap'>" + item.value + "</td></tr>";
        })
    }

    return {
        formatData: formatData,
        tpl: tpl
    }
}

function formatHBarSelectData(data, currentChart) {
    var dataList = data.dataList;
    var dataArr = [];
    var statusArr = [];
    $.each(dataList, function(index, list) {
        dataArr.push(list.data);
        statusArr.push(list.name);
    })

    var formatData = {
        xAxis: {
            "name": Dynamic.analysis_Frequency
        },
        yAxis: {
            "name": Dynamic.analysis_status_RankingURL,
            "data": []
        },
        legend: statusArr,
        series: []
    }
    $.each(dataArr, function(index, status) {
            /*formatData.yAxis.data[statusArr[index]] = status.map(function(item){
                return item.url
            })*/
            if (swiper.activeIndex === 3) {
                formatData.yAxis.name = Dynamic.analysis_status_RankingIP
            }
            formatData.yAxis.data.push(status.map(function(item) {
                return item.name
            }))
            formatData.series.push({
                name: statusArr[index],
                data: status.map(function(item) {
                    return item.value
                })
            })
        })
        //构造datatable列
    if (dataArr && dataArr.length > 0) {
        var tpl = '';
        $.each(formatData.series[0].data, function(index, item) {
            tpl += "<tr><td nowrap='nowrap'>" + (index + 1) + "</td><td nowrap='nowrap'><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + formatData.yAxis.data[0][index] + "</div></td><td nowrap='nowrap'>" + item + "</td></tr>";
        })
    }

    return {
        formatData: formatData,
        tpl: tpl
    }
}

function loadGeneralInfo(data) {
    var currentHash = location.hash,
        data = data;

    if (currentHash === '#/analysis/pv') {
        pvRefresh(data)
    } else if (currentHash === '#/analysis/tp') {
        tpRefresh(data)
    } else if (currentHash === '#/analysis/rf') {
        rfRefresh(data)
    } else if (currentHash === '#/analysis/ip') {
        ipRefresh(data)
    } else if (currentHash === '#/analysis/os') {
        osRefresh(data)
    } else if (currentHash === '#/analysis/br') {
        brRefresh(data)
    } else if (currentHash === '#/analysis/status') {
        statusRefresh(data)
    } else if (currentHash === '#/analysis/data') {
        dataRefresh(data)
    } else if (currentHash === '#/analysis/request') {
        requestRefresh(data)
    } else if (currentHash === '#/analysis/crawler') {
        crawlerRefresh(data)
    } else if (currentHash === '#/analysis/sqlinjection') {
        injectionRefresh(data)
    } else if (currentHash === '#/analysis/fileinclusion') {
        fileinclusionRefresh(data)
    } else if (currentHash === '#/analysis/xss') {
        xssRefresh(data)
    }

    // counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 300 // the speed time in ms
    });
}

// function loadData(data) {
//     allData = data;
//     var urlCount = 0;
//     var ipCount = 0;
//     var bytesCount = 0;
//     hideLoading();
// }

function showLoading() {
    if (typeof funnelChart != "undefined") {
        funnelChart.showLoading(loadingObj);
    }
    if (typeof lineChart != "undefined") {
        lineChart.showLoading(loadingObj);
    }
}

function hideLoading() {
    if (typeof funnelChart != "undefined") {
        funnelChart.hideLoading();
    }
}

//轉化率分析頁面走pagenamecheck方法
function pageNameCheck(data) {
    if (pageName == "CVR") {
        $(".cvrBox_line3").css("display", "none")
        showLoading();
        cvrMoreData = data;
        if (data.length > 0) {
            cvrUrlData = data;
            var description = [];
            var cvrUrl = [];
            var pvCount = [];
            $(".cvrBox_line2").css("display", "none");
            $(".cvrBox_line4").css("display", "block");
            $(".echarts_funnel").css({ "height": "100%" });
            $(".echarts_more").css({ "height": "0%" });
            funnelChart.resize();
            $(".echarts_more").empty();
            for (var i = 0; i < data.length; i++) {
                cvrUrl.push(data[i].url);
                description.push(data[i].desc);
                pvCount.push(data[i].pvCount)
            }
            //漏斗图判断与初始化
            if (document.getElementsByClassName("echarts_funnel")[0]) {
                var funnelName = [];
                var cvrCountArr = [];
                for (var i = 0; i < description.length; i++) {
                    var obj = {};
                    if (pvCount[i - 1] != 0) {
                        obj.value = pvCount[i];
                        var val = toDecimal2(ForDight(((pvCount[i] * 100) / pvCount[i - 1]), 4));
                        obj.name = description[i];
                    } else {
                        var val = obj.value = "∞";
                        obj.name = description[i];
                    }
                    if (i != 0) {
                        cvrCountArr.push(ForDight(((pvCount[i]) / pvCount[i - 1]), 4))
                    }
                    funnelName.push(obj);
                }
                var cvrCount_1 = cvrCountArr[0];
                for (var l = 1; l < cvrCountArr.length; l++) {
                    if (cvrCount_1 == 0 || cvrCountArr[l] == 0) {
                        cvrCount_1 = 0;
                    } else {
                        cvrCount_1 = cvrCountArr[l] * cvrCount_1;
                    }
                }
                $(".cvrCount").html(toDecimal2(ForDight((data[data.length - 1].pvCount * 100 / data[0].pvCount), 2)) + "%");
                op01Funnel(funnelName);
            }
        }
        hideLoading();
    }
}

function rpTypeCheck() {
    if (pageName == "PV") {
        if (swiper.activeIndex == 0) {
            rpType = "areaplot";
        } else if (swiper.activeIndex == 1) {
            rpType = "mapplot";
        } else if (swiper.activeIndex == 2) {
            rpType = "hbarplot";
        } else if (swiper.activeIndex == 3) {
            rpType = "treemap";
        }
    } else if (pageName == "IP") {
        if (swiper.activeIndex == 0) {
            rpType = "areaplot";
        } else if (swiper.activeIndex == 1) {
            rpType = "mapplot";
        } else if (swiper.activeIndex == 2) {
            rpType = "hbarplot";
        } else if (swiper.activeIndex == 3) {
            rpType = "treemap";
        }
    } else if (pageName == "DATA") {
        if (swiper.activeIndex == 0) {
            rpType = "areaplot";
        } else if (swiper.activeIndex == 1) {
            rpType = "mapplot";
        } else if (swiper.activeIndex == 2) {
            rpType = "hbarplot";
        } else if (swiper.activeIndex == 3) {
            rpType = "treemap";
        }
    } else if (pageName == "STATUS") {
        if (swiper.activeIndex == 0) {
            rpType = "statusBar1";
        } else if (swiper.activeIndex == 1) {
            rpType = "statusBar2";
        } else if (swiper.activeIndex == 2) {
            rpType = "statusVbar1";
        } else if (swiper.activeIndex == 3) {
            rpType = "statusVbar2";
        }
    } else if (pageName == "BR" || pageName == "OS" || pageName == "REQUEST" || pageName == "REFERRER" || pageName == "TP") {
        rpType = "hbarplot";
    } else if (pageName == "CRAWLER" || pageName == "INJECTION" || pageName == "LOOPHOLE" || pageName == "SCRIPT") {
        if (swiper.activeIndex == 0) {
            rpType = "fBar"
        } else if (swiper.activeIndex == 1) {
            rpType = "ipBar";
        } else if (swiper.activeIndex == 2) {
            rpType = "urlBar";
        } else if (swiper.activeIndex == 3) {
            rpType = "statusBar"
        }
    }
}
//打印
$("body").delegate(".printBtn", "click", function() {
        var l = Ladda.create(this);
        l.start();
        var PARAMS = {
            startTime: timeZoneChange(smChartST[swiper.activeIndex]),
            endTime: timeZoneChange(smChartET[swiper.activeIndex]),
            project_id: projectID,
            leftType: pageName,
            chartType: chartType,
            chartType: chartType,
            chartTxt: chartTxt,
            title: chartObj[swiper.activeIndex][0]["opts"].title,
            country: controlMapType === "World" ? "" : "China",
            timeZone: timeZone,
            os_type: isMac() ? 'mac' : ''
        }
        $.ajax({
            async: true,
            type: "post",
            dataType: "json",
            data: PARAMS,
            url: "/api/analysis.open?cmd=WEL:PRINTREPORT",
            success: function(data) { //请求成功后处理函数。
                l.stop()
                $("#printReportIframe").attr("src", data.pdf);
                setTimeout(function() {
                    $("#printReportIframe")[0].contentWindow.print();
                }, 500);
            }
        })


    })
    //PDF
$("body").delegate(".pdfBtn", "click", function() {
        var l = Ladda.create(this);
        l.start();
        var PARAMS = {
            startTime: timeZoneChange(smChartST[swiper.activeIndex]),
            endTime: timeZoneChange(smChartET[swiper.activeIndex]),
            project_id: projectID,
            leftType: pageName,
            chartType: chartType,
            chartType: chartType,
            chartTxt: chartTxt,
            title: chartObj[swiper.activeIndex][0]["opts"].title,
            country: controlMapType === "World" ? "" : "China",
            timeZone: timeZone,
            os_type: isMac() ? 'mac' : ''
        }
        var temp = document.createElement("form");
        temp.action = "/api/download.open?cmd=WEL:REPORTPDF";
        temp.method = "post";
        temp.style.display = "none";
        for (var x in PARAMS) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = PARAMS[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
        l.stop()
        return temp;
    })
    //CSV
$("body").delegate(".csvBtn", "click", function() {
    var l = Ladda.create(this);
    l.start();
    var PARAMS = {
        startTime: timeZoneChange(smChartST[swiper.activeIndex]),
        endTime: timeZoneChange(smChartET[swiper.activeIndex]),
        project_id: projectID,
        leftType: pageName,
        chartType: chartType,
        chartType: chartType,
        chartTxt: chartTxt,
        title: chartObj[swiper.activeIndex][0]["opts"].title,
        country: controlMapType === "World" ? "" : "China",
        timeZone: timeZone,
        os_type: isMac() ? 'mac' : ''
    }
    var temp = document.createElement("form");
    temp.action = "/api/download.open?cmd=WEL:REPORTCSV";
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    l.stop()
    return temp;
})

//
function calculateTime(time, num) {
    var time = time,
        num = num;
    var formatTime = time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8) + " " + time.slice(8, 10) + ":" + time.slice(10, 12);
    if (interval === "year") {
        return time.slice(0, 4) - num + time.slice(4);
    } else if (interval === "oneMonth") {
        return moment(formatTime).add(-num, "month").format('YYYYMMDDHHmm');
    } else if (interval === "week") {
        return moment(formatTime).add(-7 * num, "day").format('YYYYMMDDHHmm');
    } else if (interval === "day") {
        return moment(formatTime).add(-num, "day").format('YYYYMMDDHHmm');
    }
}

function formatTime(time, interval) {
    var time = time,
        interval = interval;

    if (interval === "year") {
        return time.slice(0, 4);
    } else if (interval === "oneMonth") {
        return time.slice(0, 4) + '-' + time.slice(4, 6)
    } else if (interval === "week") {
        return time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8)
    } else if (interval === "day") {
        return time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8)
    }
}

function analysis(chart) {
    var roleID = localStorage.getItem("ROLE_ID");
    projectID = localStorage.getItem("PROJECTID");
    var projectName = localStorage.getItem("PROJECT_NAME")
        //选择项目初始化
        //LINK_STATUS 菜单所属模块的开通状态（0：未开通，1：开通）


    $('#selectPro').selectpicker({
        width: "auto",
        size: 10,
        title: Dynamic.analysis_emptyproject
    });
    if (localStorage.getItem("LINK_STATUS") !== "0") {
        $.ajax({
            url: "/api/project.open?cmd=WEL:SELECTPROJECTNAME",
            data: {
                roleId: roleID
            },
            success: function(data) {
                var projectName;
                var tpl = '';
                if (data.code === "200070") {
                    swal({
                        title: Dynamic.analysis_seesionExpired,
                        text: "",
                        type: "info",
                        confirmButtonText: Danalysis_ok,
                        closeOnConfirm: false
                    }, function() {
                        window.location.href = "login.html";
                    })
                } else {
                    if (data.use && data.use.length != 0) {
                        $("#selectPro").empty();

                        for (var i = 0; i < data.use.length; i++) {
                            if (projectID == data.use[i].id) {
                                projectName = data.use[i].name;
                            }
                            tpl = tpl + "<option value=" + data.use[i].name + " data-fileid=" + (i) + " data-id=" + data.use[i].id + ">" + data.use[i].name + "</option>";
                        }
                        //获取到数据后重新渲染下拉框并刷新
                        $('#selectPro').empty()
                        $('#selectPro').append(tpl)
                        $('#selectPro').selectpicker('render');
                        $('#selectPro').selectpicker({
                            width: "auto",
                            title: projectName,
                            size: 10,
                        });
                        $('#selectPro').selectpicker('refresh');
                    }
                }
            }
        })
    } else {
        projectID = "0"
        $("#selectPro").empty();
        tpl = "<option value=" + Dynamic.analysis_emptyProSelect + " data-fileid='0' data-id='0'>" + Dynamic.analysis_emptyProSelect + "</option>";
        $("#selectPro").append(tpl);
        $('.analysisPro_choose').eq(0).selectpicker({
            width: "auto",
            title: Dynamic.analysis_emptyProSelect,
            size: 10,
        });
        var hash = location.hash;
        if (hash === "#/analysis/crawler" || hash === "#/analysis/sqlinjection" || hash === "#/analysis/fileinclusion" || hash === "#/analysis/xss") {
            $("#addChart").removeClass();
            $("#reportrange").removeClass();
            $('#analysisToSearchBtn').removeClass();
            $("#addChart").addClass("btn default disabled");
            $("#reportrange").addClass("btn default disabled");
            $('#analysisToSearchBtn').addClass("btn default disabled");
            var tpl = $("<span style='display:inline-block;color:#678098;font-size:22px;font-weight:400;padding:1px 0 0px;'>DEMO</span>" +
                '<button type="button" class="btn green btn-outline uppercase" id="setupBtn" style="margin:-10px 0px 0px 20px;height:26px;line-height:12px;font-size:12px;">' + Dynamic.analysis_atOnceSetup + '</button>')
            $("#analysisTitle").parent().after(tpl);
            $("#setupBtn").on("click", function() {
                $.ajax({
                    type: "get",
                    url: "/api/user.open?cmd=WEL:IMMEDIATELYOPEN",
                    data: {
                        menuCode: localStorage.getItem("PARENT_ID")
                    },
                    async: true,
                    success: function(data) {
                        if (data["code"] === "20000") {
                            swal({
                                title: Dynamic.analysis_setupMessage,
                                text: "",
                                type: "info",
                                confirmButtonText: analysis_ok,
                                closeOnConfirm: false
                            })
                        } else {
                            swal({
                                title: Dynamic.strings_senderror,
                                text: "",
                                type: "error",
                                confirmButtonText: analysis_ok,
                                closeOnConfirm: false
                            })
                        }
                    }
                })
            })
        }
    }
    if (localStorage.getItem("ANALYSIS_LABLE") == "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") == "Custom Range") {
        $(".smChartsImgBox").css("display", "none");
        if (location.hash == "#/analysis/tp" || location.hash == "#/analysis/os" || location.hash == "#/analysis/br") {
            $(".swiperB").addClass("swiperB_full_with_txt")
        } else {
            $(".swiperB").addClass("swiperB_full")
        }
    }
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
            if (localStorage.getItem("LINK_STATUS") === "0") {
                smChartST[0] = '201604260000';
            } else {
                smChartST[0] = startTime;
            }
            return moment(localStorage.getItem("ANALYSIS_START_TIME").toString())
        } else {
            if (localStorage.getItem("LINK_STATUS") === "0") {
                smChartST[0] = '201604260000';
            } else {
                smChartST[0] = moment().startOf('day').format("YYYYMMDDHHmm");
            }
            return moment().startOf('day')
        }
    })();
    var dateRangePickerEndTime = (function() {
        if (localStorage.getItem("ANALYSIS_END_TIME") != "" && localStorage.getItem("ANALYSIS_END_TIME") != null) {
            endTime = moment(localStorage.getItem("ANALYSIS_END_TIME").toString()).format("YYYYMMDDHHmm");
            if (localStorage.getItem("LINK_STATUS") === "0") {
                smChartET[0] = '201604270000';
            } else {
                smChartET[0] = endTime;
            }
            return moment(localStorage.getItem("ANALYSIS_END_TIME").toString())
        } else {
            if (localStorage.getItem("LINK_STATUS") === "0") {
                smChartET[0] = '201604270000';
            } else {
                smChartET[0] = moment().add(1, "d").startOf('day').format("YYYYMMDDHHmm");
            }
            return moment().add(1, "d").startOf('day')
        }
    })();

    var daterange, daterangeArr, datarangeLocal;
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
        daterangeArr = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Year', 'Custom Range']
        datarangeLocal = {
            customRangeLabel: "Custom Range"
        }
    }
    if (localStorage.getItem("LINK_STATUS") !== "0") {
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
            if (label == "自定义日期" || label == "Custom Range") {
                $("#reportrange>span").html(start.format('YYYY-MM-DD HH:mm') + ' - ' + end.format('YYYY-MM-DD HH:mm'))
            } else {
                $("#reportrange>span").html(label + "&nbsp;" + start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'))
            }
            localStorage.setItem("ANALYSIS_DATE_HTML", $("#reportrange>span").html())
            localStorage.setItem("ANALYSIS_START_TIME", new Date(start));
            localStorage.setItem("ANALYSIS_END_TIME", new Date(end));
            localStorage.setItem("ANALYSIS_LABLE", label);

            if (label == daterangeArr[0] || label == daterangeArr[1]) {
                interval = "day";
                $(".smChartsImgBox").css("display", "block");
                $(".swiperB").removeClass("swiperB_full")
                $(".swiperB").removeClass("swiperB_full_with_txt")
            } else if (label == daterangeArr[2]) {
                interval = "week";
                $(".smChartsImgBox").css("display", "block");
                $(".swiperB").removeClass("swiperB_full")
                $(".swiperB").removeClass("swiperB_full_with_txt")
            } else if (label == daterangeArr[3]) {
                interval = "oneMonth";
                $(".smChartsImgBox").css("display", "block");
                $(".swiperB").removeClass("swiperB_full")
                $(".swiperB").removeClass("swiperB_full_with_txt")
            } else if (label == daterangeArr[4]) {
                interval = "year";
                $(".smChartsImgBox").css("display", "block");
                $(".swiperB").removeClass("swiperB_full")
                $(".swiperB").removeClass("swiperB_full_with_txt")
            } else if (label == "自定义日期" || label == "Custom Range") {
                $(".smChartsImgBox").css("display", "none");
                if (location.hash == "#/analysis/tp" || location.hash == "#/analysis/os" || location.hash == "#/analysis/br") {
                    $(".swiperB").addClass("swiperB_full_with_txt")
                } else {
                    $(".swiperB").addClass("swiperB_full")
                }
            }
            console.log(start);
            console.log(end);
            var customStartTime = start.format('YYYYMMDDHHmm');
            var customEndTime = end.format('YYYYMMDDHHmm');
            startTime = customStartTime,
                endTime = customEndTime;

            localStorage.setItem("ANALYSIS_INTERVAL", _interval)
            rpTypeCheck();
            if (location.hash !== "#/analysis/cvr") {
                $.each(chartObj[swiper.activeIndex], function(index, chart) {
                    chart.showLoading()
                })

                smChartArr[swiper.activeIndex].opts.startTime = startTime
                smChartArr[swiper.activeIndex].opts.endTime = endTime
                smChartArr[swiper.activeIndex].opts.interval = interval

                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    rpType: rpType,
                    chart: chartObj[swiper.activeIndex],
                    mapType: controlMapType,
                    setLocalStorage: (rpType === "hbarplot" || rpType === "treemap"),
                    smCharts: smChartArr[swiper.activeIndex]
                })
            } else {
                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    rpType: rpType
                })
            }
        });
    } else {
        $("#reportrange>span").html('今日 2016-04-26 -- 2016-04-27');
        $(".smChartsImgBox").css("display", "block");
        $(".swiperB").removeClass("swiperB_full");
    }
    $.ajax({
        type: "get",
        url: "/api/toppage.open?cmd=WEL:SELECTTOPINFO",
        async: true,
        cache: true,
        dataType: "json", //返回json格式
        success: function(data) {
            if (data.reportType != "") {
                storageArr = data.reportType.split(",");
            } else {
                storageArr = []
            }
        },
        error: function() { // 请求失败处理函数
            swal({
                title: "Session过期，请重新登录！",
                text: "",
                type: "info",
                confirmButtonText: analysis_ok,
                closeOnConfirm: false
            }, function() {
                window.location.href = "login.html";
            })
        }
    })

        //数据详情
    $("#dataListBtn").click(function() {
        if (moreDateMark === 0) {
            $(".txtData").css({ "-webkit-transform": "translateY(-100%)", "-moz-transform": "translateY(-100%)", "-ms-transform": "translateY(-100%)", "-o-transform": "translateY(-100%)" });
            $(".swiperImg").css({ "-webkit-transform": "translateY(-100%)", "-moz-transform": "translateY(-100%)", "-ms-transform": "translateY(-100%)", "-o-transform": "translateY(-100%)" });
            moreDateMark = 1;
            $(this).html(Dynamic.analysis_viewChart)
        } else if (moreDateMark == 1) {
            $(".swiperImg").css({ "-webkit-transform": "translateY(0)" });
            $(".swiperImg").css({ "-moz-transform": "translateY(0)" });
            $(".swiperImg").css({ "-ms-transform": "translateY(0)" });
            $(".swiperImg").css({ "-o-transform": "translateY(0)" });
            $(".txtData").css({ "-webkit-transform": "translateY(0)" });
            $(".txtData").css({ "-moz-transform": "translateY(0)" });
            $(".txtData").css({ "-ms-transform": "translateY(0)" });
            $(".txtData").css({ "-o-transform": "translateY(0)" });
            moreDateMark = 0;
            $(this).html(Dynamic.analysis_viewData)
        }

    });
    $("#nav i").click(function() {
        $("#laydate_clear").hide();
    });
    //projectSelectBtn
    $(".analysisPageHead").delegate("select", "change", function() {
        var i = Number($("li.selected").attr("data-original-index"));
        projectID = $("#selectPro option:eq(" + i + ")").attr("data-id");
        if (localStorage.getItem("LINK_STATUS") !== "0") {
            upDateProID();
        }
        skipSwiper = swiper.activeIndex;
        indexToAnalysis = true
        chartTime = []
        $(".swiperImg").css({
            "-webkit-transform": "translateY(0)",
            "-moz-transform": "translateY(0)",
            "-ms-transform": "translateY(0)",
            "-o-transform": "translateY(0)"
        });
        $(".txtData").css({
            "-webkit-transform": "translateY(0)",
            "-moz-transform": "translateY(0)",
            "-ms-transform": "translateY(0)",
            "-o-transform": "translateY(0)"
        });

        $("#dataListBtn").html(Dynamic.analysis_viewData)
        if (pageName === "CVR") {
            cvrBtn();
        } else {
            rpTypeCheck();

            $.each(chartObj[swiper.activeIndex], function(index, chart) {
                chart.showLoading()
            })

            getChartData({
                projectID: projectID,
                startTime: startTime,
                endTime: endTime,
                url: btnUrl,
                datetype: _interval,
                rpType: rpType,
                chart: chartObj[swiper.activeIndex],
                smCharts: smChartArr[swiper.activeIndex]
            })
        }
    })

    //CSV
    $("#viewAttackSource").click(function() {
        var l = Ladda.create(this);
        l.start();
        var PARAMS = {
            startTime: timeZoneChange(smChartST[swiper.activeIndex]),
            endTime: timeZoneChange(smChartET[swiper.activeIndex]),
            project_id: projectID,
            chartType: pageName,
            timeZone: timeZone,
            os_type: isMac() ? 'mac' : '',
            chartTxt: [Dynamic.analysis_step, Dynamic.analysis_logTime, Dynamic.analysis_sourceIp, Dynamic.analysis_responseStatus]
        }
        var temp = document.createElement("form");
        temp.action = "/api/download.open?cmd=WEL:REPORTIPCSV";
        temp.method = "post";
        temp.style.display = "none";
        for (var x in PARAMS) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = PARAMS[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
        l.stop()
        return temp;
    })

    //将所选图表添加到首页
    var analysis_addDashboard = Dynamic.analysis_addDashboard;
    var analysis_addDashboardexp = Dynamic.analysis_addDashboardexp;
    var analysis_addDashboardsuc = Dynamic.analysis_addDashboardsuc;
    var analysis_addDashboarddef = Dynamic.analysis_addDashboarddef;
    var analysis_addDashboarderr1 = Dynamic.analysis_addDashboarderr1;
    var analysis_addDashboarderr2 = Dynamic.analysis_addDashboarderr2;
    var analysis_ok = Dynamic.analysis_ok;
    var analysis_cancel = Dynamic.analysis_cancel;
    $("#addChart").click(function() {
        var that = $(this);
        if (location.hash !== '#/analysis/cvr' && projectID != 0 && localStorage.getItem("LINK_STATUS") !== "0") {
            swal({
                    title: analysis_addDashboard,
                    text: analysis_addDashboardexp,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: analysis_ok,
                    cancelButtonText: analysis_cancel,
                    closeOnConfirm: false
                },
                function() {
                    var sessionVal;
                    if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_line")) {
                        sessionVal = pageName + "|line|" + projectID;
                    } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_map")) {
                        sessionVal = pageName + (chartObj[1][0].opts.mapType === "World" ? "|global_map|" : "|cn_map|") + projectID;
                    } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).attr("class")) {
                        if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).attr("class").indexOf("echarts_vBar") != -1 && pageName == "STATUS") {
                            if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).hasClass("echarts_vBar2")) {
                                sessionVal = pageName + "|vBar1|" + projectID;
                            } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).hasClass("echarts_vBar3")) {
                                sessionVal = pageName + "|vBar2|" + projectID;
                            }
                        } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).attr("class").indexOf("echarts_vBar") != -1 && (pageName === "CRAWLER" || pageName === "LOOPHOLE" || pageName === "INJECTION" || pageName === "SCRIPT")) {
                            if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).hasClass("echarts_vBar1")) {
                                sessionVal = pageName + "|ipBar|" + projectID;
                            } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).hasClass("echarts_vBar2")) {
                                sessionVal = pageName + "|urlBar|" + projectID;
                            }
                        } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").children().eq(0).attr("class").indexOf("echarts_vBar") != -1) {
                            sessionVal = pageName + "|vBar|" + projectID;
                        }
                    } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_area")) {
                        sessionVal = pageName + "|area|" + projectID;
                    } else if (pageName == "STATUS") {
                        if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_bar1")) {
                            sessionVal = pageName + "|bar1|" + projectID;
                        } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_bar2")) {
                            sessionVal = pageName + "|bar2|" + projectID;
                        }
                    } else if (pageName === "CRAWLER" || pageName === "LOOPHOLE" || pageName === "INJECTION" || pageName === "SCRIPT") {
                        if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_bar1")) {
                            sessionVal = pageName + "|fBar|" + projectID;
                        } else if (that.parents(".page-head").next().find(".swiper-slide-active .swiperB").hasClass("echarts_bar2")) {
                            sessionVal = pageName + "|statusBar|" + projectID;
                        }
                    }
                    //当值不为空的时候推入数组
                    if (sessionVal !== "") {
                        if ($.inArray(sessionVal, storageArr) == -1) {
                            storageArr.push(sessionVal);
                            if (xhr != undefined) {
                                xhr.abort();
                            }
                            xhr = $.ajax({
                                type: "post",
                                url: "/api/toppage.open",
                                data: {
                                    storageArr: storageArr
                                },
                                async: true,
                                cache: true,
                                //dataType : "json", //返回json格式
                                success: function(data) {
                                    swal({
                                        title: analysis_addDashboardsuc,
                                        confirmButtonText: analysis_ok,
                                        type: "success",
                                    });
                                },
                                error: function() { // 请求失败处理函数
                                    swal({
                                        title: analysis_addDashboarddef,
                                        confirmButtonText: analysis_ok,
                                        type: "error",
                                    });
                                }
                            })

                        } else {
                            swal({
                                title: analysis_addDashboarderr1,
                                type: "error",
                                confirmButtonText: analysis_ok,
                                closeOnConfirm: false
                            })
                        }
                    }
                });
        } else if (projectID == 0 && localStorage.getItem("LINK_STATUS") !== "0") {
            swal({
                title: analysis_addDashboarderr2,
                type: "error",
                confirmButtonText: analysis_ok,
                closeOnConfirm: false
            })
        }
    });
    //分析报表跳转智能搜索按钮
    $("#analysisToSearchBtn").click(function() {
        if (localStorage.getItem("LINK_STATUS") !== "0") {
            location.hash = "#/search"
        } else {
            return
        }
    })
    window.onresize = function() {
        if (!(location.hash == "#/analysis/cvr" || location.hash == "#/search" || location.hash == "#/dashboard1")) {
            $("section").css("min-height", document.documentElement.clientHeight - 240 + "px");
            if (chartObj && chartObj.length > 0) {
                resizeChartList(chartObj);
            }
            if (smChartObj && smChartObj.length > 0) {
                resizeChartList(smChartObj)
            }
        }
    };

    function resizeChartList(ChartList) {
        $.each(ChartList, function(index, chart) {
            $.each(chart, function(index, item) {
                if (item) {
                    item.resize()
                }
            })
        })
    }


    //缩略图点击事件
    $(".smChartsImgBox").delegate(".smChartsImg img", "click", function() {

        if ($(this).attr('src') != 'img/error.png' && $(this).attr('src') != 'img/error-en.png') {
            var currentIndex = swiper.activeIndex;
            $(".echarts_vBar" + currentIndex).css({ "width": "100%" });
            $(".echarts_lBar" + currentIndex).css({ "display": "none" });
            chartObj[currentIndex][0].resize();
            chartObj[currentIndex][0].showLoading();
            $("li", $(this).parent().parent()).css("border", "1px solid rgba(0,0,0,0)");
            $(this).parent().css("border", "1px solid #2E98FF");
            // var imgDateArr = $(this).attr("src").replace("NailFIG/", "").replace(".png", "").split("/"),
            //     projectID = imgDateArr[4],
            //     figType = imgDateArr[6],
            //     interval = imgDateArr[7],
            //     imgStartTime = imgDateArr[8].replace(/-/g, ""),
            //     currentST = moment(imgDateArr[8]);

            var imgDateArr = $(this).attr("src").replace("/chart/NailFIG/", "").replace(".png", "").split("/"),
                interval = imgDateArr[4],
                currentST = moment(formatTime(imgDateArr[5], interval));
            if (localStorage.getItem("LINK_STATUS") === "0") {
                smChartST[swiper.activeIndex] = '201604260000';
            } else {
                smChartST[swiper.activeIndex] = currentST.format('YYYYMMDDHHmm');
            }

            if (interval === "week") {
                if (localStorage.getItem("LINK_STATUS") === "0") {
                    smChartET[swiper.activeIndex] = '201604270000';
                } else {
                    smChartET[swiper.activeIndex] = moment(currentST).add(7, 'day').format('YYYYMMDDHHmm');
                }
            } else {
                if (localStorage.getItem("LINK_STATUS") === "0") {
                    smChartET[swiper.activeIndex] = '201604270000';
                } else {
                    if (interval === 'oneMonth') {
                        smChartET[swiper.activeIndex] = moment(currentST).add(1, 'month').format('YYYYMMDDHHmm');
                    } else {
                        smChartET[swiper.activeIndex] = moment(currentST).add(1, interval).format('YYYYMMDDHHmm');
                    }

                }
            }

            if (rpType === "mapplot") {
                var tempMapType = chartObj[1][0].opts.mapType;
                if (tempMapType === "World") {
                    rpType = "global_mapplot"
                } else if (tempMapType === "China") {
                    rpType = "cn_mapplot"
                }
            }

            if (xhr != undefined) {
                xhr.abort();
            }
            xhr = $.ajax({
                type: "post",
                url: btnUrl + '?cmd=WEL:GETCHARINFO',
                data: {
                    project_id: projectID,
                    chartType: rpType,
                    startTime: timeZoneChange(smChartST[swiper.activeIndex]),
                    endTime: timeZoneChange(smChartET[swiper.activeIndex]),
                    timeZone: timeZone
                },
                async: true,
                success: function(data) {
                    loadGeneralInfo(data);
                    renderChart(data, chartObj[swiper.activeIndex][0]);
                },
                error: function() {}
            })
        }
    })

    $(".region-select").delegate("a", "click", function() {
        $(".region-select-group").eq(0).css({ "display": "none" })
        $("button", $(".region-select-group").eq(1)).removeClass();
        $("button", $(".region-select-group").eq(1)).addClass("btn default disabled")
        var countryName = $(this).attr("data-value");
        registMap(countryName);
        chartObj[swiper.activeIndex][0].myChart.dispose();
        var mapChart = new chart.Chart($(".echarts_map"), {
            type: 'mapplot',
            title: Dynamic.homeCharts_title2
        })
        controlMapType = countryName;
        chartObj[1] = [mapChart];
        mapChart.showLoading();
        chartObj[swiper.activeIndex][0].opts.mapType = countryName;

        $('.smChartsImgBox', $(this).parents('.swiperImg')).empty();

        rpTypeCheck();
        getChartData({
            projectID: projectID,
            startTime: startTime,
            endTime: endTime,
            url: btnUrl,
            datetype: _interval,
            rpType: rpType,
            chart: chartObj[swiper.activeIndex],
            mapType: countryName,
            timeZone: timeZone,
            smCharts: smChartArr[swiper.activeIndex]
        })
    });
    // if(language === "en"){
    //     $(".region-select-group").css({"display":"none"})
    // }
}
