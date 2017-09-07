/*
    支持三种图表：折线图，柱状图，散点图
    支持多组数据，每组数据对应一个y轴
    支持多种图表切换（折线图，折线面积图，柱状图，散点图）

    创建chart对象：
    el //渲染图表位置的dom元素
    opt //图表配置对象

    opt配置项：
    chartData //图表数据
    title //图表标题
    type //图表类型 （areaplot，scatterplot，lineplot, mapplot, treeplot, hBarplot, lineSelection, hbarSelection, barplotStack）
    toolboxType //默认不配置，可选：close：toolbox会显示一个关闭按钮 （改配置项只在点击创建新的小图的时候使用）none：不显示toolbox, basic:显示基本的toolbox（还原和保存图片）
    clickable //是否可以点击查看该项的详细数据， 默认为true，关闭为false
    legend //图例开关， 默认为true， 不显示图例为false

    默认参数
    defaultColor 图表颜色（数组）
    colorTrans  图表颜色+透明度
    textColor   字体颜色
    treeColor   树图
*/
define([], function() {
    function Chart(el, opts) {
        var opts = opts || {};
        this.opts = $.extend({}, Chart.DEFAULTS, opts);
        this.$el = $(el);
        this.myChart = echarts.init(this.$el[0]);
        this._bindDom(this.opts.type);
        if (this.opts.chartData) {
            this.option = this._buildOption(this.opts.type, this.opts.chartData)
            this.myChart.setOption(this.option);
        }
    }

    //图表默认属性
    Chart.DEFAULTS = {
        clickable: true, //是否支持点击
        legend: true, //是否显示图例
        showTitle: true,
        //color
        defaultColor: ['rgba(90,184,222,1)', 'rgba(247,186,148,1)', 'rgba(94, 115, 139, 1)'],
        colorTrans: ['rgba(90,184,222,0.2)', 'rgba(247,186,148,0.2)', 'rgba(94, 115, 139, 0.2)'],
        treeColor: ["#ace1ef", "#8ad7ed", "#59c6e5", "#2bb7e0", "#009dcd", "#0089bb", "#0077a8", "#536c7b", "#00628b"],
        textColor: '#99999',
        loadingObj: {
            text: 'loading',
            color: '#678098',
            textColor: '#678098',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        },
        //地圖類型
        mapType: mapType
    }

    Chart.prototype._bindDom = function(chartType) {

        if (chartType === 'areaplot' || chartType === 'lineplot' || chartType === 'barplot' || chartType === 'scatterplot') {
            //点击选择时间段
            if (this.opts.clickable === true) {
                this.myChart.on('click', $.proxy(this._drill, this));
            }

        } else if (chartType === 'mapplot') {
            var self = this
            this.myChart.on("legendselectchanged", function(params) {
                self._resetVMap(params)
            })
        } else if (chartType === 'treeplot') {
            return
        } else if (chartType === 'hbarplot') {
            if (this.opts.clickable === true) {
                this.myChart.on('click', $.proxy(this._renderSmBar, this))
            }
        } else if (chartType === 'hbarSelection') {
            var self = this
            this.myChart.on("legendselectchanged", function(params) {
                self._reloadYAxis(params)
                self._reloadDatatable(params)
            })
            if (this.opts.clickable === true) {
                this.myChart.on('click', $.proxy(this._renderSmBar, this))
            }
        } else if (chartType === 'lineSelection') {
            var self = this
            this.myChart.on("legendselectchanged", function(params) {
                self._reloadDatatable(params)
            })
        } else if (chartType === 'barplotStack') {
            return
        }

    }

    Chart.prototype._buildOption = function(chartType, data) {
        this.opts.chartData = data;
        var titleST = '',
            titleET = '';
        if (localStorage.getItem("LINK_STATUS") === "0") {
            titleST = '2016-04-26';
            titleET = '2016-04-27';
        } else if (smChartST.length > 0 && smChartET.length > 0) {
            titleST = smChartST[swiper.activeIndex].substring(0, 4) + "-" + smChartST[swiper.activeIndex].substring(4, 6) + "-" + smChartST[swiper.activeIndex].substring(6, 8);
            titleET = smChartET[swiper.activeIndex].substring(0, 4) + "-" + smChartET[swiper.activeIndex].substring(4, 6) + "-" + smChartET[swiper.activeIndex].substring(6, 8);
        }

        var option = {
            title: {
                text: this.opts.title || '',
                subtext: titleST == '' ? '' : titleST + ' -- ' + titleET,
                show: true,
                left: '5%',
                itemGap: 5,
                textStyle: {
                    color: '#678098',
                    fontSize: 14,
                    fontWeight: 500
                },
                subtextStyle: {
                    color: '#678098',
                    fontSize: 14,
                    fontWeight: 500
                }
            },
            toolbox: {
                show: true,
                right: "5%",
                iconStyle: {
                    normal: {
                        borderColor: '#999999'
                    },
                    emphasis: {
                        borderColor: '#999999'
                    }
                },
                top: '0',
                feature: {
                    restore: {
                        title: Dynamic.analysis_tools7
                    },
                    saveAsImage: {
                        title: Dynamic.analysis_tools6,
                        backgroundColor: 'rgba(0,0,0,0)'
                    }
                }
            }
        };

        var data = data;
        //如果返回数据为空，初始一个空数据，保证渲染出一个空的图表
        if (!(data && data.series && data.series.length > 0)) {
            data = {
                yAxis: {
                    name: '',
                    data: [0]
                },
                xAxis: {
                    name: '',
                    data: [0]
                },
                series: [{
                    name: '',
                    data: []
                }]
            }
        }
        if (chartType === 'areaplot' || chartType === 'lineplot' || chartType === 'barplot' || chartType === 'scatterplot') {
            var tempOption = this._buildLine(data)
        } else if (chartType === 'mapplot') {
            var tempOption = this._buildMap(data)
        } else if (chartType === 'treeplot') {
            var tempOption = this._buildTree(data)
        } else if (chartType === 'hbarplot') {
            var tempOption = this._buildHBar(data)
        } else if (chartType === 'hbarSelection') {
            var tempOption = this._buildHBarSelection(data)
        } else if (chartType === 'lineSelection') {
            var tempOption = this._buildLineSelection(data)
        } else if (chartType === 'barplotStack') {
            var tempOption = this._buildBarStack(data)
        }

        option = $.extend({}, option, tempOption)

        return option;
    }

    Chart.prototype.showLoading = function() {
        this.myChart.showLoading(this.opts.loadingObj)
    }

    Chart.prototype.hideLoading = function() {
        this.myChart.hideLoading()
    }

    Chart.prototype.resize = function() {
        this.myChart.resize()
    }

    Chart.prototype.injectData = function(data) {
        this.option = this._buildOption(this.opts.type, data)
        this.myChart.setOption(this.option);
    }

    //下钻后返回最初时间的图表的状态
    Chart.prototype._resetDate = function(self) {
        var self = self;
        rtTime = startTime + "|" + endTime;
        if (rtTime != drillTime) {
            drillTime = rtTime;
            self.showLoading();
            var customStartTime = startTime;
            var customEndTime = endTime;
            getChartData({
                projectID: projectID,
                startTime: customStartTime,
                endTime: customEndTime,
                url: btnUrl,
                rpType: self.opts.type,
                isSmallChartLoad: 'false',
                chart: [self],
                timeZone: timeZone
            })
        }
    }

    //生成小图表
    Chart.prototype._renderSmBar = function(params) {
        var index = params.dataIndex,
            legendIdx = this.opts.legendIdx || 0;
            name = this.opts.chartData.yAxis.data[index],
            status = params.seriesName,
            swiperIdx = swiper.activeIndex,
            smChart = smChartObj[swiperIdx][0];

        if(location.hash === "#/analysis/status"){
            name = this.opts.chartData.yAxis.data[legendIdx][index]
        }
        $('.echarts_vBar' + swiperIdx).css("width", "50%")
        $('.echarts_lBar' + swiperIdx).css({ "width": "49%", "height": "100%", "display": "inline-block" })
        this.resize()

        smChart.resize();
        smChart.showLoading();
        smChart.opts.title = name;
        this._getBarByUrl(name, smChartST, smChartET, status)
    }

    //获取小图标数据
    Chart.prototype._getBarByUrl = function(name, smStartTime, smEndTime, status) {
        var self = this;
        var requestInterval;
        var status = status || '';
        var name = htmlDecode(name);
        /*
         * 判断选择那种类型表年月日时分
         */
        var startTime = timeZoneChange(smStartTime[swiper.activeIndex]),
            endTime = timeZoneChange(smEndTime[swiper.activeIndex]),
            requestInterval = "HOUR";

        var currentPage = location.hash,
            url = '';

        if (currentPage === '#/analysis/pv') {
            url = btnUrl + "?cmd=WEL:GETPAGEVIEWBYURL" + requestInterval;
        } else if (currentPage === '#/analysis/ip') {
            url = btnUrl + "?cmd=WEL:GETPAGEVIEWBYIP" + requestInterval;
        } else if (currentPage === '#/analysis/data') {
            url = btnUrl + "?cmd=WEL:GETBYTESBYURL" + requestInterval;
        } else if (currentPage === '#/analysis/status' && swiper.activeIndex === 2) {
            url = btnUrl + "?cmd=WEL:GETINFOBYSTATUS" + requestInterval;
        } else if (currentPage === '#/analysis/status' && swiper.activeIndex === 3) {
            url = btnUrl + "?cmd=WEL:GETIPBYSTATUS" + requestInterval;
        } else if ((currentPage === '#/analysis/crawler' && swiper.activeIndex === 1) ||
            (currentPage === '#/analysis/sqlinjection' && swiper.activeIndex === 1) ||
            (currentPage === '#/analysis/fileinclusion' && swiper.activeIndex === 1) ||
            (currentPage === '#/analysis/xss' && swiper.activeIndex === 1)) {
            url = btnUrl + "?cmd=WEL:SELECTIP" + requestInterval;
        } else if ((currentPage === '#/analysis/crawler' && swiper.activeIndex === 2) ||
            (currentPage === '#/analysis/sqlinjection' && swiper.activeIndex === 2) ||
            (currentPage === '#/analysis/fileinclusion' && swiper.activeIndex === 2) ||
            (currentPage === '#/analysis/xss' && swiper.activeIndex === 2)) {
            url = btnUrl + "?cmd=WEL:SELECTURL" + requestInterval;
        }

        if (currentPage === '#/analysis/pv' ||
            currentPage === '#/analysis/data' ||
            (currentPage === '#/analysis/crawler' && swiper.activeIndex === 2) ||
            (currentPage === '#/analysis/sqlinjection' && swiper.activeIndex === 2) ||
            (currentPage === '#/analysis/fileinclusion' && swiper.activeIndex === 2) ||
            (currentPage === '#/analysis/xss' && swiper.activeIndex === 2)) {
            xhr = $.ajax({
                type: "get",
                url: url,
                data: {
                    url: name,
                    startTime: startTime,
                    endTime: endTime,
                    project_id: projectID,
                    timeZone: timeZone
                },
                async: true,
                cache: true,
                dataType: "json", //返回json格式
                success: function(data) {
                    renderChart(data, smChartObj[swiper.activeIndex][0]);
                    self._setChartTitle(smChartObj[swiper.activeIndex][0], name);
                },
                error: function() { // 请求失败处理函数
                }
            })
        } else if (currentPage === '#/analysis/ip' ||
            (currentPage === '#/analysis/crawler' && swiper.activeIndex === 1) ||
            (currentPage === '#/analysis/sqlinjection' && swiper.activeIndex === 1) ||
            (currentPage === '#/analysis/fileinclusion' && swiper.activeIndex === 1) ||
            (currentPage === '#/analysis/xss' && swiper.activeIndex === 1)) {
            xhr = $.ajax({
                type: "get",
                url: url,
                data: {
                    ip: name,
                    startTime: startTime,
                    endTime: endTime,
                    project_id: projectID,
                    timeZone: timeZone
                },
                async: true,
                cache: true,
                dataType: "json", //返回json格式
                success: function(data) {
                    renderChart(data, smChartObj[swiper.activeIndex][0]);
                    self._setChartTitle(smChartObj[swiper.activeIndex][0], name);
                },
                error: function() { // 请求失败处理函数
                }
            })
        } else if (currentPage === '#/analysis/status' && swiper.activeIndex === 2) {
            xhr = $.ajax({
                type: "get",
                url: url,
                data: {
                    url: name,
                    status: status,
                    startTime: startTime,
                    endTime: endTime,
                    project_id: projectID,
                    timeZone: timeZone
                },
                async: true,
                cache: true,
                dataType: "json", //返回json格式
                success: function(data) {
                    renderChart(data, smChartObj[swiper.activeIndex][0]);
                    self._setChartTitle(smChartObj[swiper.activeIndex][0], name);
                },
                error: function() { // 请求失败处理函数
                }
            })
        } else if (currentPage === '#/analysis/status' && swiper.activeIndex === 3) {
            xhr = $.ajax({
                type: "get",
                url: url,
                data: {
                    ip: name,
                    status: status,
                    startTime: startTime,
                    endTime: endTime,
                    project_id: projectID,
                    timeZone: timeZone
                },
                async: true,
                cache: true,
                dataType: "json", //返回json格式
                success: function(data) {
                    renderChart(data, smChartObj[swiper.activeIndex][0]);
                    self._setChartTitle(smChartObj[swiper.activeIndex][0], name);
                },
                error: function() { // 请求失败处理函数
                }
            })
        }
    }

    Chart.prototype._setChartTitle = function(chart, title) {
        var chart = chart;
        chart.option.title = {
            text: title || '',
            show: true,
            left: 'center',
            textStyle: {
                color: '#999'
            },
            subtext: ''
        }

        chart.myChart.setOption(chart.option);
    }

    //改变y轴坐标数据
    Chart.prototype._reloadYAxis = function(params) {
        var data = this.opts.chartData;
        //option.yAxis.data
        // var nameList = _.key(params.selected);
        // var index = nameList.indexOf(params.name);
        var index = data.legend.indexOf(params.name);
        this.opts.legendIdx = index;
        this.option.yAxis.data = data.yAxis.data[index];
        this.myChart.setOption(this.option);
    }

    Chart.prototype._reloadDatatable = function(params) {
        var data = this.opts.chartData;
        var idx = data.legend.indexOf(params.name);
        var tpl = '';
        if (this.opts.type === 'hbarSelection') {
            $.each(data.series[idx].data, function(index, item) {
                tpl += "<tr><td>" + (index + 1) + "</td><td><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + data.yAxis.data[idx][index] + "</div></td><td>" + item + "</td></tr>";
            })
        } else {
            $.each(data.series[idx].data, function(index, item) {
                tpl += "<tr><td>" + (index + 1) + "</td><td><div class='urlTd' style='width:" + ($(".txtData>.countent").width()) * 0.65 + "px" + ";''>" + data.xAxis.data[index] + "</div></td><td>" + item + "</td></tr>";
            })
        }
        renderDatatable(tpl)
    }

    //图表下钻
    Chart.prototype._drill = function(params) {
        var rushDate1 = params.name.replace(/-/g, "");
        var rushDate2 = rushDate1.replace(' ', "");
        var rushDate3 = rushDate2.replace(':', "");
        var startTime = '',
            endTime = '';
        if (rushDate3.length === 6) {
            startTime = (rushDate3 + '01000000').slice(0, 12);
            endTime = (Number(rushDate3) + 1 + '01000000').slice(0, 12);
        } else {
            startTime = (rushDate3 + '00000000').slice(0, 12);
            endTime = ((Number(rushDate3) + 1) * 100000000 + '').slice(0, 12);
        }

        var currentInterval;
        if (drillTime != (startTime + "|" + endTime)) {
            drillTime = startTime + "|" + endTime;
            if (startTime.length <= 12) {
                this.showLoading();
                var time = 'free';

                getChartData({
                    projectID: projectID,
                    startTime: startTime,
                    endTime: endTime,
                    url: btnUrl,
                    rpType: this.opts.type,
                    isSmallChartLoad: 'false',
                    chart: [this],
                    timeZone: timeZone
                })
            };
        }
    }

    Chart.prototype._resetVMap = function(params) {
        var data = this.opts.chartData;
        var idx = data.legend.indexOf(params.name);
        var maxNum = 0;
        if (idx === 0) {
            this.option.visualMap.inRange.color = ['#94bdce', '#00628b'];
            $.each(data.series[idx].data, function(index, item) {
                if (item.value > maxNum) {
                    maxNum = item.value
                }
            })
        } else if (idx === 1) {
            this.option.visualMap.inRange.color = ['#cbe7f1', '#0089bb'];
            $.each(data.series[idx].data, function(index, item) {
                if (item.value > maxNum) {
                    maxNum = item.value
                }
            })
        } else {
            this.option.visualMap.inRange.color = ['#d9f3f8', '#32bbdb'];
            $.each(data.series[idx].data, function(index, item) {
                if (item.value > maxNum) {
                    maxNum = item.value
                }
            })
        }
        this.option.visualMap.max = maxNum || 1000;
        this.myChart.setOption(this.option);
    }

    //build不同图表的option
    Chart.prototype._buildLine = function(data) {
        var data = data;
        var self = this;
        var option = {
            color: self.opts.defaultColor,
            grid: {
                top: '80px',
                left: '6%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                left: '20%',
                top: '47px',
                data: [],
                textStyle: {
                    color: '#999'
                }
            },
            toolbox: {
                show: true,
                right: "5%",
                top: "0",
                iconStyle: {
                    normal: {
                        borderColor: '#999'
                    },
                    emphasis: {
                        borderColor: '#999999'
                    }
                },
                feature: {
                    myTool1: {
                        show: true,
                        title: Dynamic.analysis_tools1,
                        icon: 'image://img/t1.png',
                        onclick: function() {
                            for (var i = 0; i < option.series.length; i++) {
                                self.option.series[i].type = "line";
                                self.option.series[i].showSymbol = false;
                            }
                            $.each(self.option.series, function(index, item) {
                                item.areaStyle = {
                                    normal: {
                                        color: self.opts.colorTrans[index]
                                    }
                                }
                            })
                            self.option.xAxis = {
                                boundaryGap: 0
                            }
                            self.myChart.setOption(self.option)
                        }
                    },
                    myTool2: {
                        show: true,
                        title: Dynamic.analysis_tools2,
                        icon: 'image://img/t2.png',
                        onclick: function() {
                            for (var i = 0; i < option.series.length; i++) {
                                self.option.series[i].type = "line"
                                self.option.series[i].areaStyle = false;
                                self.option.series[i].showSymbol = true;
                            }
                            self.option.xAxis = {
                                boundaryGap: 0
                            }
                            self.myChart.setOption(self.option)
                        }
                    },
                    myTool3: {
                        show: true,
                        title: Dynamic.analysis_tools3,
                        icon: 'image://img/t3.png',
                        onclick: function() {
                            for (var i = 0; i < self.option.series.length; i++) {
                                self.option.series[i].type = "bar"
                            }
                            self.option.xAxis = {
                                boundaryGap: ['20%', '20%'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                            self.myChart.setOption(self.option)
                            self.option.xAxis = {
                                boundaryGap: 0,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        }
                    },
                    myTool4: {
                        show: true,
                        title: Dynamic.analysis_tools4,
                        icon: 'image://img/t4.png',
                        onclick: function() {
                            for (var i = 0; i < self.option.series.length; i++) {
                                self.option.series[i].type = "scatter"
                            }
                            self.option.xAxis = {
                                boundaryGap: ['10%', '10%'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                            self.myChart.setOption(self.option)
                            self.option.xAxis = {
                                boundaryGap: 0,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        }
                    },
                    saveAsImage: {
                        title: Dynamic.analysis_tools6,
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    myTool5: {
                        show: true,
                        title: Dynamic.analysis_tools5,
                        icon: 'image://img/kj_sprite_11.gif',
                        onclick: function() {
                            self._resetDate(self)
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: {
                name: data.xAxis.name,
                type: 'category',
                data: data.xAxis.data,
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                solitLine: {
                    show: false
                },
                boundaryGap: false
            },
            yAxis: [],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                throttle: 0
            }],
            series: []
        }

        $.each(data.series, function(index, item) {
            if (self.opts.legend === true) {
                option.legend.data[index] = {
                    name: item.name,
                    icon: 'roundRect'
                }
            }

            option.yAxis[index] = {
                name: item.name || '',
                type: 'value',
                scale: { power: 1, precision: 1 },
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                splitNumber: 3,
                splitLine: {
                    show: false
                }
            }

            //initial series
            option.series[index] = {
                //static
                type: 'line',
                symbolSize: 10,
                showSymbol: false,
                //dynamic
                name: item.name,
                yAxisIndex: index, //匹配对应的yAxis
                lineStyle: {
                    normal: {
                        color: self.opts.defaultColor[index]
                    }
                },
                areaStyle: {
                    normal: {
                        color: self.opts.colorTrans[index]
                    }
                },
                data: item.data
            }

            if (self.opts.type === "lineplot") {
                option.series[index].type = "line"
                option.series[index].areaStyle = false;
                option.series[index].showSymbol = true;
            } else if (self.opts.type === "barplot") {
                option.series[index].type = "bar";
            } else if (self.opts.type === "scatterplot") {
                option.series[index].type = "scatter";
            }
        })

        if (self.opts.type === "barplot") {
            option.xAxis.boundaryGap = ['20%', '20%'];
            option.xAxis.axisTick = {
                alignWithLabel: true
            }
        } else if (self.opts.type === "scatterplot") {
            option.xAxis.boundaryGap = ['10%', '10%'];
            option.xAxis.axisTick = {
                alignWithLabel: true
            }
        }

        //如果toolbox type是close的话，只显示close按钮
        if (self.opts.toolboxType && self.opts.toolboxType === "close") {
            option.legend = {}
            option.toolbox.feature = {
                saveAsImage: {
                    title: Dynamic.analysis_tools6,
                    backgroundColor: 'rgba(0,0,0,0)'
                },
                myTool1: {
                    show: true,
                    title: Dynamic.analysis_tools7,
                    icon: "image://img/close.png",
                    onclick: function() {
                        var idx = swiper.activeIndex
                        $(".echarts_vBar" + idx).css({ "width": "100%" });
                        $(".echarts_lBar" + idx).css({ "display": "none" });
                        chartObj[idx][0].resize();
                    }
                }
            }
        } else if (self.opts.toolboxType && self.opts.toolboxType === "none") {
            option.toolbox = {};
        } else if (self.opts.toolboxType && self.opts.toolboxType === "basic") {
            option.toolbox.feature = {
                restore: {
                    title: Dynamic.analysis_tools7
                },
                saveAsImage: {
                    title: Dynamic.analysis_tools6,
                    backgroundColor: 'rgba(0,0,0,0)'
                }
            }

        }

        if (self.opts.showTitle === false) {
            option.title = {
                show: false
            }
            option.grid.top = '10px'
        }

        if (location.hash === "#/analysis/data") {
            option.tooltip = {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999'
                    }
                },
                formatter: function(params) {
                    return params[0].name + "</br>" + Dynamic.analysis_DataNum + "：" + data.tooltip[params[0].dataIndex]
                }
            }
        }


        return option
    }

    Chart.prototype._buildTree = function(data) {
        var data = data;
        var self = this;

        var option = {
            color: self.opts.treeColor,
            tooltip: {
                trigger: 'item',
                formatter: "{b}</br> " + data.tooltip + "&nbsp;:&nbsp;{c}"
            },
            series: [{
                name: '', //页面访问量统计
                type: 'treemap',
                breadcrumb: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}"
                        },
                        borderWidth: 1,
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: data.series[0].data
            }]
        }

        if (location.hash === "#/analysis/data") {
            option.tooltip = {
                trigger: 'item',
                formatter: function(params) {
                    return params.name + "</br>" + Dynamic.analysis_DataNum + "：" + data.tooltip[params.dataIndex]
                }
            }
        }

        return option;
    }

    Chart.prototype._buildMap = function(data) {
        var data = data;
        var self = this;
        var option = {
            color: ['#00628b', '#0089bb', '#32bbdb'],
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (isNaN(params.value)) {
                        params.value = 0;
                    }
                    if (params.seriesName == "数据流量") {
                        return params.name + "<br />" + params.seriesName + ":" + self.opts.chartData.tooltip[params.dataIndex];
                    } else {
                        return params.name + "<br />" + params.seriesName + "&nbsp;:&nbsp;" + params.value;
                    }
                }

            },
            legend: {
                orient: 'vertical',
                top: '47px',
                left: '5%',
                data: [],
                textStyle: {
                    color: "#999999"
                },
                selectedMode: 'single'
            },
            visualMap: {
                min: 0,
                max: 200,
                left: '5%',
                top: 'bottom',
                inRange: {
                    color: ['#94bdce', '#00628b']
                },
                calculable: true,
                textStyle: {
                    color: "#999999"
                }
            },
            graphic: [{
                id: 'left-btn',
                type: 'circle',
                shape: { r: 20 },
                style: {
                    text: '<',
                    fill: '#eee'
                },
                top: '100px',
                left: '5%'
            }, {
                id: 'right-btn',
                type: 'circle',
                shape: { r: 20 },
                style: {
                    text: '>',
                    fill: '#eee'
                },
                top: '100px',
                right: '5%'
            }],
            series: []
        }
        $.each(data.series, function(index, item) {
            option.legend.data[index] = {
                name: item.name,
                icon: 'roundRect'
            }

            //initial series
            option.series[index] = {
                name: item.name,
                type: 'map',
                mapType: self.opts.mapType,
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#111',
                        textStyle: '#999999'
                    },
                    emphasis: {
                        areaColor: '#b2e4f6',
                        borderColor: '#999999',
                        borderWidth: 1
                    }
                },
                data: item.data
            }
            if (self.opts.mapType === 'World') {
                option.series[index].label = {}
            } else {
                option.series[index].label = {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#999'
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#000'
                        }
                    }
                }
            }
        })

        var maxNum = 0;
        $.each(data.series[0].data, function(index, item) {
            if (item.value > maxNum) {
                maxNum = item.value
            }
        })
        option.visualMap.max = maxNum || 1000;
        $(".region-select-group").eq(0).css({ "display": "inline-block" })
        $("button", $(".region-select-group").eq(1)).removeClass();
        $("button", $(".region-select-group").eq(1)).addClass("btn btn-outline dropdown-toggle control")
        return option;
    }

    Chart.prototype._buildHBar = function(data) {
        var data = data;
        var self = this;
        var option = {
            color: ['#5ab8de'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var val = '';
                    params[0].value === undefined ? val = '' : val = params[0].value;
                    if (location.hash === "#/analysis/data") {
                        return params[0].name + "</br>" + Dynamic.analysis_DataNum + "：" + data.tooltip[params[0].dataIndex]
                    } else {
                        return params[0].name + "</br>" + data.xAxis.name + "：" + val
                    }
                }
            },
            legend: {
                data: [],
                left: 'center',
                top: '0',
                textStyle: {
                    color: '#999999'
                },
                selectedMode: 'single'
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                top: '80px',
                right: '69px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                top: '80px',
                left: '2%',
                right: '100px',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: data.xAxis.name,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: data.yAxis.name,
                nameLocation: 'start',
                inverse: true,
                data: data.yAxis.data.map(function(item) {
                    var formatUrl;
                    if (item && item.length > 50) {
                        formatUrl = item.substring(0, 50)
                        return formatUrl
                    } else {
                        return item;
                    }
                }),
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: []
        }

        $.each(data.series, function(index, item) {
            option.legend.data[index] = {
                name: item.name,
                icon: 'roundRect'
            }

            //initial series
            option.series[index] = {
                name: item.name,
                type: 'bar',
                barMinHeight: 20,
                data: item.data
            }
        })

        return option;
    }

    Chart.prototype._buildHBarSelection = function(data) {
        var data = data;
        var self = this;
        var option = {
            color: ['rgba(90,184,222,1)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
                /*
                formatter: function(params) {
                    return data.urlCount[params[0].dataIndex].url + "<br />访问次数(次)：" + data.urlCount[params[0].dataIndex].urlNum
                }*/
            },
            legend: {
                data: [],
                left: '5%',
                top: '47px',
                textStyle: {
                    color: '#999999'
                },
                selectedMode: 'single'
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                bottom: '7.5%',
                right: '71px',
                startValue: 0,
                endValue: 9,
                textStyle: {
                    color: "#999999"
                }
            }],
            grid: {
                left: '60px',
                right: '100px',
                bottom: '3%',
                top: '100px',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: data.xAxis.name,
                nameLocation: 'end',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: data.yAxis.name,
                nameLocation: 'start',
                inverse: true,
                data: [],
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                }
            },
            series: []
        }
        if (data.yAxis.data.length > 0 && (data.yAxis.data[0] instanceof Array)) {
            option.yAxis.data = data.yAxis.data[0].map(function(item) {
                var formatUrl;
                if (item && item.length > 50) {
                    formatUrl = item.substring(0, 50)
                    return formatUrl
                } else {
                    return item;
                }
            })
        }


        $.each(data.series, function(index, item) {
            option.legend.data[index] = {
                name: item.name,
                icon: 'roundRect'
            }

            //initial series
            option.series[index] = {
                name: item.name,
                type: 'bar',
                barMinHeight: 20,
                data: item.data
            }
        })

        return option;
    }

    Chart.prototype._buildLineSelection = function(data) {
        var data = data;
        var self = this;
        var option = {
            color: ['rgba(90,184,222,1)'],
            grid: {
                left: '6%',
                right: '6%',
                bottom: '3%',
                top: '80px',
                containLabel: true
            },
            legend: {
                left: '15%',
                top: '47px',
                data: [],
                textStyle: {
                    color: '#999'
                },
                selectedMode: 'single'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: {
                name: data.xAxis.name,
                type: 'category',
                data: data.xAxis.data,
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                solitLine: {
                    show: false
                },
                boundaryGap: false
            },
            yAxis: [],
            series: []
        }

        option.yAxis[0] = {
            name: data.yAxis.name || '',
            type: 'value',
            scale: { power: 1, precision: 1 },
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            }
        }
        $.each(data.series, function(index, item) {
            option.legend.data[index] = {
                name: item.name,
                icon: 'roundRect'
            }

            //initial series
            option.series[index] = {
                //static
                type: 'line',
                symbolSize: 10,
                showSymbol: false,
                //dynamic
                name: item.name,
                lineStyle: {
                    normal: {
                        color: self.opts.defaultColor[0]
                    }
                },
                areaStyle: {
                    normal: {
                        color: self.opts.colorTrans[0]
                    }
                },
                data: item.data
            }

            if (self.opts.type === "lineplot") {
                option.series[index].type = "line"
                option.series[index].areaStyle = false;
                option.series[index].showSymbol = true;
            } else if (self.opts.type === "barplot") {
                option.series[index].type = "bar";
            } else if (self.opts.type === "scatterplot") {
                option.series[index].type = "scatter";
            }
        })

        if (self.opts.type === "barplot") {
            option.xAxis.boundaryGap = ['20%', '20%'];
            option.xAxis.axisTick = {
                alignWithLabel: true
            }
        } else if (self.opts.type === "scatterplot") {
            option.xAxis.boundaryGap = ['10%', '10%'];
            option.xAxis.axisTick = {
                alignWithLabel: true
            }
        }

        return option
    }

    Chart.prototype._buildBarStack = function(data) {
        var data = data;
        var self = this;
        rpTypeCheck()
        var thisChartType = rpType;
        var option = {
            color: self.opts.defaultColor,
            grid: {
                top: '80px',
                left: '6%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                left: '20%',
                top: '47px',
                data: [],
                textStyle: {
                    color: '#999'
                }
            },
            toolbox: {
                show: true,
                right: '5%',
                iconStyle: {
                    normal: {
                        borderColor: '#999'
                    },
                    emphasis: {
                        borderColor: '#999999'
                    }
                },
                feature: {
                    myTool3: {
                        show: true,
                        title: Dynamic.analysis_tools3,
                        icon: 'image://img/t3.png',
                        onclick: function() {
                            for (var i = 0; i < self.option.series.length; i++) {
                                self.option.series[i].type = "bar"
                            }
                            self.option.xAxis = {
                                boundaryGap: ['20%', '20%'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                            self.myChart.setOption(self.option)
                            self.option.xAxis = {
                                boundaryGap: 0,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        }
                    },
                    myTool1: {
                        show: true,
                        title: Dynamic.analysis_tools1,
                        icon: 'image://img/t1.png',
                        onclick: function() {
                            for (var i = 0; i < option.series.length; i++) {
                                self.option.series[i].type = "line";
                                self.option.series[i].showSymbol = false;
                            }
                            $.each(self.option.series, function(index, item) {
                                item.areaStyle = {
                                    normal: {
                                        color: self.opts.colorTrans[index]
                                    }
                                }
                            })
                            self.option.xAxis = {
                                boundaryGap: 0
                            }
                            self.myChart.setOption(self.option)
                        }
                    },
                    saveAsImage: {
                        title: Dynamic.analysis_tools6,
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    restore: {
                        title: Dynamic.analysis_tools7
                    }

                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var str, formatCount = 0,
                        val1, val2, val3, sum;
                    var val = [];
                    if (data && data.series[0].data.length > 0) {
                        val = params.map(function(item) {
                            return item.value || 0
                        })

                        sum = _.reduce(val, function(a, b) {
                            return a + b
                        })

                        sum ? formatCount = sum : sum = 1

                        str = params[0]["name"] + "<br />"

                        if (thisChartType === "statusBar" && pageName === "CRAWLER") {


                            $.each(params, function(idx, item) {
                                str += Dynamic['analysis_crawler_status' + (idx + 1)] + ":" + val[idx] + "(" + ForDight(val[idx] / sum * 100, 2) + "%)<br />"
                            })

                            str += Dynamic.analysis_crawler_statusNum + ":" + formatCount;

                        } else if (thisChartType === "statusBar") {


                            $.each(params, function(idx, item) {
                                str += Dynamic['analysis_sql_attackStatus' + (idx + 1)] + ":" + val[idx] + "(" + ForDight(val[idx] / sum * 100, 2) + "%)<br />"
                            })

                            str += Dynamic.analysis_sql_attackStatusNum + ":" + formatCount;

                        } else if (pageName === "CRAWLER") {
                            str = str +
                                Dynamic['analysis_crawler_notCrawler'] + ":" + val[0] + "(" + ForDight(val[0] / sum * 100, 2) + "%)<br />" +
                                Dynamic['analysis_crawler_crawlerNum'] + ":" + val[1] + "(" + ForDight(val[1] / sum * 100, 2) + "%)<br />" +
                                Dynamic.analysis_crawler_PvNum + ":" + formatCount;
                        } else {
                            str += params[0]["seriesName"] + ":" + val[0]
                        }
                    }
                    return str
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: {
                name: data.xAxis.name,
                type: 'category',
                data: data.xAxis.data,
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                solitLine: {
                    show: false
                },
                boundaryGap: false
            },
            yAxis: [{
                name: data.yAxis.name,
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                splitNumber: 3,
                splitLine: {
                    show: false
                }
            }],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                throttle: 0
            }],
            series: []
        }

        $.each(data.series, function(index, item) {
            option.legend.data[index] = {
                name: item.name,
                icon: 'roundRect'
            }

            //initial series
            option.series[index] = {
                //static
                type: 'line',
                symbolSize: 10,
                showSymbol: false,
                //dynamic
                name: item.name,
                //yAxisIndex: index, //匹配对应的yAxis
                lineStyle: {
                    normal: {
                        color: self.opts.defaultColor[index]
                    }
                },
                stack: data.yAxis.name,
                areaStyle: {
                    normal: {
                        color: self.opts.colorTrans[index]
                    }
                },
                data: item.data
            }

            if (self.opts.type === "lineplot") {
                option.series[index].type = "line"
                option.series[index].areaStyle = false;
                option.series[index].showSymbol = true;
            } else if (self.opts.type === "barplot" || self.opts.type === "barplotStack") {
                option.series[index].type = "bar";
            }
        })

        if (self.opts.type === "barplot" || self.opts.type === "barplotStack") {
            option.xAxis.boundaryGap = ['20%', '20%'];
            option.xAxis.axisTick = {
                alignWithLabel: true
            }
        }

        return option
    }

    return {
        Chart: Chart
    }
})
