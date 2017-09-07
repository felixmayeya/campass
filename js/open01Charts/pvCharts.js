//PV
function pvBtn(chart, smChart) {
    pageName = "PV";
    btnUrl = '/api/analysis.open';
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartObj = []; //小图表对象数组
    smChartArr = [];
    var pvStartTime, pvEndTime;
    moreDateMark = 0;

    localStorage.setItem("CHART_DATA", '')

    //swiper插件配置与初始化
    var paginationArr = Dynamic.analysis_pv_paginationArr
    if (swiper) {
        swiper.destroy(false)
    }
    swiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        onSlideChangeStart: function(swiper) {
            var currentChartTime = startTime + "|" + endTime
            if (swiper.activeIndex == 0 && chartTime[swiper.activeIndex] != currentChartTime) {
                //创建chart对象
                var lineChart = new chart.Chart($(".echarts_line"), {
                    type: 'areaplot',
                    title: Dynamic.homeCharts_title1
                })
                chartObj[0] = [lineChart];
                lineChart.showLoading();

                var smCharts0 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,
                })
                smChartArr[0] = smCharts0;

                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "areaplot",
                    chart: [lineChart],
                    smCharts: smCharts0
                })
            } else if (swiper.activeIndex == 1 && chartTime[swiper.activeIndex] != currentChartTime) {
                var mapChart = new chart.Chart($(".echarts_map"), {
                    type: 'mapplot',
                    title: Dynamic.homeCharts_title2,
                    mapType: homeSkipMapType || mapType
                })

                chartObj[1] = [mapChart];
                mapChart.showLoading();

                var smCharts1 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,
                })
                smChartArr[1] = smCharts1;

                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "mapplot",
                    chart: [mapChart],
                    mapType: homeSkipMapType || mapType,
                    smCharts: smCharts1
                })
                controlMapType = homeSkipMapType || mapType;
                homeSkipMapType = false;
            } else if (swiper.activeIndex == 2 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart = new chart.Chart($(".echarts_vBar2"), {
                        type: 'hbarplot',
                        title: Dynamic.homeCharts_title3
                    })
                    // var treeChart = new chart.Chart($(".echarts_area"), {
                    //     type: 'treeplot',
                    //     title: Dynamic.homeCharts_title4
                    // })
                var lBarChart = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: 'false'
                })
                chartObj[2] = [vBarChart];
                // chartObj[3] = [treeChart, vBarChart];
                smChartObj[2] = [lBarChart];
                vBarChart.showLoading();

                var smCharts2 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,
                })

                smChartArr[2] = smCharts2;

                var chartData = localStorage.getItem('CHART_DATA')

                if (chartData && chartData !== '') {
                    renderChart(JSON.parse(chartData), vBarChart);
                    chartTime[swiper.activeIndex] = currentChartTime;
                    //如果是自定义日期不构造小图
                    if (!(localStorage.getItem("ANALYSIS_LABLE") === "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") === "Custom Range")) {
                        smChartsBuild(swiper.activeIndex);
                    }
                } else {
                    // getChartDataDruid({
                    //     projectID:projectID,
                    //     startTime: startTime,
                    //     endTime: endTime,
                    //     rpType: "hbarplot",
                    //     chart:[vBarChart],
                    //     smCharts: smCharts2,
                    //     setLocalStorage: true
                    // })
                    getChartData({
                        projectID: projectID,
                        startTime: startTime,
                        endTime: endTime,
                        url: btnUrl,
                        datetype: _interval,
                        rpType: "hbarplot",
                        chart: [vBarChart],
                        setLocalStorage: true,
                        smCharts: smCharts2
                    })
                }
            } else if (swiper.activeIndex == 3 && chartTime[swiper.activeIndex] != currentChartTime) {
                var treeChart = new chart.Chart($(".echarts_area"), {
                        type: 'treeplot',
                        title: Dynamic.homeCharts_title3
                    })
                    // var vBarChart = new chart.Chart($(".echarts_vBar2"), {
                    //     type: 'hbarplot',
                    //     title: Dynamic.homeCharts_title4
                    // })
                var lBarChart = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: 'false'
                })
                chartObj[3] = [treeChart];
                chartObj[2] = [lBarChart];
                treeChart.showLoading();

                var smCharts3 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,

                })

                smChartArr[3] = smCharts3;

                var chartData = localStorage.getItem('CHART_DATA')

                if (chartData && chartData !== '') {
                    renderChart(JSON.parse(chartData), treeChart);
                    chartTime[swiper.activeIndex] = currentChartTime;
                    //如果是自定义日期不构造小图
                    if (!(localStorage.getItem("ANALYSIS_LABLE") === "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") === "Custom Range")) {
                        smChartsBuild(swiper.activeIndex);
                    }
                } else {
                    getChartData({
                        projectID: projectID,
                        startTime: startTime,
                        endTime: endTime,
                        url: btnUrl,
                        datetype: _interval,
                        rpType: "hbarplot",
                        chart: [treeChart],
                        setLocalStorage: true,
                        smCharts: smCharts3
                    })
                }
            }

            if (swiper.activeIndex == 0) {
                chartType = "line";
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TimeStrp, Dynamic.analysis_pageViewNum];
            } else if (swiper.activeIndex == 1) {
                chartType = "map";
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_Addres, Dynamic.analysis_pageViewNum];
            } else if (swiper.activeIndex == 2) {
                chartType = "vBar";
                chartTxt = [Dynamic.analysis_step, "URL", Dynamic.analysis_pageViewNum];
            } else if (swiper.activeIndex == 3) {
                chartType = "area";
                chartTxt = [Dynamic.analysis_step, "URL", Dynamic.analysis_pageViewNum];
            }
        },
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-3 col-xs-3">' + paginationArr[index] + '</li>'
        }
    });

    if (skipSwiper == 0) {
        chartType = "line";
        chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TimeStrp, Dynamic.analysis_pageViewNum];

        var lineChart = new chart.Chart($(".echarts_line"), {
            type: 'areaplot',
            title: Dynamic.homeCharts_title1
        })

        lineChart.showLoading();

        chartObj[swiper.activeIndex] = [lineChart];

        var smCharts0 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
            interval: interval,
            startTime: startTime,
            endTime: endTime,
            btnUrl: btnUrl,
            pageName: pageName,
            interval: interval,
        })
        smChartArr[0] = smCharts0;

        getChartData({
            projectID: projectID,
            startTime: startTime,
            endTime: endTime,
            url: btnUrl,
            datetype: _interval,
            rpType: "areaplot",
            chart: [lineChart],
            smCharts: smCharts0
        })

    }
    //首页点击跳转到相应图表
    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
}

