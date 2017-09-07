function reqBtn(chart, smChart) {
    pageName = "REQUEST";
    btnUrl = "/api/requestType.open";
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartArr = [];

    moreDateMark = 0;
    chartType = "vBar";
    chartTxt = [Dynamic.analysis_step, Dynamic.analysis_Requesttype, Dynamic.analysis_RequsetFrequency];

    localStorage.setItem("CHART_DATA", '')

    var paginationArr = Dynamic.analysis_request_paginationArr;
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
                    title: Dynamic.homeCharts_title23
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
                    title: Dynamic.homeCharts_title22
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
        vBarChart = new chart.Chart($(".echarts_vBar"), {
            type: 'hbarplot',
            title: Dynamic.homeCharts_title23,
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
            smCharts: smCharts0
        })
    }
    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
    skipPage = "";
}

function requestRefresh(data) {
    //  数据1：异常请求次数（∑PV非get和post）
    //  数据2：占比（∑PV非get和post/总∑PV）
    //  数据3：No.1异常请求类型（显示类型名）： 占比（计算方法：看非get/post请求类型中，哪个类型的∑PV做多，∑PV该类型/总∑PV x 100%）
    //  数据4：No.2 异常请求类型（显示类型名）：占比（计算方法：找出第二多的请求类型，计算方法同上）


    var abnormalNo1 = data.abnormalNo1;
    var abnormalName1 = data.abnormalName1;
    var abnormalNo2 = data.abnormalNo2;
    var abnormalName2 = data.abnormalName2;
    var abnormalAll = data.abnormalAll;
    var allNum = data.allNum;
    // 页面1
    $(".counterSpan").eq(0).attr("data-value", abnormalAll);

    var pl1 = ((abnormalAll / allNum) * 100).toFixed(2);
    /*if(isNaN(pl1)){
        pl1 = 0;
    }*/
    if (allNum == 0 && abnormalAll == 0) {
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
    } else if (allNum == 0 && abnormalAll != 0) {
        $(".counterSpan").eq(1).attr("data-value", "∞");
        $(".font-red-haze").eq(1).html("")

    } else {
        // 页面2
        if (pl1 == 0) {
            $(".counterSpan").eq(1).attr("data-value", "0");
        } else {
            $(".counterSpan").eq(1).attr("data-value", toDecimal2(pl1));
        }
        $(".font-red-haze").eq(1).html("%")
    }

    // 页面3
    var pl2 = ((abnormalNo1 / allNum) * 100).toFixed(2);
    /*if(isNaN(pl2)){
        pl2 = 0;
    }*/
    if (allNum == 0 && abnormalNo1 == 0) {
        $(".counterSpan").eq(2).attr("data-value", "--");
        $(".number:eq(2) small").eq(1).html("")
    } else if (allNum == 0 && abnormalNo1 != 0) {
        $(".counterSpan").eq(2).attr("data-value", "∞");
        $(".number:eq(2) small").eq(1).html("")
    } else {
        // 页面3
        /*if(pl2 == 0){
            $(".counterSpan").eq(2).attr("data-value", "--");
            $(".number:eq(2) small").eq(1).html("")
        }else{
            $(".counterSpan").eq(2).attr("data-value", abnormalName1);  
            $(".number:eq(2) small").eq(1).html("占比: "+toDecimal2(pl2)+"%")
        }*/
        if (pl2 == 0 && abnormalNo1 != 0) {
            $(".counterSpan").eq(2).attr("data-value", abnormalName2);
            $(".number:eq(2) small").eq(1).html(Dynamic.analysis_percent + ":<0.01%")
        } else if (pl2 == 0 && abnormalNo1 == 0) {
            $(".counterSpan").eq(2).attr("data-value", "--");
            $(".number:eq(2) small").eq(1).html("")
        } else {
            $(".counterSpan").eq(2).attr("data-value", abnormalName1);
            $(".number:eq(2) small").eq(1).html(Dynamic.analysis_percent + ": " + toDecimal2(pl2) + "%")
        }
    }

    // 页面4
    var pl3 = ((abnormalNo2 / allNum) * 100).toFixed(2);
    /*if(isNaN(pl3)){
        pl3 = 0;
    }*/
    if (allNum == 0 && abnormalNo2 == 0) {
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-purple-soft").eq(4).html("")
    } else if (allNum == 0 && abnormalNo2 != 0) {
        $(".counterSpan").eq(3).attr("data-value", "∞");
        $(".font-purple-soft").eq(4).html("")
    } else {
        // 页面4
        /*if(pl3 == 0){
            $(".counterSpan").eq(3).attr("data-value", "--");
            $(".number:eq(3) small").eq(1).html("")
        }else{
            $(".counterSpan").eq(3).attr("data-value", abnormalName2);  
            $(".number:eq(3) small").eq(1).html("占比: "+toDecimal2(pl3)+"%")
        }   */
        if (pl3 == 0 && abnormalNo2 != 0) {
            $(".counterSpan").eq(3).attr("data-value", abnormalName2);
            $(".number:eq(3) small").eq(1).html(Dynamic.analysis_percent + ":<0.01%")
        } else if (pl3 == 0 && abnormalNo2 == 0) {
            $(".counterSpan").eq(3).attr("data-value", "--");
            $(".number:eq(3) small").eq(1).html("")
        } else {
            $(".counterSpan").eq(3).attr("data-value", abnormalName2);
            $(".number:eq(3) small").eq(1).html(Dynamic.analysis_percent + ": " + toDecimal2(pl3) + "%")
        }
        //$(".font-purple-soft").eq(4).html("%")
    }
    // counterup
    $(".counterSpan").counterUp({
        delay: 10, // the delay time in ms
        time: 1000
            // the speed time in ms
    });
}
