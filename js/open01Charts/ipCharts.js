//IP
function ipBtn(chart, smChart) {
    pageName = "IP";
    btnUrl = '/api/ipcount.open';
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartObj = []; //小图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    swiperIndex = 0;
    var ipStartTime;
    var ipEndTime;
    var drillTime = "";
    var paginationArr = Dynamic.analysis_ip_paginationArr;

    localStorage.setItem("CHART_DATA", '')

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
                    title: Dynamic.homeCharts_title5
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
                    title: Dynamic.homeCharts_title6,
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
                    title: Dynamic.homeCharts_title7
                })
                var lBarChart = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close'
                })
                chartObj[2] = [vBarChart];
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
                    title: Dynamic.homeCharts_title7
                })
                var lBarChart = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close'
                })
                chartObj[3] = [treeChart];
                smChartObj[2] = [lBarChart];
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
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TimeStrp, Dynamic.analysis_IpNum];
            } else if (swiper.activeIndex == 1) {
                chartType = "map";
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_Addres, Dynamic.analysis_IpNum];
            } else if (swiper.activeIndex == 2) {
                chartType = "vBar";
                chartTxt = [Dynamic.analysis_step, "IP", Dynamic.analysis_ViewIP];
            } else if (swiper.activeIndex == 3) {
                chartType = "area";
                chartTxt = [Dynamic.analysis_step, "IP", Dynamic.analysis_ViewIP];
            }
        },
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-3 col-xs-3">' + paginationArr[index] + '</li>'
        }
    });

    if (skipSwiper == 0) {
        var customStartTime;
        chartType = "line";
        chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TimeStrp, Dynamic.analysis_IpNum];

        var lineChart = new chart.Chart($(".echarts_line"), {
            type: 'areaplot',
            title: Dynamic.homeCharts_title5
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
    skipPage = "";
}

//更新数据
function ipRefresh(data) {
    var ipCount = data.allIpCount;
    var lastIpcount = data.lastAllIpCount;
    var newIpCount = data.newIpCount;
    var lastNewIpCount = data.lastNewIpCount;
    var visitIp = ipCount - newIpCount;
    var lastVisitIp = lastIpcount - lastNewIpCount;
    if (visitIp < 0) {
        visitIp = 0;
    }
    if (lastVisitIp < 0) {
        lastVisitIp = 0;
    }

    //唯一身份访问者
    $(".counterSpan").eq(0).attr("data-value", ipCount)
        //唯一身份访问者比值
    var pl1 = ((ipCount - lastIpcount) * 100 / lastIpcount).toFixed(2);
    /*if(isNaN(pl1)){
        pl1 = 0;
    }*/
    var pl11 = ipCount - lastIpcount;
    if (lastIpcount == 0 && pl11 == 0) {
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
    } else if (lastIpcount == 0 && pl11 != 0) {
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
            /*$(".counterSpan").eq(1).attr("data-value","0");
            $(".font-red-haze").eq(1).html("%")*/

            if (pl11 < 0 && pl1 == 0) {
                $(".counterSpan").eq(1).attr("data-value", "↓ <0.01");
                $(".font-red-haze").eq(1).html("%")
            } else if (pl11 > 0 && pl1 == 0) {
                $(".counterSpan").eq(1).attr("data-value", "↑ <0.01");
                $(".font-red-haze").eq(1).html("%")
            } else {
                $(".counterSpan").eq(1).attr("data-value", "0");
                $(".font-red-haze").eq(1).html("%")
            }
        }
    }

    //新增/回访比例
    $(".counterSpan").eq(2).attr("data-value", newIpCount);
    $(".counterSpan").eq(3).attr("data-value", visitIp);
    //新增比例比值
    var pl2 = ((newIpCount - lastNewIpCount) * 100 / lastNewIpCount).toFixed(2);
    /*if(isNaN(pl2)){
        pl2 = 0;
    }*/
    var pl22 = newIpCount - lastNewIpCount;
    if (lastNewIpCount == 0 && pl22 == 0) {
        $(".counterSpan").eq(4).attr("data-value", "--");
        $(".font-purple-soft").eq(4).html("/")
    } else if (lastNewIpCount == 0 && pl22 != 0) {
        $(".counterSpan").eq(4).attr("data-value", "∞");
        $(".font-purple-soft").eq(4).html("/")
    } else {
        if (pl2 < 0) {
            $(".counterSpan").eq(4).attr("data-value", "↓ " + toDecimal2(-pl2));
            $(".font-purple-soft").eq(4).html("%/")
        } else if (pl2 > 0) {
            $(".counterSpan").eq(4).attr("data-value", "↑ " + toDecimal2(pl2));
            $(".font-purple-soft").eq(4).html("%/")
        } else {
            /*$(".counterSpan").eq(4).attr("data-value","0");
            $(".font-purple-soft").eq(4).html("%/")*/

            if (pl22 < 0 && pl2 == 0) {
                $(".counterSpan").eq(4).attr("data-value", "↓ <0.01");
                $(".font-purple-soft").eq(4).html("%/")
            } else if (pl22 > 0 && pl2 == 0) {
                $(".counterSpan").eq(4).attr("data-value", "↑ <0.01");
                $(".font-purple-soft").eq(4).html("%/")
            } else {
                $(".counterSpan").eq(4).attr("data-value", "0");
                $(".font-purple-soft").eq(4).html("%/")
            }
        }
    }
    //回访比例比值
    var pl3 = ((visitIp - lastVisitIp) * 100 / lastVisitIp).toFixed(2);
    /*if(isNaN(pl3)){
        pl3 = 0;
    }*/
    var pl33 = visitIp - lastVisitIp;
    if (lastVisitIp == 0 && pl33 == 0) {
        $(".counterSpan").eq(5).attr("data-value", "--");
        $(".font-purple-soft").eq(5).html("")
    } else if (lastVisitIp == 0 && pl33 != 0) {
        $(".counterSpan").eq(5).attr("data-value", "∞");
        $(".font-purple-soft").eq(5).html("")
    } else {
        if (pl3 < 0) {
            $(".counterSpan").eq(5).attr("data-value", "↓ " + toDecimal2(-pl3));
            $(".font-purple-soft").eq(5).html("%")
        } else if (pl3 > 0) {
            $(".counterSpan").eq(5).attr("data-value", "↑ " + toDecimal2(pl3));
            $(".font-purple-soft").eq(5).html("%")
        } else {
            /*  $(".counterSpan").eq(5).attr("data-value","0");
                $(".font-purple-soft").eq(5).html("%")*/

            if (pl33 < 0 && pl3 == 0) {
                $(".counterSpan").eq(5).attr("data-value", "↓ <0.01");
                $(".font-purple-soft").eq(5).html("%")
            } else if (pl33 > 0 && pl3 == 0) {
                $(".counterSpan").eq(5).attr("data-value", "↑ <0.01");
                $(".font-purple-soft").eq(5).html("%")
            } else {
                $(".counterSpan").eq(5).attr("data-value", "0");
                $(".font-purple-soft").eq(5).html("%")
            }
        }
    }

    //counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 1000 // the speed time in ms
    });
}
