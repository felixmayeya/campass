function osBtn(chart, smChart) {
    pageName = "OS";
    btnUrl = "/api/os.open";
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    chartType = "vBar";
    chartTxt = [Dynamic.analysis_step, Dynamic.analysis_os, Dynamic.analysis_ViewNum];

    localStorage.setItem("CHART_DATA", '')

    var paginationArr = Dynamic.analysis_os_paginationArr
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
                    title: Dynamic.homeCharts_title21
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
                    title: Dynamic.homeCharts_title20
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

    //AJAX与echarts插件引用
    if (skipSwiper == 0) {
        var vBarChart = new chart.Chart($(".echarts_vBar"), {
            type: 'hbarplot',
            title: Dynamic.homeCharts_title21,
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

function osRefresh(data) {
    //  数据1： No.1常用操作系统：XXX（显示操作系统名字）
    //  数据2： （∑IP特定os/总∑IP x 100%）的用户在使用该操作系统
    //  数据3： No.2常用操作系统：XXX（显示操作系统名字）
    //  数据4： （∑IP特定os/总∑IP x 100%）的用户在使用该操作系统
    //  var allIpCount = data.allIpCount;
    var allPvCount = data.allPvCount;
    var No1 = data.No1;
    var No1Name = data.No1Name;
    var No2 = data.No2;
    var No2Name = data.No2Name;


    var usefulNum = 0;
    var data = data.dataList[0].data;
    for (var i = 0; i < data.length; i++) {
        usefulNum += data[i].value;
    }
    $(".infoCount_1").html(usefulNum)
    if (isNaN(ForDight((usefulNum / allPvCount) * 100, 2))) {
        $(".infoCount_2").html(0)
    } else {
        $(".infoCount_2").html(ForDight((usefulNum / allPvCount) * 100, 2))
    }


    if (allPvCount == 0) {
        $(".counterSpan").eq(0).attr("data-value", "--");
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".counterSpan").eq(2).attr("data-value", "--");
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
        $(".font-purple-soft").eq(4).html("")
    } else {
        // 页面1
        $(".counterSpan").eq(0).attr("data-value", No1Name);
        // 页面2
        var pl1 = ((No1 / allPvCount) * 100).toFixed(2);
        /*if(pl1 == 0){
            $(".counterSpan").eq(1).attr("data-value", "0");
        }else{
            $(".counterSpan").eq(1).attr("data-value", toDecimal2(pl1));    
        }*/


        if (pl1 == 0 && No1 != 0) {
            $(".counterSpan").eq(1).attr("data-value", "<0.01");
        } else if (pl1 == 0 && No1 == 0) {
            $(".counterSpan").eq(1).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(1).attr("data-value", toDecimal2(pl1));
        }
        // 页面3
        $(".counterSpan").eq(2).attr("data-value", No2Name);
        // 页面4
        var pl3 = ((No2 / allPvCount) * 100).toFixed(2);
        /*if(pl3 == 0){
            $(".counterSpan").eq(3).attr("data-value", "0");
        }else{
            $(".counterSpan").eq(3).attr("data-value", toDecimal2(pl3));
        }*/

        if (pl3 == 0 && No2 != 0) {
            $(".counterSpan").eq(3).attr("data-value", "<0.01");
        } else if (pl3 == 0 && No2 == 0) {
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
