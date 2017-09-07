define([
    "text!/tpl/emonitor.html",
    "chart",
    'css!/css/emonitor.css'
], function(html, chart) {
    function render() {
        //HTML节点注入section中
        $(".page-content").html(html);
        changeLanguage("emonitor");
        $('.chartablebox').scrollUnique();
        var charTable;
        var mon_id = "",
            mon_pro = "",
            mon_key = "",
            mon_freq = "",
            mon_range = "",
            mon_creat = "";
        var mes = localStorage.getItem("MESEARCH");
        localStorage.setItem("MESEARCH", "");
        $("#linecharts").width($(".chartbox").width() - 40).height(250);
        var monChart = new chart.Chart($("#linecharts"), {
            type: 'lineplot',
            legend: false,
            showTitle: false,
            toolboxType: 'basic',
            title: Dynamic.homeCharts_title17
        });
        monChart.showLoading();
        window.onresize = function() {
            $("#linecharts").width($(".chartbox").width() - 40);
            monChart.resize();
        };
        //dom填充
        var titleFit = function() {
            $(".sname").html(mon_pro);
            $(".skey").html(mon_key);
            $(".sfreq").html(mon_freq);
            $(".srange").html(mon_range);
            $(".screat").html(mon_creat);
        };
        //任务信息获取
        var getInfo = function(item) {
            mon_id = item.attr("data-id");
            mon_pro = item.attr("data-pro");
            mon_key = item.attr("data-key");
            mon_freq = item.attr("data-fre");
            mon_range = item.attr("data-range");
            mon_creat = item.attr("data-creat");
        };
        //任务趋势获取
        var getTask = function(m_id) {
        	//table
            charTable = $("#chartable").dataTable({
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
                        pageSize: data.length, //页面显示记录条数，在页面显示每页显示多少项的时候
                        //start: data.start, //开始的记录序号
                        currentPage: (data.start / data.length) + 1, //当前页码
                        monitor_id: m_id
                    };
                    monChart.showLoading();
                    //ajax请求数据
                    $.ajax({
                        type: "GET",
                        async: true,
                        data: param,
                        url: "/api/monitortask.open?cmd=WEL:GETMONITORTASKLIST",
                        dataType: "json",
                        success: function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.count; //返回数据全部记录
                            returnData.recordsFiltered = result.count; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.datadetail; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                            //chart
                            var xside = [];
                            var yside = [];
                            $.each(returnData.data, function(index) {
                                xside.push(this.input_date);
                                yside.push(this.data_count);
                            });
                            //                    var select = document.getElementById("linecharts");
                            var chartData = {
                                xAxis: {
                                    "name": /*Dynamic.search_charts_time_*/ "",
                                    "data": xside
                                },
                                yAxis: {},
                                series: [{
                                    "name": Dynamic.emonitor_yside,
                                    "data": yside
                                }]
                            };
                            monChart.injectData(chartData);
                            monChart.hideLoading();
                        }
                    });
                },
                "columns": [{
                    "data": "start_date"
                }, {
                    "data": "end_date"
                }, {
                    "data": "data_count"
                }],
                "initComplete": function(settings, json) {
                    
                }
            }).api();
        	//chart
            /*monChart.showLoading();
            $.ajax({
                async: true,
                type: "GET",
                dataType: "json",
                data: {
                    monitor_id: m_id
                },
                url: "/api/monitortask.open?cmd=WEL:GETBYPROJECTIDQUERYTASK",
                success: function(data) {
                    //chart
                    var xside = [];
                    var yside = [];
                    $.each(data, function(index) {
                        xside.push(this.input_date);
                        yside.push(this.data_count);
                    });
                    //                    var select = document.getElementById("linecharts");
                    var chartData = {
                        xAxis: {
                            "data": xside
                        },
                        yAxis: {},
                        series: [{
                            "name": Dynamic.emonitor_yside,
                            "data": yside
                        }]
                    };
                    monChart.injectData(chartData);
                    monChart.hideLoading();

                }
            });*/

        };
        //频率格式转换
        var mintoday = function(frequency, units) {
            var _freq;
            if (units == "MM") {
                _freq = frequency + Dynamic.emonitor_t_s;
            } else if (units == "HH") {
                _freq = frequency / 60 + Dynamic.emonitor_t_h;
            } else if (units == "DD") {
                _freq = frequency / 1440 + Dynamic.emonitor_t_d;
            } else if (units == "WW") {
                _freq = frequency / 10080 + Dynamic.emonitor_t_w;
            }
            return _freq;
        };
        //删除后的项目列表刷新
        var resetPro = function() {
        	$('#selectD').selectpicker('destroy');
        	$('#selectD').find("option").remove();
        	$.ajax({
                type: "get",
                async: "true",
                url: "/api/monitortask.open?cmd=WEL:GETALLMONITORTASK",
                success: function(data) {
                	var _app="";
                    for (var i = 0; i < data.length; i++) {
                        var _fre = mintoday(data[i].frequency, data[i].time_units);
                        var _range = mintoday(data[i].range, data[i].range_units);
                        _app+="<option data-id='" + data[i].id + "' data-pro='" + data[i].project_name + "' data-key='" + data[i].key_word + "' data-fre='" + _fre + "' data-range='" + _range + "' data-creat='" + data[i].input_date + "'>" + data[i].project_name + "--" + data[i].key_word + "--" + Dynamic.emonitor_fre + "：" + _fre + "</option>";
                    }
                    $("#selectD").append(_app);
                    $('#selectD').selectpicker({
                        width: "auto",
                        title: Dynamic.search_select,
                        size: 10,
                    });
                	var proC = $("#selectD option:nth-of-type(2)");
                    $('#selectD').selectpicker('val', proC.html());
                    getInfo(proC);
                    charTable.destroy();
                    $("#chartable tbody tr").remove();
                    getTask(mon_id);
                    titleFit();
                }
            });
        };
        //选择项目与页面初始化与任务切换、任务删除
        var getPage = function() {
        	$('#selectD').selectpicker({
                width: "auto",
                title: Dynamic.search_select,
                size: 10,
            });
            $.ajax({
                type: "get",
                async: "true",
                url: "/api/monitortask.open?cmd=WEL:GETALLMONITORTASK",
                success: function(data) {
                	var _app="";
                    for (var i = 0; i < data.length; i++) {
                        var _fre = mintoday(data[i].frequency, data[i].time_units);
                        var _range = mintoday(data[i].range, data[i].range_units);
                        _app+="<option data-id='" + data[i].id + "' data-pro='" + data[i].project_name + "' data-key='" + data[i].key_word + "' data-fre='" + _fre + "' data-range='" + _range + "' data-creat='" + data[i].input_date + "'>" + data[i].project_name + "--" + data[i].key_word + "--" + Dynamic.emonitor_fre + "：" + _fre + "</option>";
                    }
                    $("#selectD").append(_app);
                    $("#selectD").selectpicker('render');
                    $("#selectD").selectpicker('refresh');
                	if (mes === "" || mes == null) {
                        var proB = $("#selectD option:nth-of-type(2)");
                        $('#selectD').selectpicker('val', proB.html());
                        getInfo(proB);

                    } else {
                        var proA = $("#selectD option[data-id='" + mes + "']");
                        $('#selectD').selectpicker('val', proA.html());
                        getInfo(proA);
                    }
                    getTask(mon_id);
                    titleFit();
                }
            });
            //切换
            $('#selectD').on("change", function() {
                var _mon = $(this).find("option:selected");
                getInfo(_mon);
                charTable.destroy();
                $("#chartable tbody tr").remove();
                getTask(mon_id);
                titleFit();
            });
            //删除
            $("#delmiss").on("click", function() {
                swal({
                        title: Dynamic.home_delete,
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: Dynamic.home_ok,
                        cancelButtonText: Dynamic.home_cancel,
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    },
                    function() {
                        $.ajax({
                            type: "post",
                            url: "/api/monitortask.open?cmd=WEL:DELETEMONITORTASK",
                            data: {
                                monitor_id: mon_id
                            },
                            success: function() {
                                swal({
                                    title: Dynamic.home_deletesuc,
                                    confirmButtonText: Dynamic.home_ok,
                                    type: "success",
                                }, function() {
                                    resetPro();
                                });
                            },
                            error: function() { // 请求失败处理函数
                                console.log(Dynamic.strings_senderror);
                            }
                        });
                    });
            });
            //CSV导出
            $("#downloadcsv").on("click", function() {
                window.location.href = "/api/download.open?cmd=WEL:REPORTESONLYCSV&monitor_id=" + mon_id + "&os_type=" + (isMac()?"mac":"");
            });
        };
        getPage();
    }
    return {
        render: render
    };
});
