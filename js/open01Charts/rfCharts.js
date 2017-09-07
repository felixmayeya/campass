function rfBtn(chart, smChart) {
    pageName = "REFERRER";
    btnUrl = "/api/referrer.open";
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    chartType = "vBar";
    chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TrafficS, Dynamic.analysis_pageViewNum];
    var rfStartTime;
    var rfEndTime;

    var paginationArr = Dynamic.analysis_rf_paginationArr;

    localStorage.setItem("CHART_DATA", '')

    if (swiper) {
        swiper.destroy(false)
    }
    swiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-4 col-xs-4">' + paginationArr[index] + '</li>'
        },
        onSlideChangeStart: function(swiper) {
            var currentChartTime = startTime + "|" + endTime
            if (swiper.activeIndex == 0 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart = new chart.Chart($(".echarts_vBar"), {
                    type: 'hbarplot',
                    title: Dynamic.homeCharts_title27
                })

                chartObj[0] = [vBarChart];
                vBarChart.showLoading();

                var smCharts0 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,
                })
                smChartArr[0] = smCharts0;

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
                        smCharts: smCharts0
                    })
                }
            } else if (swiper.activeIndex == 1 && chartTime[swiper.activeIndex] != currentChartTime) {
                var treeChart = new chart.Chart($(".echarts_area"), {
                    type: 'treeplot',
                    title: Dynamic.homeCharts_title26
                })
                chartObj[1] = [treeChart];
                treeChart.showLoading();

                var smCharts1 = new smChart.SmChart($(".smCharts-" + swiper.activeIndex), {
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime,
                    btnUrl: btnUrl,
                    pageName: pageName,
                    interval: interval,
                })
                smChartArr[1] = smCharts1;

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
                        smCharts: smCharts1
                    })
                }
            }
        }
    });

    if (skipSwiper == 0) {
        //AJAX与echarts插件引用
        var vBarChart = new chart.Chart($(".echarts_vBar"), {
            type: 'hbarplot',
            title: Dynamic.homeCharts_title27,
            clickable: false
        })
        chartObj[0] = [vBarChart];
        vBarChart.showLoading()

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
            rpType: "hbarplot",
            isLoadSmallCharts: false,
            chart: [vBarChart],
            setLocalStorage: true,
            smCharts: smCharts0
        })
    }

    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
    skipPage = "";
}

function rfRefresh(data) {
    //  数据1： 直接访问（计算referrer为“-”的∑pv）
    //  数据2： 直接访问占比（∑pv“-”/总∑pv计入统计的  x 100% ）
    //  数据3： 非直接访问（计算referrer不为“-”的∑pv）
    //  数据4： 非直接访问占比（∑pv非“-”/总∑pv计入统计的 x 100%）
    var dNum = data.dNum;
    var indNum = data.indNum;
    var allNum = data.allNum;
    if (allNum == 0) {
        $(".counterSpan").eq(0).attr("data-value", "0");
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".counterSpan").eq(2).attr("data-value", "0");
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
        $(".font-purple-soft").eq(4).html("")
    } else {
        // 页面1
        $(".counterSpan").eq(0).attr("data-value", dNum);
        // 页面2
        var pl1 = ((dNum / allNum) * 100).toFixed(2);
        if (pl1 == 0) {
            $(".counterSpan").eq(1).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(1).attr("data-value", toDecimal2(pl1));
        }
        // 页面3
        $(".counterSpan").eq(2).attr("data-value", indNum);
        // 页面4
        var pl3 = 100 - pl1;
        if (pl3 == 0) {
            $(".counterSpan").eq(3).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(3).attr("data-value", toDecimal2(pl3));
        }
        $(".font-red-haze").eq(1).html("%")
        $(".font-purple-soft").eq(4).html("%")
    }
    // counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 1000
            // the speed time in ms
    });
}
