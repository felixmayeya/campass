define(["text!/tpl/recycle.html", "icheck"], function(html) {
    function render() {
        $(".page-content").html(html);
        var table;
        var pro_type = ["", Dynamic.manage_type1, Dynamic.manage_type2];
        $(function() {

            d_table();
            $('#rec').on('draw.dt', function() {
                $('table input[type="checkbox"]').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    increaseArea: '20%' // optional
                });
                var selectall2 = $("tbody input[type='checkbox']").not("input[name='nopro']");
                var check2 = $(".allsel");
                check2.on("ifChecked", function() {
                    selectall2.iCheck('check');
                });
                check2.on("ifUnchecked", function() {
                    selectall2.iCheck('uncheck');
                });
                if ($("#rec_wrapper").width() < 1120) {
                    $("#rec_wrapper").css("overflow-x", "scroll");
                } else {
                    $("#rec_wrapper").css("overflow-x", "visible");
                }
            });
            $(window).resize(function() {
                if ($("#rec_wrapper").width() < 1120) {
                    $("#rec_wrapper").css("overflow-x", "scroll");
                } else {
                    $("#rec_wrapper").css("overflow-x", "visible");
                }
            });
            changeLanguage("recycle");
            //还原选中
            $("#restoreChose").click(function() {
                if ($("tr.selected").length === 0) {
                    swal({
                        title: Dynamic.recycle_a6,
                        confirmButtonText: Dynamic.recycle_a2,
                    });
                    return false;
                }
                var ids = [];
                $("tr.selected").each(function() {
                    ids.push($(this).attr('data-id'));
                });
                $.ajax({
                    async: true,
                    type: "post",
                    url: "/api/recycle.open?cmd=WEL:RECOVERSELECT",
                    data: {
                        ids: ids
                    },
                    success: function(data) { // 请求成功后处理函数。
                        swal({
                            title: Dynamic.recycle_a1,
                            confirmButtonText: Dynamic.recycle_a2,
                            type: "success",
                        }, function() {
                            table.destroy();
                            $("tbody tr").remove();
                            d_table();
                        });
                    },
                    error: function() { // 请求失败处理函数
                        swal({
                            title: Dynamic.recycle_a11,
                            confirmButtonText: Dynamic.recycle_a2,
                            type: "error",
                        });
                    }
                });
            });
            //删除选中
            $("#delChose").click(function() {
                if ($("tr.selected").length === 0) {
                    swal({
                        title: Dynamic.recycle_a7,
                        confirmButtonText: Dynamic.recycle_a2,
                    });
                    return false;
                }
                var ids = [];
                swal({
                        title: Dynamic.recycle_a4,
                        text: Dynamic.recycle_a5,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: Dynamic.recycle_a8,
                        cancelButtonText: Dynamic.recycle_a3,
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    },
                    function() {
                        $("tr.selected").each(function() {
                            ids.push($(this).attr('data-id'));
                        });
                        $.ajax({
                            async: true,
                            type: "post",
                            url: "/api/recycle.open?cmd=WEL:DELETESELECT",
                            data: {
                                ids: ids
                            },
                            success: function(data) { // 请求成功后处理函数。
                                swal({
                                    title: Dynamic.recycle_a9,
                                    confirmButtonText: Dynamic.recycle_a2,
                                    type: "success",
                                }, function() {
                                    table.destroy();
                                    $("tbody tr").remove();
                                    d_table();
                                });
                            },
                            error: function() { // 请求失败处理函数
                                swal({
                                    title: Dynamic.recycle_a10,
                                    confirmButtonText: Dynamic.recycle_a2,
                                    type: "error",
                                });
                            }
                        });
                    });
            });

            function d_table() {
                $.ajax({
                    async: true,
                    type: "post",
                    dataType: "json", // 返回json格式
                    url: "/api/recycle.open",
                    data: {
                    	roleId:roleID
                    },
                    success: function(data) { // 请求成功后处理函数。
                        $.each(data, function(index, values) { // 解析出data对应的Object数组
                            var file_name = "<i class='shou_fang'></i>";
                            var file_type = "";
                            var file_up = "";
                            var file_lose = "";
                            var file_size = "";
                            if (values.filename == null) {
                                file_name = "";
                            } else {
                                var _fileid = values.fileid.split(",");
                                if (_fileid.length == 1) {
                                    file_name = "";
                                }
                                var pro_data = values.filename.split(",");
                                var up_date = values.fileuptime.split(",");
                                var lose_date = values.filedeadtime.split(",");
                                var filetype = values.filetype.split(",");
                                var file_data = values.filesize.split(",");
                                for (var i = 0; i < pro_data.length; i++) {
                                    file_name += "<div class='fen'>" + pro_data[i] + "</div>";
                                    file_type += "<div class='fen'>" + pro_type[filetype[i]] + "</div>";
                                    file_up += "<div class='fen'>" + up_date[i] + "</div>";
                                    file_lose += "<div class='fen'>" + lose_date[i] + "</div>";
                                    file_size += "<div class='fen'>" + file_data[i] + "</div>";
                                }
                            }
                            var tr = $("<tr data-id='" + values.id + "'  class='tr_mid' data-ptn='0'>" +
                                "<td class='table-checkbox sorting_disabled'><div class='fen'><input type='checkbox' class='sel'></div></td>" +
                                "<td>" + values.delete_time + "</td>" +
                                "<td class='p_buttonx td1'><div class='fen' title='" + values.name + "'>" + values.name + "</div></td>" +
                                "<td class='p_buttonx td1'><div class='fen' title='" + values.description + "'>" + values.description + "</div></td>" +
                                "<td>" + values.create_time + "</td>" +
                                "<td class='td1'>" + file_name + "</td>" +
                                "<td class='td1'>" + file_type + "</td>" +
                                "<td class='td1'>" + file_up + "</td>" +
                                "<td class='td1'>" + file_lose + "</td>" +
                                "<td class='td1'>" + file_size + "</td>" +
                                "</tr>");
                            $("table").append(tr);
                        });
                        //表格初始化
                        table = $("#rec").DataTable({
                            "autoWidth": false,
                            "info": true,
                            "ordering": false,
                            "searching": true,
                            "lengthChange": true,
                            "paging": true,
                            "deferRender": true,
                            "pagingType": "full_numbers",
                            "language": Lang,
                        });
                        $('table input[type="checkbox"]').iCheck({
                            checkboxClass: 'icheckbox_square-blue',
                            increaseArea: '20%' // optional
                        });
                        //选中行
                        $('tbody').on('ifChecked', '.sel', function() {
                            var p_tr = $(this).parents("tr");
                            p_tr.addClass('selected');
                            $(this).iCheck('check');
                        });
                        $('tbody').on('ifUnchecked', 'input.sel', function() {
                            var p_tr = $(this).parents("tr");
                            p_tr.removeClass('selected');
                        });
                        $('tbody').on('click', 'tr.tr_mid', function() {
                            $(this).toggleClass('selected');
                            $(this).find(".sel").iCheck('toggle');
                        });
                        //数据全选反选
                        var selectall2 = $("tbody input[type='checkbox']").not("input[name='nopro']");
                        var check2 = $(".allsel");
                        check2.on("ifChecked", function() {
                            selectall2.iCheck('check');
                        });
                        check2.on("ifUnchecked", function() {
                            selectall2.iCheck('uncheck');
                        });
                        $("input[type='search']").attr("class", "form-control input-sm input-small input-inline");
                    },
                    error: function() { // 请求失败处理函数
                        // alert('请求失败');
                    }
                });
            }
            //下拉表格行
            $("tbody").delegate(".shou_fang", "click", function(event) {
                event.stopPropagation();
                var shouP = $(this).parents(".tr_mid").find(".td1");
                if ($(this).parents(".tr_mid").attr("data-ptn") == 0) {
                    shouP.children("div").show();
                    $(this).parents(".tr_mid").attr("data-ptn", "1");
                    $(this).css("transform", "rotate(180deg)");
                } else {
                    shouP.children("div").not($(this).children("div").eq(0)).hide();
                    shouP.each(function() {
                        $(this).children("div").eq(0).show();
                    });
                    $(this).parents(".tr_mid").attr("data-ptn", "0");
                    $(this).css("transform", "rotate(0deg)");
                }
            });
        });
    }
    return {
        render: render
    };
});