function pvRefresh(data) {
    //var urlCount=data.thisPvNum;
    var ipCount = data.allIpCount;
    var lastIpcount = data.lastAllIpCount;
    var thisPvNum = data.thisPvNum;
    var lastPvNum = data.lastPvNum;

    //页面访问总量
    $(".counterSpan").eq(0).attr("data-value", thisPvNum);
    //页面访问总量比值
    var pvNumBt = (thisPvNum - lastPvNum) * 100;
    var pl1 = (pvNumBt / lastPvNum).toFixed(2);
    /*if(isNaN(pl1)){
        pl1 = 0;
    }*/
    if (lastPvNum == 0 && pvNumBt == 0) {
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
    } else if (lastPvNum == 0 && pvNumBt != 0) {
        $(".counterSpan").eq(1).attr("data-value", "∞");
        $(".font-red-haze").eq(1).html("")
    } else {
        if (pl1 < 0) {
            $(".counterSpan").eq(1).attr("data-value", "↓ " + toDecimal2(-pl1));
            $(".font-red-haze").eq(1).html("%")
        } else if (pl1 > 0) {
            $(".counterSpan").eq(1).attr("data-value", "↑ " + toDecimal2(pl1));
            $(".font-red-haze").eq(1).html("%")
        } else {
            $(".counterSpan").eq(1).attr("data-value", "0");
            $(".font-red-haze").eq(1).html("%")

            /*  if(pvNumBt<0 && pl1 ==0){
                    $(".counterSpan").eq(1).attr("data-value","↓ <0.01");
                    $(".font-red-haze").eq(1).html("%")
                }else if(pvNumBt>0 && pl1 ==0){
                    $(".counterSpan").eq(1).attr("data-value","↑ <0.01");
                    $(".font-red-haze").eq(1).html("%")
                }else{
                    $(".counterSpan").eq(1).attr("data-value","0");
                    $(".font-red-haze").eq(1).html("%")
                }*/

        }
    }

    //平均访问页面数
    if (ipCount == 0) {
        $(".counterSpan").eq(2).attr("data-value", "0");
    } else {
        $(".counterSpan").eq(2).attr("data-value", (thisPvNum / ipCount).toFixed(2));
    }
    //平均访问页面数比值
    //var pl3 = ((((thisPvNum-ipCount)*lastIpcount)*100)/(ipCount*(lastPvNum-lastIpcount))-100).toFixed(2);
    //((∑IP上x ∑pv本)/(∑IP本x ∑pv上)-1) x 100%
    var pl3 = (((lastIpcount * thisPvNum) / (ipCount * lastPvNum) - 1) * 100).toFixed(2);

    /*if(isNaN(pl3)){
        pl3 = 0;
    }*/
    var pl31 = ipCount * lastPvNum - lastIpcount * thisPvNum;
    var pl32 = ipCount * lastPvNum;
    if (pl32 == 0 && pl31 == 0) {
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-purple-soft").eq(4).html("")
    } else if (pl32 == 0 && pl31 != 0) {
        $(".counterSpan").eq(3).attr("data-value", "∞");
        $(".font-purple-soft").eq(4).html("")
    } else {
        if (pl3 < 0) {
            $(".counterSpan").eq(3).attr("data-value", "↓ " + toDecimal2(-pl3));
            $(".font-purple-soft").eq(4).html("%")
        } else if (pl3 > 0) {
            $(".counterSpan").eq(3).attr("data-value", "↑ " + toDecimal2(pl3));
            $(".font-purple-soft").eq(4).html("%")
        } else {
            /*$(".counterSpan").eq(3).attr("data-value","0");
            $(".font-purple-soft").eq(4).html("%")*/

            if (pl31 < 0 && pl3 == 0) {
                $(".counterSpan").eq(3).attr("data-value", "↓ <0.01");
                $(".font-purple-soft").eq(4).html("%")
            } else if (pl31 > 0 && pl3 == 0) {
                $(".counterSpan").eq(3).attr("data-value", "↑ <0.01");
                $(".font-purple-soft").eq(4).html("%")
            } else {
                $(".counterSpan").eq(3).attr("data-value", "0");
                $(".font-purple-soft").eq(4).html("%")
            }
        }
    }
}
