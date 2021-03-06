//crawler
function crawlerBtn(chart, smChart) {
    pageName = "CRAWLER";
    btnUrl = '/api/crawler.open';
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartObj = []; //小图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    swiperIndex = 0;
    //swiper插件配置与初始化
    var paginationArr = Dynamic.analysis_crawler_paginationArr
    if (swiper) {
        swiper.destroy(false)
    }
    swiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        onSlideChangeStart: function(swiper) {
            var chartStartTime = startTime,
                chartEndTime = endTime;
            if (localStorage.getItem("LINK_STATUS") === "0") {
                chartStartTime = '201604260000';
                chartEndTime = '201604270000';
                if (localStorage.getItem("ANALYSIS_LABLE") == "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") == "Custom Range") {
                    smChartsBuild(swiper.activeIndex, true);
                }
            }
            var currentChartTime = startTime + "|" + endTime
            if (swiper.activeIndex == 0 && chartTime[swiper.activeIndex] != currentChartTime) {
                var barChart = new chart.Chart($(".echarts_bar1"), {
                    type: 'barplotStack',
                    title: Dynamic.homeCharts_title28,
                    clickable: false
                })
                chartObj[0] = [barChart];
                barChart.showLoading();

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
                    startTime: chartStartTime,
                    endTime: chartEndTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "fBar",
                    chart: [barChart],
                    smCharts: smCharts0
                })
            } else if (swiper.activeIndex == 1 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart = new chart.Chart($(".echarts_vBar1"), {
                    type: 'hbarplot',
                    title: Dynamic.homeCharts_title29
                })
                var lBarChart = new chart.Chart($(".echarts_lBar1"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: false
                })
                chartObj[1] = [vBarChart];
                smChartObj[1] = [lBarChart]
                vBarChart.showLoading();

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
                    startTime: chartStartTime,
                    endTime: chartEndTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "ipBar",
                    chart: [vBarChart],
                    smCharts: smCharts1
                })
            } else if (swiper.activeIndex == 2 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart = new chart.Chart($(".echarts_vBar2"), {
                    type: 'hbarplot',
                    title: Dynamic.homeCharts_title30
                })
                var lBarChart = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: false
                })
                chartObj[2] = [vBarChart];
                smChartObj[2] = [lBarChart]
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

                getChartData({
                    projectID: projectID,
                    startTime: chartStartTime,
                    endTime: chartEndTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "urlBar",
                    chart: [vBarChart],
                    smCharts: smCharts2
                })
            } else if (swiper.activeIndex == 3 && chartTime[swiper.activeIndex] != currentChartTime) {
                var barChart2 = new chart.Chart($(".echarts_bar2"), {
                    type: 'barplotStack',
                    title: Dynamic.homeCharts_title31,
                    defaultColor: ['rgba(247,186,148,1)', 'rgba(90,184,222,1)', 'rgba(94, 115, 139, 1)'],
                    colorTrans: ['rgba(247,186,148,0.2)', 'rgba(90,184,222,0.2)', 'rgba(94, 115, 139, 0.2)']
                })
                chartObj[3] = [barChart2];
                barChart2.showLoading();

                var smCharts3 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,
                })
                smChartArr[3] = smCharts3;

                getChartData({
                    projectID: projectID,
                    startTime: chartStartTime,
                    endTime: chartEndTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "statusBar",
                    chart: [barChart2],
                    smCharts: smCharts3
                })
            }

            if (swiper.activeIndex == 0) {
                chartType = "fBar";
                chartTxt = [Dynamic.analysis_step,
                    Dynamic.analysis_TimeStrp,
                    Dynamic.analysis_crawler_PvNum,
                    Dynamic.analysis_crawler_crawlerNum,
                    Dynamic.analysis_crawler_CrawlerPvPercent,
                    Dynamic.analysis_crawler_notCrawler,
                    Dynamic.analysis_crawler_unCrawlerPvPercent
                ];
            } else if (swiper.activeIndex == 1) {
                chartType = "ipBar";
                chartTxt = [Dynamic.analysis_step,
                    Dynamic.analysis_crawler_CrawlerIp,
                    Dynamic.analysis_pageViewNum
                ];
            } else if (swiper.activeIndex == 2) {
                chartType = "urlBar";
                chartTxt = [Dynamic.analysis_step,
                    Dynamic.analysis_step,
                    Dynamic.analysis_crawler_crawlerNum
                ];
            } else if (swiper.activeIndex == 3) {
                chartType = "statusBar";
                chartTxt = [Dynamic.analysis_step,
                    Dynamic.analysis_TimeStrp,
                    Dynamic.analysis_crawler_status1_1,
                    Dynamic.analysis_crawler_crawlerSucPercent,
                    Dynamic.analysis_crawler_status2_1,
                    Dynamic.analysis_crawler_crawlerRedPercent,
                    Dynamic.analysis_crawler_status3_1,
                    Dynamic.analysis_crawler_crawlerFailPercent
                ];
            }
        },
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-3 col-xs-3">' + paginationArr[index] + '</li>'
        }
    });

    if (skipSwiper == 0) {
        chartType = "fBar";
        chartTxt = [Dynamic.analysis_step,
            Dynamic.analysis_TimeStrp,
            Dynamic.analysis_crawler_PvNum,
            Dynamic.analysis_crawler_crawlerNum,
            Dynamic.analysis_crawler_CrawlerPvPercent,
            Dynamic.analysis_crawler_notCrawler,
            Dynamic.analysis_crawler_unCrawlerPvPercent
        ];
        var chartStartTime = startTime,
            chartEndTime = endTime;
        if (localStorage.getItem("LINK_STATUS") === "0") {
            chartStartTime = '201604260000';
            chartEndTime = '201604270000';
            if (localStorage.getItem("ANALYSIS_LABLE") == "自定义日期" || localStorage.getItem("ANALYSIS_LABLE") == "Custom Range") {
                smChartsBuild(swiper.activeIndex, true);
            }
        }

        var barChart = new chart.Chart($(".echarts_bar1"), {
            type: 'barplotStack',
            title: Dynamic.homeCharts_title28,
            clickable: false
        })
        chartObj[0] = [barChart];
        barChart.showLoading();

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
            startTime: chartStartTime,
            endTime: chartEndTime,
            url: btnUrl,
            datetype: _interval,
            rpType: "fBar",
            chart: [barChart],
            smCharts: smCharts0
        })
    }
    //首页点击跳转到相应图表
    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
    //dataTable初始化
}

