define([], function() {
    function SmChart(el, opts) {
    	this.$el = $(el)
        this.chartData = [];

        this.opts = $.extend({}, SmChart.DEFAULTS, opts)

        // this.interval = opts.interval;
        // this.startTime = opts.startTime;
        // this.endTime = opts.endTime;

        
    }

    SmChart.DEFAULTS = {

    }

    SmChart.prototype.build = function(){
    	this.$el.empty()
    	this._getTimeArr();
    	this._getChartData(5, 0);
    }

    SmChart.prototype._getTimeArr = function(){
    	var smChartStartTimeArr = [],
    		smChartEndTimeArr = [],
    		idx=0;

    	for(var i=5; i>=0; i--){
    		smChartStartTimeArr[idx] = this._calculateTime(this.opts.startTime, i)
    		smChartEndTimeArr[idx] = this._calculateTime(this.opts.endTime, i)

    		idx++;
    	}
    	this.smChartStartTimeArr = smChartStartTimeArr;
    	this.smChartEndTimeArr = smChartEndTimeArr;
    }

    SmChart.prototype._getChartData = function(recursiveIdx, chartIdx) {
        var smChartStartTimeArr = this.smChartStartTimeArr,
            smChartEndTimeArr = this.smChartEndTimeArr,
            chartIdx = chartIdx,
            recursiveIdx = recursiveIdx,
            self = this;

        rpTypeCheck();

        var currentStartTime = smChartStartTimeArr[chartIdx],
            currentEndTime = smChartEndTimeArr[chartIdx],
            project_id = projectID,
            tempMapType = chartObj[swiper.activeIndex][0].opts.mapType;

        if (recursiveIdx < 0) {
            return false
        }
        var currentIndex = swiper.activeIndex;
        var tempTxt = ''
        if(currentIndex === 0){
        	tempTxt = "ONE"
        } else if (currentIndex === 1){
        	tempTxt = "TWO"
        } else if (currentIndex === 2){
        	tempTxt = "THREE"
        } else if (currentIndex === 3){
        	tempTxt = "FOUR"
        }


        $.ajax({
        	// type: "post",
         //    url: this.opts.btnUrl + '?cmd=WEL:GETCHARINFO',
         //    data: {
         //        project_id: projectID,
         //        chartType: rpType,
         //        startTime: timeZoneChange(currentStartTime),
         //        endTime: timeZoneChange(currentEndTime),
         //        timeZone: timeZone
         //    },
            type: "get",
            url: this.opts.btnUrl + "?cmd=WEL:SELECTHOUR"+tempTxt,
            data: {
                date: '',
                startTime: timeZoneChange(currentStartTime),
                endTime: timeZoneChange(currentEndTime),
                rpType: rpType,
                project_id: projectID,
                country: tempMapType === 'World' ? '' : tempMapType,
                timeZone: timeZone
            },
            async: true,
            cache: true,
            dataType: "json", //返回json格式
            success: function(data) {
                console.log(chartIdx)
                console.log(data)
                self._getSmChartImg({
                    cStartTime: currentStartTime,
                    cEndTime: currentEndTime,
                    data: data.dataList,
                    idx: chartIdx
                });
                chartIdx++;
                recursiveIdx--;
                self._getChartData(recursiveIdx, chartIdx)
            }
        })
    }

    SmChart.prototype._getSmChartImg = function(obj) {
        var currentIndex = swiper.activeIndex,
            chartsImgBox = this.$el,
            figType,
            cStartTime = obj.cStartTime,
            cEndTime = obj.cEndTime,
            idx = obj.idx,
            dataList = obj.data,
            self=this;
        chartsImgBox.append('<li class="smChartsImg noPad col-md-2 col-xs-2 smChartsImg' + idx + '"></li>')

        var dataJson = [{
            time: cStartTime,
            data: dataList[0].data
        }]

        if ((pageName === "CRAWLER" && currentIndex === 0) || (pageName === "CRAWLER" && currentIndex === 3) || (pageName === "INJECTION" && currentIndex === 3) || (pageName === "LOOPHOLE" && currentIndex === 3) || (pageName === "SCRIPT" && currentIndex === 3)) {
            $.each(dataList, function(index, item) {
                    if (index === 0) {
                        dataJson[0].data = item.data
                    } else {
                        $.each(item.data, function(idx, val) {
                            dataJson[0].data[idx]["value" + index] = val.value;
                        })
                    }
                })
                // dataJson[0].data = dataList
        } else if (pageName === "DATA") {
            dataJson[0].data = [];
            $.each(dataList[0].data, function(index, item) {
                dataJson[0].data.push({
                    name: item.name,
                    value: item.value
                })
            })
        }

        var cPageName = this.opts.pageName;
        if (cPageName == "BR" || cPageName == "OS" || cPageName == "TP") {
            figType = this.$el.prev().prev().attr('class').split(" ").pop();
        } else {
            figType = this.$el.prev().attr('class').split(" ").pop();
        }

        if (cPageName === "CRAWLER" && currentIndex === 0) {
            cPageName = "pv_crawler";
        }

        if (figType === "mapplot") {
            var tempMapType = chartObj[1][0].opts.mapType;
            if (tempMapType === "World") {
                figType = "globalmap"
            } else if (tempMapType === "China") {
                figType = "cnmap"
            }
        }
        var pathFigType = figType;
        if (pageName === "CRAWLER" || pageName === "INJECTION" || pageName === "LOOPHOLE" || pageName === "SCRIPT") {
            if (currentIndex === 1) {
                pathFigType = "byip"
            } else if (currentIndex === 2) {
                pathFigType = "byurl"
            } else if (currentIndex === 3) {
                pathFigType = "bystatus"
            }
        }

        $.ajax({
            type: "get",
            url: "/api/analysis.open?cmd=WEL:PLOTDRAW",
            data: {
                // hostIp: '60.205.152.23',
                filePath: '/NailFIG/' + userID + '/' + projectID + '/' + this.opts.pageName + '/' + pathFigType + '/' + this.opts.interval,
                plotType: figType,
                plotName: cPageName.toLowerCase(),
                dataJson: JSON.stringify(dataJson)
            },
            async: false,
            cache: true,
            dataType: "json",
            success: function(data) {
                console.log(data)
                var smchartInterval = interval;
                var cSmChartsImg = self.$el.find(".smChartsImg" + idx)

                if (localStorage.getItem("LINK_STATUS") === "0") {
                    imgTime = parseInt(parseInt(201604260000) / 10000);
                    smchartInterval = 'day';
                }

                var imgSrc, smChartImg;
                if (data && data != "") {
                    imgSrc = "/chart" + data;
                    smChartImg = 'smChartImg-h';
                } else {
                    imgSrc = Dynamic.analysis_errorimg;
                    smChartImg = 'smChartImg-v';
                }

                if (smchartInterval == "day") {
                    cSmChartsImg.append("<img class='" + smChartImg + "' src='" + imgSrc + "' alt='缩略图加载失败'></img><br /><span class='smChartsSt' style='line-height:32px;'>" + formatTime(cStartTime, smchartInterval) + "</span>");
                } else if (smchartInterval == "week") {
                    var stTime = cStartTime;
                    var edTime = cEndTime;
                    var tpl = "<img class='" + smChartImg + "' src='" + imgSrc +
                        "' alt='缩略图加载失败'></img><br /><span> " + Dynamic.analysis_form +
                        " </span><span class='smChartsSt'>" + formatTime(stTime, smchartInterval) +
                        "</span></br><span> " + Dynamic.analysis_to +
                        " </span><span class='smChartsEt'>" + formatTime(edTime, smchartInterval) +
                        "</span>";
                    cSmChartsImg.append(tpl)
                } else if (smchartInterval == "oneMonth") {
                    var tpl = "<img class='" + smChartImg + "' src='" + imgSrc + "' alt='缩略图加载失败'></img><br /><span class='smChartsSt' style='line-height:32px;'>" + formatTime(cStartTime, smchartInterval) + "</span>";
                    cSmChartsImg.append(tpl)
                } else if (smchartInterval == "year") {
                    var tpl = "<img class='" + smChartImg + "' src='" + imgSrc + "' alt='缩略图加载失败'></img><br /><span class='smChartsSt' style='line-height:32px;'>" + formatTime(cStartTime, smchartInterval) + "</span>";
                    cSmChartsImg.append(tpl)
                }
            }
        })
    }

    SmChart.prototype._calculateTime = function(time, num) {
        var time = time,
            num = num;
        var formatTime = time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8) + " " + time.slice(8, 10) + ":" + time.slice(10, 12);
        if (this.opts.interval === "year") {
            return time.slice(0, 4) - num + time.slice(4);
        } else if (this.opts.interval === "oneMonth") {
            return moment(formatTime).add(-num, "month").format('YYYYMMDDHHmm');
        } else if (this.opts.interval === "week") {
            return moment(formatTime).add(-7 * num, "day").format('YYYYMMDDHHmm');
        } else if (this.opts.interval === "day") {
            return moment(formatTime).add(-num, "day").format('YYYYMMDDHHmm');
        }
    }

    return {
        SmChart: SmChart
    }
})
