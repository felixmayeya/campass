//DATA
function dataBtn(chart, smChart) {
    pageName = "DATA";
    btnUrl = '/api/datacount.open';
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartObj = []; //小图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    var dataStartTime;
    var dataEndTime;

    var paginationArr = Dynamic.analysis_data_paginationArr
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
                    title: Dynamic.homeCharts_title9
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
                    isLoadSmallCharts: false,
                    chart: [lineChart],
                    smCharts: smCharts0
                })
            } else if (swiper.activeIndex == 1 && chartTime[swiper.activeIndex] != currentChartTime) {
                var mapChart = new chart.Chart($(".echarts_map"), {
                    type: 'mapplot',
                    title: Dynamic.homeCharts_title10,
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
                    isLoadSmallCharts: false,
                    chart: [mapChart],
                    mapType: homeSkipMapType || mapType,
                    smCharts: smCharts1
                })
                controlMapType = homeSkipMapType || mapType;
                homeSkipMapType = false;
            } else if (swiper.activeIndex == 2 && chartTime[swiper.activeIndex] != currentChartTime) {
                var vBarChart = new chart.Chart($(".echarts_vBar2"), {
                    type: 'hbarplot',
                    title: Dynamic.homeCharts_title11
                })
                var lBarChart = new chart.Chart($(".echarts_lBar2"), {
                    type: 'barplot',
                    toolboxType: 'close',
                    clickable: false
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

                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "hbarplot",
                    isLoadSmallCharts: false,
                    chart: [vBarChart],
                    smCharts: smCharts2
                })
            } else if (swiper.activeIndex == 3 && chartTime[swiper.activeIndex] != currentChartTime) {
                var treeChart = new chart.Chart($(".echarts_area"), {
                    type: 'treeplot',
                    title: Dynamic.homeCharts_title12
                })
                chartObj[3] = [treeChart];
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

                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    datetype: _interval,
                    rpType: "treemap",
                    isLoadSmallCharts: false,
                    chart: [treeChart],
                    smCharts: smCharts3
                })
            }
            if (swiper.activeIndex == 0) {
                chartType = "line";
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TimeStrp, Dynamic.analysis_RequestDataTransfer];
            } else if (swiper.activeIndex == 1) {
                chartType = "map";
                chartTxt = [Dynamic.analysis_step, Dynamic.analysis_Addres, Dynamic.analysis_RequestDataTransfer];
            } else if (swiper.activeIndex == 2) {
                chartType = "vBar";
                chartTxt = [Dynamic.analysis_step, "URL", Dynamic.analysis_RequestDataTransfer];
            } else if (swiper.activeIndex == 3) {
                chartType = "area";
                chartTxt = [Dynamic.analysis_step, "IP", Dynamic.analysis_RequestDataTransfer];
            }
        },
        paginationBulletRender: function(index, className) {
            return '<li class="' + className + ' swiperContainer col-md-3 col-xs-3">' + paginationArr[index] + '</li>'
        }
    });

    if (skipSwiper == 0) {
        chartType = "line";
        chartTxt = [Dynamic.analysis_step, Dynamic.analysis_TimeStrp, Dynamic.analysis_RequestDataTransfer];
        swiperIndex = 0;

        var lineChart = new chart.Chart($(".echarts_line"), {
            type: 'areaplot',
            title: Dynamic.homeCharts_title9
        })
        chartObj[swiper.activeIndex] = [lineChart];
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
    }
    //首页点击跳转到相应图表
    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
    skipPage = "";
}

function dataRefresh(data) {
    var maxData = data.maxData; //单次最大请求数据量
    var maxIpData = data.maxIpData; //单Ip
    var thisAllBytes = data.thisAllBytes; //访问请求数据总量
    var thisPvNum = data.thisPvNum; //
    var maxIpName = data.maxIpName; //
    //访问请求数据总量
    $(".counterSpan").eq(0).attr("data-value", thisAllBytes);
    //次均访问请求数据量
    if (thisPvNum != "noNum") {
        $(".counterSpan").eq(1).attr("data-value", thisPvNum);
        $(".font-red-haze").eq(1).html("/" + Dynamic.analysis_Times);
    } else {
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("");
    }
    //单次最大请求数据量
    $(".counterSpan").eq(2).attr("data-value", maxData);
    //平均访问页面数比值
    $(".counterSpan").eq(3).attr("data-value", maxIpData);
    if (maxIpName == undefined) {
        $(".font-purple-soft").eq(5).html("IP: --");
    } else {
        $(".font-purple-soft").eq(5).html("IP: " + maxIpName);
    }
    //counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 1000 // the speed time in ms
    });
}
