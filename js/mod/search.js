define([
    "text!/tpl/search.html",
    "serchCharts",
    "icheck"
], function(html) {
    function render() {
        $(".page-content").html(html);
        var table_cont = [];
        var project_name = "";
        var loadcharts;
        changeLanguage("search");
        var eprojectID = sprojectID;
        sprojectID = "";
        if (roleType == 3) {
            eprojectID = projectID;
        }
        //日期选择
        var dtime = (function() {

            var daterange;
            var daterangeArr;
            var datarangeLocal;
            var weekStTime = (function() {
                if (moment().weekday() == 0) {
                    return moment().subtract(7, "d").weekday(1).startOf('day');
                } else {
                    return moment().weekday(1).startOf('day');
                }
            })();
            var weekEdTime = (function() {
                if (moment().weekday() == 0) {
                    return moment().subtract(7, "d").weekday(1).startOf('day').add(7, "d");
                } else {
                    return moment().weekday(1).startOf('day').add(7, "d");
                }
            })();
            var dateRangePickerStartTime = (function() {
                return moment().startOf('day');
            })();
            var dateRangePickerEndTime = (function() {
                return moment().add(1, "d").startOf('day');
            })();
            if (localStorage.getItem("language") == "zh") {
                daterange = {
                    "今日": [
                        moment().startOf('day'),
                        moment().add(1, "d").startOf('day')
                    ],
                    "昨日": [moment().subtract('days', 1).startOf('day'), moment().startOf('day')],
                    "本周": [
                        weekStTime,
                        weekEdTime
                    ],
                    "本月": [
                        moment().startOf('month'),
                        moment().add(1, "M").startOf('month')
                    ],
                    "本年": [
                        moment().startOf('year'),
                        moment().add(1, "years").startOf('year')
                    ]
                };
                daterangeArr = ['今日', '昨日', '本周', '本月', '本年'];
                datarangeLocal = {
                    applyLabel: '确定',
                    cancelLabel: '关闭',
                    customRangeLabel: "自定义日期",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                };
            } else {
                daterange = {
                    "Today": [
                        moment().startOf('day'),
                        moment().add(1, "d").startOf('day')
                    ],
                    "Yesterday": [moment().subtract('days', 1).startOf('day'), moment().startOf('day')],
                    "This Week": [
                        weekStTime,
                        weekEdTime
                    ],
                    "This Month": [
                        moment().startOf('month'),
                        moment().add(1, "M").startOf('month')
                    ],
                    "This Year": [
                        moment().startOf('year'),
                        moment().add(1, "years").startOf('year')
                    ]
                };
                daterangeArr = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Year', 'Custom Range'];
                datarangeLocal = {
                    customRangeLabel: "Custom Range"
                };
            }
            $("#reportrange>span").html(daterangeArr[0] + "&nbsp;" + (new Date).Format('yyyy-MM-dd') + " - " + (new Date).add("d", +1).Format('yyyy-MM-dd'));
            $("#start").html(dateRangePickerStartTime.format('YYYY-MM-DD HH:mm:ss'));
            $("#end").html(dateRangePickerEndTime.format('YYYY-MM-DD HH:mm:ss'));
            $('#reportrange').daterangepicker({
                "ranges": daterange,
                "startDate": dateRangePickerStartTime,
                "endDate": dateRangePickerEndTime,
                locale: datarangeLocal,
                "timePicker": true,
                "timePicker24Hour": true
            }, function(start, end, label) {
                var customStartTime = start.format('YYYYMMDDHHmm');
                var customEndTime = end.format('YYYYMMDDHHmm');
                if (label == "自定义日期" || label == "Custom Range") {
                    $("#reportrange>span").html(start.format('YYYY-MM-DD HH:mm') + ' - ' + end.format('YYYY-MM-DD HH:mm'));
                } else {
                    $("#reportrange>span").html(label + "&nbsp;" + start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
                }
                if (label == daterangeArr[0] || label == daterangeArr[1]) {
                    interval = "day";
                } else if (label == daterangeArr[2]) {
                    interval = "week";
                } else if (label == daterangeArr[3]) {
                    interval = "oneMonth";
                } else if (label == daterangeArr[4]) {
                    interval = "year";
                }
                $("#start").html(start.format('YYYY-MM-DD HH:mm:ss'));
                $("#end").html(end.format('YYYY-MM-DD HH:mm:ss'));
            });
        })();
        //选择项目初始化
        $('#pro_choose').selectpicker({
            width: "100px",
            title: Dynamic.search_select,
            size: 10
        });
        //获取项目及文件ID
        $.ajax({
            async: true,
            type: "post",
            dataType: "json", //返回json格式
            url: "/api/project.open?cmd=WEL:GETPROJECTINSTATUSONE",
            data: {
                roleId: roleID
            },
            success: function(data) { //请求成功后处理函数。
                $.each(data, function(index, values) { // 解析出data对应的Object数组
                    var ffi = values.fileid;
                    var op = $("<option value='" + values.name + "' data-fileid='" + ffi + "' data-id='" + values.id + "'>" + values.name + "</div>");
                    $("#pro_choose").append(op);
                });
                $("#pro_choose").selectpicker('render');
                $("#pro_choose").selectpicker('refresh');
                if ($('#pro_choose option').length == 1) {
                    return false;
                }
                if (eprojectID && eprojectID !== "") {
                    var proA = $("#pro_choose option[data-id='" + eprojectID + "']").val();
                    $('#pro_choose').selectpicker('val', proA);
                    project_name = proA;
                    var ddd = $("#pro_choose option[data-id='" + eprojectID + "']").attr("data-fileid");
                    dataID = ddd.split(",");
                } else {
                    var proB = $("#pro_choose option:nth-of-type(2)").val();
                    project_name = proB;
                    $('#pro_choose').selectpicker('val', proB);
                    var fff = $("#pro_choose option:nth-of-type(2)").attr("data-fileid");
                    dataID = fff.split(",");
                    eprojectID = $("#pro_choose option:nth-of-type(2)").attr("data-id");
                }
                //从监控仪表盘跳转直接搜索
                var search_id = localStorage.getItem("SEARCH_PID");
                var search_key = localStorage.getItem("SEARCH_KEY");
                if (search_id && search_key && search_id !== "" && search_key !== "") {
                    localStorage.setItem("SEARCH_PID", "");
                    localStorage.setItem("SEARCH_KEY", "");
                    $("#txt").val(search_key);
                    var _pro = $("#pro_choose option[data-id='" + search_id + "']").val();
                    $('#pro_choose').selectpicker('val', _pro);
                    project_name = _pro;
                    var _ddd = $("#pro_choose option[data-id='" + search_id + "']").attr("data-fileid");
                    dataID = _ddd.split(",");
                    var _startT = $("#start").text();
                    var _endT = $("#end").text();
                    var _laydateTime = _startT + "~" + _endT;
                    addTab(search_key, _startT, _endT, _laydateTime, "");
                }

            },
            error: function() { //请求失败处理函数
                $('#pro_choose').selectpicker({
                    width: "100px",
                    title: Dynamic.search_select,
                    size: 10
                });
            }
        });

        //获取热搜词z
        $.ajax({
            async: true,
            type: "post",
            //dataType: "json", //返回json格式
            url: "/api/serch.open?cmd=WEL:SELECTTERMS",
            data: {},
            success: function(data) { //请求成功后处理函数。
                $.each(data, function() {
                    $(".mid_znssH1Span3").append('<span class="keyword" title="' + this + '">' + this + '</span>');
                });
            }
        });

        //删除input框内的内容,
        $(".searchinfo").on("focus", function() {
            $(".mid_znssHP1 i").css("display", "block");
            $(".mid_znssHP1 i").on("click", function() {
                $(".mid_znssHP1 input").val("");
                $("#append li").remove();
                $("#append").hide();
                $(this).hide();
            });
        });
        //搜索框失去焦点
        $(".searchinfo").on("blur", function() {
            if ($(".mid_znssHP1 input").val() === "") {
                $(".mid_znssHP1 i").hide();
            }
        });
        //展开查看
        $(".znss2-rightM").delegate(".shou_fang", "click", function() {
            var shouP = $(this).next(".topIp");
            if (shouP.attr("class") == "topIp topIp_hide") {
                shouP.attr("class", "topIp topIp_show");
                $(this).next().children(".topIpdiv").attr("class", "topIpdiv topIpdiv_show");
                $(this).css("transform", "rotate(180deg)");
            } else {
                shouP.attr("class", "topIp topIp_hide");
                $(this).next().children(".topIpdiv").attr("class", "topIpdiv topIpdiv_hide");
                $(this).css("transform", "rotate(0deg)");
            }
        });

        //模糊搜索及搜索框下拉菜单
        $(function() {
            var tedata = "";
            var data = [];
            $("#txt").on("keyup", function() {
                $.ajax({
                    url: "/api/serch.open?cmd=WEL:SELECTTERMSLIST",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    success: function(data1) {
                        data = data1;
                    }
                });
            });
            $(".mid_znssH").click(function(event) {
                event.stopPropagation();
            });
            $("body").not(".mid_znssH").click(function() {
                $("#txt").blur();
                $("#append").hide().html("");
            });
            if (Search == 0) {
                $("body").bind("keydown", function(e) {
                    if (location.hash == "#/search") {
                        e = e || window.event;
                        var keycode = e.which ? e.which : e.keyCode;
                        if (keycode == 38 && $("#append").html() !== "") {
                            movePrev();
                        } else if (keycode == 40 && $("#append").html() !== "") {
                            $("#txt").blur();
                            if ($(".item").hasClass("addbg")) {
                                moveNext();
                            } else {
                                $(".item").removeClass('addbg').eq(0).addClass('addbg');
                            }
                        } else if (keycode == 13) {
                            if ($(".addbg").length !== 0) {
                                dojob();
                            } else {
                                var searchVal = $(".searchinfo").val();
                                var _startT = $("#start").text();
                                var _endT = $("#end").text();
                                var laydateTime = _startT + "~" + _endT;
                                if (searchVal === "") {
                                    return false;
                                }
                                addTab(searchVal, _startT, _endT, laydateTime, "");
                            }
                        }
                    }
                });
                Search = 1;
            }
            var movePrev = function() {
                $("#txt").blur();
                $("body").css("overflow-y", "hidden");
                var index = $(".addbg").prevAll().length;
                var sindex = $(".item").length - index;
                if (index === 0) {
                    $(".item").removeClass('addbg').eq($(".item").length - 1).addClass('addbg');
                    $("#append").scrollTop(100000);
                } else {
                    $(".item").removeClass('addbg').eq(index - 1).addClass('addbg');
                    if ((index + 1) % 10 == 1) {
                        if (sindex < 10) {
                            $("#append").scrollTop($("#append").scrollTop() - 30 * (($(".item").length) % 10));
                        } else {
                            $("#append").scrollTop($("#append").scrollTop() - 300);
                        }
                    }
                }

            };
            var moveNext = function() {
                $("body").css("overflow-y", "hidden");
                var index = $(".addbg").prevAll().length;
                if (index == $(".item").length - 1) {
                    $(".item").removeClass('addbg').eq(0).addClass('addbg');
                    $("#append").scrollTop(0);
                } else {
                    $(".item").removeClass('addbg').eq(index + 1).addClass('addbg');
                }
                if ((index + 1) % 10 === 0 && index !== 0) {
                    $("#append").scrollTop($("#append").scrollTop() + 300);
                }
            };
            var dojob = function() {
                $("#txt").blur();
                var value = $(".addbg").text();
                $("#txt").val(value);
                $("#append").hide().html("");
                $("body").css("overflow-y", "scroll");
            };
            $("#txt").on("keyup", function() {
                getContent($(this));
            });
            $(".item").on('mouseenter', function() {
                getFocus(this);
            });
            $(".item").on("click", function() {
                getCon(this);
            });

            function getContent(obj) {
                var txt = jQuery.trim($(obj).val());
                if (txt === "") {
                    $("#append").hide().html("");
                    return false;
                }
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    if (data[i].indexOf(txt) >= 0) {
                        html = html + "<li class='item'>" + data[i] + "</li>";
                    }
                }
                if (html !== "") {
                    $("#append").show().html(html);
                    $("#append li").on("click", function() {
                        $(".mid_znssHP1 input").val($(this).text());
                        $("#append").hide().html("");
                    });
                } else {
                    $("#append").hide().html("");
                }
            }

            function getFocus(obj) {
                $(".item").removeClass("addbg");
                $(obj).addClass("addbg");
            }

            function getCon(obj) {
                var value = $(obj).text();
                $("#txt").val(value);
                $("#txt").blur();
                $("#append").hide().html("");
            }
        });

        //tab添加table\echarts添加
        function addTab(searchVal, _startT, _endT, laydateTime, last_searchVal) {
            if (project_name == undefined || eprojectID == 0 || dataID.length == 0) {
                swal({
                    title: Dynamic.search_select,
                    confirmButtonText: Dynamic.search_ok,
                });
                return false;
            }
            var twoVal = "";
            if (last_searchVal === "") {
                twoVal = searchVal;
            } else {
                twoVal = last_searchVal + "," + searchVal;
            }
            var tcnum = eprojectID + twoVal + laydateTime;
            if (table_cont.indexOf(tcnum) != -1) {
                setTimeout(function() {
                    swal({
                        title: Dynamic.search_sl_feat,
                        confirmButtonText: Dynamic.search_ok,
                    });
                }, 10);
                return false;
            }

            $("#txt").blur();
            $("#append").hide().html("");
            $(".serchE").prop("disabled", false);
            $("#createmission").prop("disabled", false);
            $("body").css("overflow-y", "scroll");
            $(".box2").show();
            loadcharts = echarts.init(document.getElementById("loadbox"));
            loadcharts.showLoading({
                text: 'loading',
                color: '#678098',
                textColor: '#678098',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0
            });
            if ($(".znss2-rightH div").length == 6) {
                $(".znss2-rightH>div:first-of-type").remove();
                $(".znss2-rightM>div:nth-of-type(1),.znss2-rightM>div:nth-of-type(2)").remove();
                table_cont.shift();
            }
            var echarts1 = {};
            var newTab = $(".tabinfo div").clone();
            var newtable = $(".tableinfo .tablex").clone();
            var newCharts = $(".tableinfo .end_znss1").clone();
            newTab.find("span").html(eprojectID + twoVal + laydateTime);
            newTab.find("b").html(twoVal);
            newTab.attr({
                "title": Dynamic.search_project + project_name + '\n' + Dynamic.search_keyword + twoVal + '\n' + Dynamic.search_time + laydateTime,
                "name": twoVal,
                "data-pid": eprojectID,
                "data-pname": project_name,
                "data-start": _startT,
                "data-end": _endT
            });
            newCharts.attr("name", eprojectID + twoVal + laydateTime);
            newtable.find(".tableSave").bind("click", table_save);
            table_cont.push(tcnum);
            $(".znss2-rightH div").attr("class", "qhfalse");

            // add new tab and related content
            $(".znss2-rightH").append(newTab);
            $(".znss2-rightM").append(newCharts);
            $(".znss2-rightM").append(newtable);
            $(".end_znss1").hide();
            $(".tablex").hide();
            //切换地域
            $(".region-select").undelegate();
            $(".region-select").delegate("a","click",function(){
              //封装请求参数
              var txtVal=$(".qhtrue",$(this).parents(".znss2-rightM").prev()).attr("name")
              var searchCountry=$(this).attr("data-value");
              var param = {
                  start_time: _startT,
                  end_time: _endT,
                  fid: dataID, //文件ID
                  product:'campass',
                  project_id:eprojectID,
                  txt: txtVal,
                  country: searchCountry==="World"?"":"China",
                  timezone:timeZone
              };

              var echartsDom=$(this).parents('.searchCountrySelect').prev()[0];
              var _chart2 = echarts.init(echartsDom)
              _chart2.showLoading(loadingObj);
              $(".searchCountrySelect").css("display","none")
              registMap(searchCountry)
              //ajax请求数据
              $.ajax({
                  type: "GET",
                  async: true,
                  url: "/api/serch.open?cmd=WEL:CHINESEANDENGLIShHMAP",
                  cache: false,
                  data: param,
                  dataType: "json",
                  success: function(data) {
                    var _aa = [];
                    for (var i = 0; i < data.city.length; i++) {
                        _aa.push(data.city[i].value);
                    }
                    var pre_data = Math.max.apply(null, _aa);
                    pre_data == 0 ? pre_data = 1000 : pre_data = Math.max.apply(null, _aa);
                    var newData={
                      city:data.city,
                      pre_max:pre_data
                    }
                      echartsInit2(newData,echartsDom,searchCountry)
                  }
              });
            })
            //表格动态渲染
            setTimeout(function() {
                var table1 = newtable.find(".tableSort").dataTable({
                    "language": Lang,
                    "autoWidth": false,
                    "paging": true,
                    "lengthChange": true,
                    "searching": false,
                    "ordering": false,
                    "processing": true, //加载数据时显示正在加载信息
                    "serverSide": true, //指定从服务器端获取数据
                    "pagingType": "full_numbers", //翻页界面类型
                    "deferRender": true,
                    "ajax": function(data, callback, settings) {
                        //封装请求参数
                        var param = {
                            start_time: _startT,
                            end_time: _endT,
                            // start_time: moment(moment(_startT).add("h",((new Date()).getTimezoneOffset() / 60))).format("YYYY-MM-DD HH:mm:ss"),
                            // end_time: moment(moment(_endT).add("h",((new Date()).getTimezoneOffset() / 60))).format("YYYY-MM-DD HH:mm:ss"),
                            fid: dataID, //文件ID
                            limit: data.length, //页面显示记录条数，在页面显示每页显示多少项的时候
                            //start: data.start, //开始的记录序号
                            page: (data.start / data.length) + 1, //当前页码
                            product:'campass',
                            project_id:eprojectID,
                            txt: twoVal,
                            country: mapType=="World"?"":mapType,
                            timezone:timeZone
                        };
                        //ajax请求数据
                        $.ajax({
                            type: "GET",
                            async: true,
                            url: "/api/serch.open",
                            cache: false,
                            data: param,
                            dataType: "json",
                            success: function(result) {
                                    //封装返回数据
                                var returnData = {};
                                returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                                returnData.recordsTotal = result.total; //返回数据全部记录
                                returnData.recordsFiltered = result.total; //后台不实现过滤功能，每次查询均视作全部结果
                                returnData.data = result.data; //返回的数据列表
                                returnData.charts1 = result.percent;
                                returnData.charts2 = result.order;
                                returnData.charts3 = result.city;
                                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                                callback(returnData);
                            }
                        });
                    },
                    "columns": [{
                        "data": "order"
                    }, {
                        "data": "datatime"
                    }, {
                        "data": "message",
                        "render": function(data) {
                            var wid = $(".contentDiv").width() - 300;
                            var lastTd = '<i class="shou_fang"></i><div class="topIp topIp_hide" style="width:' + wid + 'px"><div class="topIpdiv topIpdiv_hide">' + data + '</div></div>';
                            return lastTd;
                        }
                    }],
                    "initComplete": function(settings, json) {
                        $("tr>td:last-of-type").css("padding", "8px 0");
                        echarts1 = {
                            percent: json.charts1,
                            order: json.charts2,
                            city: json.charts3
                        };
                        //图表
                        var widt1, widt2;
                        if ($(window).width() < 970) {
                            widt1 = $(".contentDiv").width() - 50;
                            widt2 = $(".contentDiv").width() - 50;
                        } else {
                            widt1 = $(".contentDiv").width() * 0.6;
                            widt2 = $(".contentDiv").width() * 0.4;
                        }
                        $(".chart1").width(widt1);
                        $(".chart2").width(widt2);
                        var _city = echarts1.city;
                        var _aa = [];
                        for (var i = 0; i < _city.length; i++) {
                            _aa.push(_city[i].value);
                        }
                        var pre_data = Math.max.apply(null, _aa);
                        pre_data == 0 ? pre_data = 1000 : pre_data = Math.max.apply(null, _aa);
                        var select1 = document.getElementsByName(eprojectID + twoVal + laydateTime)[0].childNodes[1].childNodes[1].childNodes[1];
                        var select2 = document.getElementsByName(eprojectID + twoVal + laydateTime)[0].childNodes[1].childNodes[3].childNodes[1];
                        var data = {
                            percent: echarts1.percent,
                            order: echarts1.order,
                            city: _city,
                            pre_max: pre_data
                        };
                        echartsInit1(data, select1);
                        echartsInit2(data, select2);
                        newCharts.fadeIn(350);
                        newtable.fadeIn(350);
                        loadcharts.hideLoading();
                        $(".box2").hide();
                    },
                }).api();
            }, 100);
        }

        //选择项目
        $("#pro_choose").change(function() {
            var faa = $("#pro_choose").find("option:selected").attr("data-fileid");
            dataID = faa.split(",");
            eprojectID = $("#pro_choose").find("option:selected").attr("data-id");
            project_name = $("#pro_choose").find("option:selected").val();
            $(".serchE").prop("disabled", true);
        });

        //热搜词
        $(".mid_znssH1Span3").delegate(".keyword", "click", function() {
            $("#append").hide().html("");
            $("#txt").val($(this).html());
            var searchVal = $(this).html();
            var _startT = $("#start").text();
            var _endT = $("#end").text();
            var laydateTime = _startT + "~" + _endT;
            addTab(searchVal, _startT, _endT, laydateTime, "");
        });
        //搜索
        $(".serchC").click(function() {
            $("#append").hide().html("");
            var searchVal = $(".searchinfo").val();
            var _startT = $("#start").text();
            var _endT = $("#end").text();
            var laydateTime = _startT + "~" + _endT;
            if (searchVal === "") {
                swal({
                    title: Dynamic.search_sl_pleasew,
                    confirmButtonText: Dynamic.search_ok,
                });
                return false;
            }
            addTab(searchVal, _startT, _endT, laydateTime, "");
        });
        //在结果中搜索
        $(".serchE").click(function() {
            $("#append").hide().html("");
            var last_searchVal = $(".qhtrue").attr("name");
            if (last_searchVal != undefined) {
                $(".serchE").prop("disabled", false);
            } else {
                $(".serchE").prop("disabled", true);
            }
            var searchVal = $(".searchinfo").val();
            var _startT = $(".qhtrue").attr("data-start");
            var _endT = $(".qhtrue").attr("data-end");
            var laydateTime = _startT + "~" + _endT;
            if (searchVal == last_searchVal || searchVal === "") {
                return false;
            }
            addTab(searchVal, _startT, _endT, laydateTime, last_searchVal);
        });
        //tab添加删除与切换
        //tab切换
        $(".znss2-rightH").delegate("div", "click", function() {
            var tabName = $(this).find("span").html();
            $(".znss2-rightH div").attr("class", "qhfalse");
            $(".end_znss1").hide();
            $(".tablex").hide();
            $(this).attr("class", "qhtrue");
            $(".end_znss1:eq(" + $.inArray(tabName, table_cont) + ")").show();
            $(".tablex:eq(" + $.inArray(tabName, table_cont) + ")").show();
        });
        //tab删除
        $(".znss2-rightH").delegate("i", "click", function(event) {
            event.stopPropagation();
            // Get the tab name
            var tabid = $(this).parent().children("span").html();

            // remove tab and related content
            if ($(this).parents(".znss2-rightH").find("div").length == 1) {
                $(".serchE").prop("disabled", true);
                $("#createmission").prop("disabled", true);
            }
            $(".end_znss1[name='" + tabid + "']").remove();
            $(".tablex:eq(" + $.inArray(tabid, table_cont) + ")").remove();
            $(this).parent().remove();
            table_cont.splice($.inArray(tabid, table_cont), 1);
            if ($(".znss2-rightH div.qhtrue").length === 0 && $(".znss2-rightH div").length > 0) {
                $(".znss2-rightH div:last-of-type").attr("class", "qhtrue");
                var lasttabid = $(".znss2-rightH div:last-of-type").find("span").html();
                $(".end_znss1:eq(" + $.inArray(lasttabid, table_cont) + ")").show();
                $(".tablex:eq(" + $.inArray(lasttabid, table_cont) + ")").show();
            }
        });

        //表格内容保存
        function table_save() {
            var p_data = {
                pname: $(".qhtrue").attr("data-pname"),
                fid: dataID, //文件ID
                text: $(".qhtrue").attr("name"),
                start_time: $(".qhtrue").attr("data-start"),
                product:'campass',
                project_id:projectID,
                end_time: $(".qhtrue").attr("data-end"),
                os_type: isMac()?"mac":"",
                timezone:timeZone
            };
            $.ajax({
                async: true,
                cache: false,
                type: "post",
                //dataType: "json", //返回json格式
                url: "/api/serch.open?cmd=WEL:EXPORTEXCEL",
                data: p_data,
                success: function(data) { //请求成功后处理函数。
                    $("#export_excel").submit();
                }
            });
            $(this).removeClass("purple");
            $(this).prop('disabled', "true");
        }

        //设置监控任务
        $('#toEmail').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            increaseArea: '10%' // optional
        });
        $("#createmission").click(function() {
            function getNowFormatDate() {
                var date = new Date();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + "-" + month + "-" + strDate;
                return currentdate;
            }
            $("#pone>span").html($(".qhtrue").attr("name"));
            $("#ptwo>span").html($(".qhtrue").attr("data-pname"));
            $("#ptwo>span").attr("data-id", $(".qhtrue").attr("data-pid"));
            $("#pfive>span").html(getNowFormatDate());

        });
        //频率与范围的限制
        $("#freq1").change(function() {
            var f1 = $(this).find("option:selected").val();
            if (f1 == 1) {
                $(".frechoose1").attr("max", "59");
            } else if (f1 == 60) {
                $(".frechoose1").attr("max", "23");
            } else {
                $(".frechoose1").removeAttr("max");
            }
        });
        $("#freq2").change(function() {
            var f2 = $(this).find("option:selected").val();
            if (f2 == 1) {
                $(".frechoose2").attr("max", "59");
            } else if (f2 == 60) {
                $(".frechoose2").attr("max", "23");
            } else {
                $(".frechoose2").removeAttr("max");
            }
        });
        $(".frechoose1").on("keyup", function() {
            var ris1 = $("#freq1").find("option:selected").val();
            var lev1 = $(this).val();
            if (ris1 == 1 && lev1 > 59) {
                $(this).val(59);
            } else if (ris1 == 60 && lev1 > 23) {
                $(this).val(23);
            }
        });
        $(".frechoose2").on("keyup", function() {
            var ris2 = $("#freq2").find("option:selected").val();
            var lev2 = $(this).val();
            if (ris2 == 1 && lev2 > 59) {
                $(this).val(59);
            } else if (ris2 == 60 && lev2 > 23) {
                $(this).val(23);
            }
        });
        //邮箱阀值
        $('#toEmail').on("ifChecked", function() {
            $("#emailadd").prop("readonly", false);
            $("#freq3").prop("disabled", false);
            $("#threshold").prop("readonly", false);
        });
        $('#toEmail').on("ifUnchecked", function() {
            $("#emailadd").prop("readonly", true);
            $("#freq3").prop("disabled", true);
            $("#threshold").prop("readonly", true);
        });
        //提交监控任务
        var l = Ladda.create(document.getElementById("mission_sumb"));
        $("#mission_sumb").click(function() {
            l.start();
            var _frequency = $(".frechoose1").val() * $("#freq1 option:selected").val();
            var _range = $(".frechoose2").val() * $("#freq2 option:selected").val();
            var pData = {
                project_id: $("#ptwo>span").attr("data-id"),
                product:'campass',
                key_word: $("#pone>span").html(),
                frequency: _frequency,
                range: _range,
                threshold: $("#threshold").val(),
                email: $("#emailadd").val(),
                alarm_exp: $("#freq3 option:selected").val(),
                time_units: $("#freq1 option:selected").attr("data-unit"),
                range_units: $("#freq2 option:selected").attr("data-unit")
            };
            $.ajax({
                type: "post",
                url: "/api/monitortask.open?cmd=WEL:INSERTMONITORTASK",
                data: pData,
                success: function(data) {
                    l.stop();
                    swal({
                        title: Dynamic.manage_sl_savasuccess,
                        confirmButtonText: Dynamic.home_ok,
                        type: "success",
                    }, function() {
                        $('#missionModal').modal('hide');
                    });
                },error: function(){
                    l.stop();
                    swal({
                        title: Dynamic.manage_sl_savefalse,
                        confirmButtonText: Dynamic.home_ok,
                        type: "error",
                    })
                }
            });
        });

        //
        $(window).resize(function() {
            $(".topIp").width($(".contentDiv").width() - 300);
            if ($(window).width() < 970) {
                $(".chart1").width($(".contentDiv").width() - 50);
                $(".chart2").width($(".contentDiv").width() - 50);
            } else {
                $(".chart1").width($(".contentDiv").width() * 0.6);
                $(".chart2").width($(".contentDiv").width() * 0.4);
            }
        });
    }
    return {
        render: render
    };
});
