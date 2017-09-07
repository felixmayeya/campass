function echartsInit1(data, select1) {
    var _chart1 = echarts.init(select1);
    var option = {
        title: {
            text: Dynamic.search_ChartsL,
            left: 'center',
            textStyle: {
                color: '#737373'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        toolbox: {
            show: true,
            top: "8%",
            right: "10%",
            iconStyle: {
                normal: {
                    borderColor: '#737373',
                },
                emphasis: {
                    borderColor: '#737373',
                }
            },
            feature: {
                myTool1: {
                    show: true,
                    title: Dynamic.search_charts_a,
                    icon: 'image://img/t1.png',
                    onclick: function() {
                        for (var i = 0; i < option.series.length; i++) {
                            option.series[i].type = "line";
                            option.series[i].areaStyle = {
                                normal: {}
                            };
                            option.series[i].showSymbol = false;
                        }
                        option.color = ['rgba(90,184,222,0.2)', 'rgba(247,186,148,0.2)'];
                        _chart1.setOption(option);
                    },
                },
                myTool2: {
                    show: true,
                    title: Dynamic.search_charts_b,
                    icon: 'image://img/t2.png',
                    onclick: function() {
                        for (var i = 0; i < option.series.length; i++) {
                            option.series[i].type = "line";
                            option.series[i].areaStyle = false;
                            option.series[i].showSymbol = true;
                        }
                        option.color = ['rgba(90,184,222,1)', 'rgba(247,186,148,1)'];
                        _chart1.setOption(option);
                    }
                },
                myTool3: {
                    show: true,
                    title: Dynamic.search_charts_c,
                    icon: 'image://img/t3.png',
                    onclick: function() {
                        for (var i = 0; i < option.series.length; i++) {
                            option.series[i].type = "bar";
                        }
                        option.color = ['rgba(90,184,222,1)', 'rgba(247,186,148,1)'];
                        option.xAxis = {
                            boundaryGap: ['20%', '20%'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        };
                        _chart1.setOption(option);
                        option.xAxis = {
                            boundaryGap: 0,
                            axisTick: {
                                alignWithLabel: true
                            }
                        };
                    }
                },
                myTool4: {
                    show: true,
                    title: Dynamic.search_charts_d,
                    icon: 'image://img/t4.png',
                    onclick: function() {
                        for (var i = 0; i < option.series.length; i++) {
                            option.series[i].type = "scatter";
                        }
                        option.color = ['rgba(90,184,222,1)', 'rgba(247,186,148,1)'];
                        option.xAxis = {
                            boundaryGap: ['10%', '10%'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        };
                        _chart1.setOption(option);
                        option.xAxis = {
                            boundaryGap: 0,
                            axisTick: {
                                alignWithLabel: true
                            }
                        };
                    }
                },
                saveAsImage: {
                    title: Dynamic.search_charts_save
                }
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
            throttle: 0
        }, ],
        color: ['rgba(90,184,222,0.2)', 'rgba(247,186,148,0.2)'],
        xAxis: {
            name: Dynamic.search_charts_time_,
            type: 'category',
            data: data.order,
            axisLine: {
                lineStyle: {
                    color: '#737373'
                }
            },
            solitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: [{
            name: Dynamic.search_charts_ask,
            type: 'value',
            axisLabel: {
                formatter: "{value}"
            },
            axisLine: {
                lineStyle: {
                    color: '#737373'
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            },
            scale: true
        }],
        series: [{
            name: Dynamic.search_charts_ask,
            type: 'line',
            data: data.percent,
            lineStyle: {
                normal: {
                    color: '#87abdd'
                }
            },
            areaStyle: {
                normal: {}
            },
            symbolSize: 10,
            showSymbol: false
        }],
        grid:{
        	left: "3%",
        	right: '90px',
        	containLabel: true
        }
    };
    _chart1.setOption(option);
    addLoadEvent(_chart1.resize);
    // window.onresize = _chart1.resize;
}

function echartsInit2(data, select2,searchMap) {
    registMap(searchMap||mapType)
    var _chart2 = echarts.init(select2);
    var option = {
        title: {
            text: Dynamic.search_ChartsR,
            left: 'center',
            textStyle: {
                color: "#737373"
            }
        },
        tooltip: {
            // trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        toolbox: {
            show: true,
            top: "8%",
            right: "15%",
            iconStyle: {
                normal: {
                    borderColor: '#737373'
                },
                emphasis: {
                    borderColor: '#737373'
                }
            },
            feature: {
                saveAsImage: {}
            }
        },
        color: ['#00628b', '#0089bb', '#32bbdb'],
        visualMap: {
            show: false,
            min: 0,
            max: data.pre_max,
            left: '5%',
            top: 'bottom',
            calculable: true,
            inRange: {
                color: ['#fff', '#00628b']
            },
            textStyle: {
                color: "#737373"
            }
        },
        series: [{
            name: Dynamic.search_charts_ask,
            type: 'map',
            mapType: (function(){
              return searchMap||mapType
            })(),
            data: data.city,
            top:(function(){
              return (searchMap||mapType)==="World"?'80px':'55px'
            })(),
            itemStyle: {
                normal: {
                    areaColor: '#fff',
                    borderColor: '#111',
                    textStyle: '#737373'
                },
                emphasis: {
                    areaColor: '#b2e4f6',
                    borderColor: '#737373',
                    borderWidth: 1
                }
            },
            label: {

                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    }
                }
            },
        }],
        roam: true,
    };
    _chart2.setOption(option);
    $(".searchCountrySelect").css("display","inline-block")
    addLoadEvent(_chart2.resize);
    // window.onresize = _chart2.resize;
}
