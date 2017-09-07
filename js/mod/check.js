define(["text!/tpl/check.html", "icheck"], function(html) {
    function render() {
        $(".page-content").html(html);
        $(function() {
            $.ajax({
                async: false,
                type: "get",
                dataType: "json",
                url: "/api/check.open",
                success: function(data) {
                    $("#dead").html(data.date);
                    $.each(data.combo, function(index) {
                    	var _tr ="<tr>";
                    	$.each(this, function(index) {
                           _tr+='<td>' + this + '</td>';
                        });
                    	_tr+="</tr>"
                        $(".billtable tbody").append(_tr);
                    });
                    $.each(data.bill, function(index) {
                        $(".topul2").eq(index).html(this);
                    });
                    $.each(data.check, function(index, values) {
                        var tr = $('<tr><td>' + values.payment + '</td><td>' + values.freshTime + '</td>' +
                            '<td><a href="javascript:void(0);" style="color:#678098!important">' + Dynamic.check_detail + '</a></td></tr>');
                        $(".check_table tbody").append(tr);
                    });

                }
            });
            $(document).ready(function() {
                var line = (275 - $(".checkhead").height() - $(".check_table thead tr").height()) / $(".check_table tbody tr").height();
                if ($(".check_table tbody tr").length > line) {
                    $(".check_table").css("overflow-y", "scroll");
                } else {
                    $(".check_table").css("overflow-y", "hidden");
                }
            });
            $(window).resize(function() {
                var line = (275 - $(".checkhead").height() - $(".check_table thead tr").height()) / $(".check_table tbody tr").height();
                if ($(".check_table tbody tr").length > line) {
                    $(".check_table").css("overflow-y", "scroll");
                } else {
                    $(".check_table").css("overflow-y", "hidden");
                }
            });
            $(".all_check").click(function() {
                if ($(".check_table tbody tr.active").length != $(".check_table tbody tr").length) {
                    $(".check_table tbody tr").addClass("active");
                } else {
                    $(".check_table tbody tr").removeClass("active");
                }
            });

            $(".mod2 .portlet-body .small").css("left", "0");
            changeLanguage("check");


            $("#level").click(function() {
                window.location.href = "#/package";
            });
            $(".check_table").delegate("a", "click", function(event) {
                event.stopPropagation();
                var billDate = $(this).parents("tr").children("td").eq(0).html();
                $("#dbox").children().not(".dbtop").remove();
                $(".mod2").hide();
                $(".mod1,.mod3").show();
                $("#m_print").show();
                $("#billtime").html(billDate);
                $.ajax({
                    async: true,
                    type: "get",
                    dataType: "json",
                    data: billDate,
                    url: "/api/check.open?cmd=WEL:SELECTPACKAGEBILLDETAIL&bill_date=" + billDate,
                    success: function(data) {
                        $.each(data.comp, function(index, values) {
                            $(".mod4 p").eq(index).html(values);
                        });
                        $.each(data.electric_check.table, function(index, values) {
                        	var _table=$(".tbbox>.tablebox").clone();
                        	var tr_s="";
                            $.each(this.table, function(index, values) {
	                            var tr = '<tr>' +
	                                '<td class="text-center">' + values.date + '</td>' +
	                                '<td class="text-center">' + values.newDataCont + '</td>' +
	                                '<td class="text-center">' + values.accumulative + '</td>' +
	                                '<td class="text-center">' + values.newOverCont + '</td>' +
	                                '<td class="text-center">' + values.source + '</td>' +
	                                '<td class="text-center">' + values.duration + '</td>' +
	                                '<td class="text-center">' + values.figure + '</td>' +
	                                '</tr>';
	                            tr_s += tr;
                            });
                            _table.find("tbody").html(tr_s);
                            _table.find(".titlee").html(this.title);
                            $.each(this.bottom, function(index) {
                            	_table.find(".dis2").eq(index).html(this);
                            });
                            $("#dbox").append(_table);
                        });
                        $("#dbox>.tablebox").show();
                    }
                });
            });
            //选中账单
            $(".check_table").delegate("tr", "click", function() {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
            });
            //账单下载
            $(".actions a:nth-of-type(2)").click(function() {
                var billDateList1 = [];
                if ($(".check_table tr.active").length === 0) {
                    swal({
                        title: Dynamic.check_check,
                        confirmButtonText: Dynamic.manage_sl_apply,
                    });
                    return false;
                }
                $(".check_table tr.active").each(function() {
                    billDateList1.push($(this).children("td").eq(0).html());
                });



                $.ajax({
                    async: true,
                    type: "post",
                    dataType: "json",
                    data: {
                        bill_date: billDateList1
                    },

                    url: "/api/check.open?cmd=WEL:DOWNLOADBILL",
                    success: function(data) { //请求成功后处理函数。
                        var PARAMS = {
                            initFileName: data.fileName
                        };
                        var temp = document.createElement("form");
                        temp.action = "DownLoadPDF";
                        temp.method = "post";
                        temp.style.display = "none";
                        for (var x in PARAMS) {
                            var opt = document.createElement("textarea");
                            opt.name = x;
                            opt.value = PARAMS[x];
                            temp.appendChild(opt);
                        }
                        document.body.appendChild(temp);
                        temp.submit();
                        return temp;
                    }
                });
            });


            //账单发送邮箱
            $(".actions a:nth-of-type(3)").click(function() {
                var billDateList2 = [];
                if ($(".check_table tr.active").length === 0) {
                    swal({
                        title: Dynamic.check_check,
                        confirmButtonText: Dynamic.manage_sl_apply,
                    });
                    return false;
                }
                $(".check_table tr.active").each(function() {
                    billDateList2.push($(this).children("td").eq(0).html());
                });
                var data = {
                    bill_date: billDateList2
                };
                $.post("/api/check.open?cmd=WEL:BILLSENDMAIL", data, function() {
                    swal({
                        title: Dynamic.check_send,
                        text: Dynamic.check_back,
                        confirmButtonText: Dynamic.manage_sl_apply,
                        type: "success",
                    });
                });
            });

            //账单打印
            $("#m_print").click(function() {
                var db_print = $("#billtime").html();
                $.ajax({
                    async: true,
                    type: "post",
                    dataType: "json",
                    url: "/api/check.open?cmd=WEL:PRINTBILLMAIL&bill_date=" + db_print,
                    success: function(data) { //请求成功后处理函数。
                        $("#printIframe").attr("src", "data/" + db_print + ".pdf");
                        setTimeout(function() {
                            $("#printIframe")[0].contentWindow.print();
                            $.ajax({
                                async: true,
                                type: "post",
                                dataType: "json",
                                url: "/api/check.open?cmd=WEL:DELETEPRINTPDF&bill_date=" + db_print
                            });
                        }, 100);
                    }
                });
            });
        });
    }
    return {
        render: render
    };
});
