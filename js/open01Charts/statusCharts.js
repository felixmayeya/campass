//STATUS
function statusBtn(chart, smChart) {
    pageName = "STATUS";
    btnUrl = '/api/status.open';
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartObj = []; //小图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    swiperIndex = 0;
    statusArr = [];

    var paginationArr = Dynamic.analysis_status_paginationArr;
    if (swiper) {
        swiper.destroy(false)
    }
    swiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        onSlideChangeStart: function(swiper) {
            // var tempObj = checkDateType(startTime, endTime, _interval)
            var currentChartTime = startTime + "|" + endTime
            if (swiper.activeIndex == 0 && chartTime[swiper.activeIndex] != currentChartTime) {
                //创建chart对象
                var barChart = new chart.Chart($(".echarts_bar1"), {
                    type: 'barplot',
                    title: Dynamic.homeCharts_title13,
                    clickable: false,
                    toolboxType: 'basic'
                })
                chartObj[0] = [barChart];
                barChart.showLoading();

                // 创建画小图对象
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
                    rpType: "statusBar1",
                    isLoadSmallCharts: false,
                    chart: [barChart],
                    smCharts: smCharts0
                })
            } else if (swiper.activeIndex == 1 && chartTime[swiper.activeIndex] != currentChartTime) {
                //创建chart对象
                var lineChart2 = new chart.Chart($(".echarts_bar2"), {
                    type: 'lineSelection',
                    title: Dynamic.homeCharts_title14
                })
                chartObj[1] = [lineChart2];
                lineChart2.showLoading();

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
                    rpType: "statusBar2",
                    isLoadSmallCharts: false,
                    chart: [lineChart2],
                    smCharts: smCharts1
                })
            } else if (swiper.activeIndex == 2 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart2 = new chart.Chart($(".echarts_vBar2"), {
                    type: 'hbarSelection',
                    title: Dynamic.homeCharts_title15
                })
                var lBarChart2 = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: 'false'
                })
                chartObj[2] = [vBarChart2];
                smChartObj[2] = [lBarChart2];
                vBarChart2.showLoading();

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
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "statusVbar1",
                    isLoadSmallCharts: false,
                    chart: [vBarChart2],
                    smCharts: smCharts2
                })
            } else if (swiper.activeIndex == 3 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart3 = new chart.Chart($(".echarts_vBar3"), {
                    type: 'hbarSelection',
                    title: Dynamic.homeCharts_title16
                })
                var lBarChart3 = new chart.Chart($(".echarts_lBar3"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: 'false'
                })
                chartObj[3] = [vBarChart3];
                smChartObj[3] = [lBarChart3];
                vBarChart3.showLoading();

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
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "statusVbar2",
                    isLoadSmallCharts: false,
                    chart: [vBarChart3],
                    smCharts: smCharts3
                })
            }
            if (swiper.activeIndex == 0) {
                chartType = "bar1";
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_status, Dynamic.analysis_Frequency];
            } else if (swiper.activeIndex == 1) {
                chartType = "bar2";
                chartTxt = [Dynamic.analysis_status, Dynamic.analysis_TimeStrp, Dynamic.analysis_Frequency]
            } else if (swiper.activeIndex == 2) {
                chartType = "vBar1";
                chartTxt = [Dynamic.analysis_status, "URL", Dynamic.analysis_Frequency]
            } else if (swiper.activeIndex == 3) {
                chartType = "vBar2"
                chartTxt = [Dynamic.analysis_status, "IP", Dynamic.analysis_Frequency];
            }
        },
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-3 col-xs-3">' + paginationArr[index] + '</li>'
        }
    });

    if (skipSwiper == 0) {
        chartType = "bar1";
        chartTxt = [Dynamic.analysis_step, Dynamic.analysis_status, Dynamic.analysis_Frequency];
        swiperIndex = 0;

        //创建chart对象
        var barChart = new chart.Chart($(".echarts_bar1"), {
            type: 'barplot',
            title: Dynamic.homeCharts_title13,
            clickable: false,
            toolboxType: 'basic'
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
            startTime: startTime,
            endTime: endTime,
            url: btnUrl,
            datetype: _interval,
            rpType: "statusBar1",
            isLoadSmallCharts: false,
            chart: [barChart],
            smCharts: smCharts0
        })
    }
    //首页点击跳转到相应图表
    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
    skipPage = "";
}

function statusRefresh(data) {
    var num2 = data.num2;
    var num3 = data.num3;
    var num4 = data.num4;
    var num56 = data.num56;
    var allNum = data.allNum;
    if (allNum == 0) {
        $(".counterSpan").eq(0).attr("data-value", "--");
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".counterSpan").eq(2).attr("data-value", "--");
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-green-sharp").eq(1).html("")
        $(".font-red-haze").eq(1).html("")
        $(".font-blue-sharp").eq(1).html("")
        $(".font-purple-soft").eq(4).html("")
    } else {
        $(".font-green-sharp").eq(1).html("%")
        $(".font-red-haze").eq(1).html("%")
        $(".font-blue-sharp").eq(1).html("%")
        $(".font-purple-soft").eq(4).html("%")
            // 页面1
        var pl1 = ((num2 / allNum) * 100).toFixed(2);
        /*if(pl1 == 0){
            $(".counterSpan").eq(0).attr("data-value", "0");
        }else{
            $(".counterSpan").eq(0).attr("data-value", toDecimal2(pl1));
        }*/

        if (pl1 == 0 && num2 != 0) {
            $(".counterSpan").eq(0).attr("data-value", "<0.01");
        } else if (pl1 == 0 && num2 == 0) {
            $(".counterSpan").eq(0).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(0).attr("data-value", toDecimal2(pl1));
        }
        // 页面1
        var pl2 = ((num3 / allNum) * 100).toFixed(2);
        /*if(pl2 == 0){
            $(".counterSpan").eq(1).attr("data-value", "0");
        }else{
            $(".counterSpan").eq(1).attr("data-value", toDecimal2(pl2));    
        }*/

        if (pl2 == 0 && num3 != 0) {
            $(".counterSpan").eq(1).attr("data-value", "<0.01");
        } else if (pl2 == 0 && num3 == 0) {
            $(".counterSpan").eq(1).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(1).attr("data-value", toDecimal2(pl2));
        }
        // 页面1
        var pl3 = ((num4 / allNum) * 100).toFixed(2);
        /*if(pl3 == 0){
            $(".counterSpan").eq(2).attr("data-value", "0");
        }else{
            $(".counterSpan").eq(2).attr("data-value", toDecimal2(pl3));    
        }*/
        if (pl3 == 0 && num4 != 0) {
            $(".counterSpan").eq(2).attr("data-value", "<0.01");
        } else if (pl3 == 0 && num4 == 0) {
            $(".counterSpan").eq(2).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(2).attr("data-value", toDecimal2(pl3));
        }
        // 页面1
        var pl4 = ((num56 / allNum) * 100).toFixed(2);
        /*if(pl4 == 0){
            $(".counterSpan").eq(3).attr("data-value", "0");
        }else{
            $(".counterSpan").eq(3).attr("data-value", toDecimal2(pl4));
        }*/
        if (pl4 == 0 && num56 != 0) {
            $(".counterSpan").eq(3).attr("data-value", "<0.01");
        } else if (pl4 == 0 && num56 == 0) {
            $(".counterSpan").eq(3).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(3).attr("data-value", toDecimal2(pl4));
        }
    }
    // counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 1000
            // the speed time in ms
    });
}