function crawlerRefresh(data) {
    console.log(data)
    var crawlerPvNum = data.crawlerPvNum
    var lastCrawlerPvNum = data.lastCrawlerPvNum

    var crawlerIpNum = data.crawlerIpNum
    var lastCrawlerIpNum = data.lastCrawlerIpNum
        //爬取总量
    $(".counterSpan").eq(0).attr("data-value", crawlerPvNum);
    //爬取总量环比变化
    var pvNumBt = (crawlerPvNum - lastCrawlerPvNum) * 100;
    var pl1 = (pvNumBt / lastCrawlerPvNum).toFixed(2);
    var pl11 = crawlerPvNum - lastCrawlerPvNum;
    if (lastCrawlerPvNum == 0 && pvNumBt == 0) {
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
    } else if (lastCrawlerPvNum == 0 && pvNumBt != 0) {
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

    //爬取源IP总量
    $(".counterSpan").eq(2).attr("data-value", crawlerIpNum);
    //爬取源IP总量环比变化
    var ipNumBt = (crawlerIpNum - lastCrawlerIpNum) * 100;
    var pl2 = (ipNumBt / lastCrawlerIpNum).toFixed(2);
    var pl22 = ipNumBt / lastCrawlerIpNum;
    if (lastCrawlerIpNum == 0 && ipNumBt == 0) {
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-purple-soft").eq(4).html("")
    } else if (lastCrawlerIpNum == 0 && ipNumBt != 0) {
        $(".counterSpan").eq(3).attr("data-value", "∞");
        $(".font-purple-soft").eq(4).html("")
    } else {
        if (pl2 < 0) {
            $(".counterSpan").eq(3).attr("data-value", "↓ " + toDecimal2(-pl2));
        } else if (pl2 > 0) {
            $(".counterSpan").eq(3).attr("data-value", "↑ " + toDecimal2(pl2));
        } else {
            if (pl22 < 0 && pl22 == 0) {
                $(".counterSpan").eq(3).attr("data-value", "↓ <0.01");
            } else if (pl22 > 0 && pl22 == 0) {
                $(".counterSpan").eq(3).attr("data-value", "↑ <0.01");
            } else {
                $(".counterSpan").eq(3).attr("data-value", "0");
            }
        }
        $(".font-purple-soft").eq(4).html("%")
    }
    //counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 300 // the speed time in ms
    });
}
