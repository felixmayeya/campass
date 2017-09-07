function tpBtn(chart, smChart) {
    pageName = "TP";
    btnUrl = "/api/staytime.open";
    dataTableObj = []; //datatable对象数组
    chartTime = []; //当前图表时间数组
    chartObj = []; //图表对象数组
    smChartArr = [];

    moreDateMark = 0;

    chartType = "vBar";
    chartTxt = [Dynamic.analysis_step, "URL", Dynamic.analysis_Timeonpath];

    localStorage.setItem("CHART_DATA", '')

    //swiper插件配置与初始化
    var paginationArr = Dynamic.analysis_tp_paginationArr;
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
                    title: Dynamic.homeCharts_title25
                })

                chartObj[0] = [vBarChart];
                vBarChart.showLoading();

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
                    title: Dynamic.homeCharts_title24
                })
                chartObj[1] = [treeChart];
                treeChart.showLoading();

                // 创建画小图对象
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
            title: Dynamic.homeCharts_title25,
            clickable: false
        })
        chartObj[0] = [vBarChart];
        vBarChart.showLoading()

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
            rpType: "hbarplot",
            isLoadSmallCharts: false,
            chart: [vBarChart],
            setLocalStorage: true,
            smCharts: smCharts0
        })
    }

    swiper.slideTo(skipSwiper);
    skipSwiper = 0;
}


function tpRefresh(data) {
    var allIpCount = data.allIpCount;
    var lastAllIpCount = data.lastAllIpCount;
    var allNum = data.allNum;
    var lastAllNum = data.lastAllNum;
    var pvNum = data.pvNum;
    var lastPvNum = data.lastPvNum;
    //次均访问停留时长
    var pl1 = (allNum / pvNum).toFixed(2)
        /*if(isNaN(pl1)){
            pl1 = 0;
        }*/
    var pl11 = allNum;
    if (pvNum == 0 && pl11 == 0) {
        $(".counterSpan").eq(0).attr("data-value", "--");
        $(".font-green-sharp").eq(1).html("")
    } else if (pvNum == 0 && pl11 != 0) {
        $(".counterSpan").eq(0).attr("data-value", "∞");
        $(".font-green-sharp").eq(1).html("")
    } else {
        if (pl1 < 0) {
            $(".counterSpan").eq(0).attr("data-value", toDecimal2(-pl1));
        } else if (pl1 > 0) {
            $(".counterSpan").eq(0).attr("data-value", toDecimal2(pl1));
        } else {
            $(".counterSpan").eq(0).attr("data-value", "0");
        }
        $(".font-green-sharp").eq(1).html(Dynamic.analysis_tp_secTimes)
    }
    //次均访问停留时长环比变化
    //((∑pv上x ∑tp本)/(∑pv本x∑tp上)-1) x 100%
    //var pl2 = ((allNum*lastPvNum-lastAllNum*pvNum)/(pvNum*lastAllNum)).toFixed(2)
    var pl2 = (((lastPvNum * allNum) / (pvNum * lastAllNum) - 1) * 100).toFixed(2);
    //var pl22 = (((lastPvNum*allNum)/(pvNum*lastAllNum)-1)*100);
    /*if(isNaN(pl2)){
        pl2 = 0;
    }*/
    var pl21 = lastPvNum * allNum - pvNum * lastAllNum;
    var pl22 = pvNum * lastAllNum;
    if (pl22 == 0 && pl21 == 0) {
        $(".counterSpan").eq(1).attr("data-value", "--");
        $(".font-red-haze").eq(1).html("")
    } else if (pl22 == 0 && pl21 != 0) {
        $(".counterSpan").eq(1).attr("data-value", "∞");
        $(".font-red-haze").eq(1).html("")
    } else {
        if (pl2 < 0) {
            $(".counterSpan").eq(1).attr("data-value", "↓ " + toDecimal2(-pl2));
        } else if (pl2 > 0) {
            $(".counterSpan").eq(1).attr("data-value", "↑ " + toDecimal2(pl2));
        } else {
            /*$(".counterSpan").eq(1).attr("data-value","0");*/
            if (pl22 < 0 && pl2 == 0) {
                $(".counterSpan").eq(1).attr("data-value", "↓ <0.01");
            } else if (pl22 > 0 && pl2 == 0) {
                $(".counterSpan").eq(1).attr("data-value", "↑ <0.01");
            } else {
                $(".counterSpan").eq(1).attr("data-value", "0");
            }
        }
        $(".font-red-haze").eq(1).html("%")
    }
    //人均访问停留时长
    var pl3 = (allNum / allIpCount).toFixed(2)
        /*if(isNaN(pl3)){
            pl3 = 0;
        }*/
    if (allIpCount == 0 && allNum == 0) {
        $(".counterSpan").eq(2).attr("data-value", "--");
        $(".font-blue-sharp").eq(1).html("")
    } else if (allIpCount == 0 && allNum != 0) {
        $(".counterSpan").eq(2).attr("data-value", "∞");
        $(".font-blue-sharp").eq(1).html("")
    } else {
        if (pl3 < 0) {
            $(".counterSpan").eq(2).attr("data-value", toDecimal2(-pl3));
        } else if (pl1 > 0) {
            $(".counterSpan").eq(2).attr("data-value", toDecimal2(pl3));
        } else {
            $(".counterSpan").eq(2).attr("data-value", "0");
        }
        $(".font-blue-sharp").eq(1).html(Dynamic.analysis_tp_secIp)
    }
    //人均访问停留时长环比变化
    //var pl4 = ((allNum*lastAllIpCount-lastAllNum*allIpCount)/(allIpCount*lastAllNum)).toFixed(2)
    //((∑IP上x ∑tp本)/(∑IP本x∑tp上)-1) x 100%
    var pl4 = (((allNum * lastAllIpCount) / (lastAllNum * allIpCount) - 1) * 100).toFixed(2)
        /*var pl44 = (((allNum*lastAllIpCount)/(lastAllNum*allIpCount)-1)*100)
        if(isNaN(pl4)){
            pl4 = 0;
        }*/
    var pl41 = allNum * lastAllIpCount - lastAllNum * allIpCount;
    var pl42 = lastAllNum * allIpCount;
    if (pl42 == 0 && pl41 == 0) {
        $(".counterSpan").eq(3).attr("data-value", "--");
        $(".font-purple-soft").eq(4).html("")
    } else if (pl42 == 0 && pl41 != 0) {
        $(".counterSpan").eq(3).attr("data-value", "∞");
        $(".font-purple-soft").eq(4).html("")
    } else {
        if (pl4 < 0) {
            $(".counterSpan").eq(3).attr("data-value", "↓ " + toDecimal2(-pl4));
        } else if (pl4 > 0) {
            $(".counterSpan").eq(3).attr("data-value", "↑ " + toDecimal2(pl4));
        } else {
            /*$(".counterSpan").eq(3).attr("data-value","0");*/

            if (pl42 < 0 && pl4 == 0) {
                $(".counterSpan").eq(3).attr("data-value", "↓ <0.01");
            } else if (pl42 > 0 && pl4 == 0) {
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
        time: 1000 // the speed time in ms
    });
}
