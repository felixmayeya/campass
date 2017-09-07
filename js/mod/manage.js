define(["text!/tpl/manage.html", "icheck"], function(html) {
    function render() {
        $(".page-content").html(html);
        var fileid = "";
        var sTable;
        var pro_type = ["", Dynamic.manage_type1, Dynamic.manage_type2];
        var btn_color = ["", "success", "danger", "warning"];
        var btn_cont = ["", Dynamic.manage_active, Dynamic.manage_processing, Dynamic.manage_inactive];
        changeLanguage("manage");
        var anyy1, runn1, anyy2, runn2;
        var project_Btn = function() {
            anyy1 = "<li><a href='javascript:;' class='to_ana'><i class='icon-bar-chart'></i> " + Dynamic.manage_analysis + " </a></li>";
            anyy2 = "<li><a href='javascript:;' class='to_ana' style='color:#ccc;'><i class='icon-bar-chart' style='color:#ccc;'></i> " + Dynamic.manage_analysis + " </a></li>";
            runn1 = "<li><a href='javascript:;' class='run_pro'><i class='fa fa-play'></i> " + Dynamic.manage_startProject + " </a></li>";
            runn2 = "<li><a href='javascript:;' class='run_pro' style='color:#ccc;'><i class='fa fa-play' style='color:#ccc;'></i> " + Dynamic.manage_startProject + " </a></li>";
        };
        var file_Btn = function() {
            anyy1 = "";
            anyy2 = "";
            runn1 = "";
            runn2 = "";
        };
        roleType == 3 ? project_Btn() : file_Btn();

        $(window).resize(function() {
            if ($("#source_wrapper").width() < 1120) {
                $("#source_wrapper").css("overflow-x", "scroll");
            } else {
                $("#source_wrapper").css("overflow-x", "visible");
            }
        });

        var drawData = function() {
            //查询数据总计流量和使用流量
            $.ajax({
                async: true,
                type: "post",
                url: "/api/dosage.open?cmd=WEL:DATASIZE",
                success: function(data) {
                    var perc = (parseFloat(data.flaotUsedDataSize) / parseFloat(data.flaotTotalSize)) * 100;
                    $("#totol_data_size").text(data.totalSize);
                    $("#used_data_size").text(data.usedSize);
                    $("#left_data_size").text(data.xSize);
                    $("#used_per").text(perc.toFixed(2) + "%");
                    if ((parseFloat(data.flaotUsedDataSize) / parseFloat(data.flaotTotalSize)) * 100 > 100) {
                        $("#p_used").css("width", "100%");
                        $("#p_used").attr("class", "progress-bar progress-bar-danger");
                    } else {
                        $("#p_used").css("width", perc + "%");
                    }
                },
                error: function() {
                    console.log(Dynamic.strings_senderror);
                }
            });
        };

        var drawTable = function() {
            //创建表格
            $.ajax({
                async: true,
                type: "post",
                dataType: "json",
                url: "/api/project.open",
                data: {
                    roleId: roleID
                },
                success: function(data) {
                    var pro_num = 0;
                    $.each(data, function(index, values) {
                        pro_num++;
                        var file_name = "<i class='shou_fang'></i>";
                        var file_type = "";
                        var file_up = "";
                        var file_lose = "";
                        var file_size = "";
                        var li_file = "";
                        if (values.filename == null) {
                            file_name = "";
                        } else {
                            var fileid = values.fileid.split(",");
                            if (fileid.length == 1) {
                                file_name = "";
                            }
                            var pro_data = values.filename.split(",");
                            var id_data = values.fileid.split(",");
                            var up_date = values.fileuptime.split(",");
                            var lose_date = values.filedeadtime.split(",");
                            var type_data = values.filetype.split(",");
                            var size_date = values.filesize.split(",");
                            for (var i = 0; i < pro_data.length; i++) {
                                file_name += "<div class='fen fenn'>" + pro_data[i] + "</div>";
                                file_type += "<div class='fen' data-type=" + pro_type + ">" + pro_type[type_data[i]] + "</div>";
                                file_up += "<div class='fen'>" + up_date[i] + "</div>";
                                file_lose += "<div class='fen'>" + lose_date[i] + "</div>";
                                file_size += "<div class='fen'>" + size_date[i] + "</div>";
                                li_file += '<li><input type="checkBox" class="cell" data-id="' + id_data[i] + '"/>' + pro_data[i] + '</li>';
                            }
                        }
                        var tr1 = $("<tr data-id='" + values.id + "' data-file=" + values.fileid + " class='tr_mid' data-ptn='0'>" +
                            "<td class='table-checkbox sorting_disabled'><div class='fen'><input type='checkbox' class='sel'></div></td>" +
                            "<td><span class='label label-" + btn_color[values.status] + " status' data-status=" + values.status + ">" + btn_cont[values.status] + "</span></td>" +
                            "<td class='p_buttonx'><div class='ccc' title='" + values.name + "'>" + values.name + "</div></td>" +
                            "<td class='p_buttonx'><div class='ccc' title='" + values.description + "'>" + values.description + "</div></td>" +
                            "<td>" + values.create_time + "</td>" +
                            "<td><div class='btn-group'><button class='btn blue btn-outline dropdown-toggle control' type='button' data-toggle='dropdown' aria-expanded='false'> " + Dynamic.manage_control + " <i class='fa fa-angle-down'></i></button><ul class='dropdown-menu' role='menu'>" + anyy1 + "<li><a href='javascript:;' class='to_serch'><i class='icon-magnifier'></i> " + Dynamic.manage_search + " </a></li><li><a href='javascript:;' class='edit_proN'><i class='icon-note'></i> " + Dynamic.manage_rename + " </a></li><li><a href='javascript:;' class='edit_proD'><i class='icon-note'></i> " + Dynamic.manage_redes + " </a></li><li><a href='javascript:;' class='up_load'><i class='icon-cloud-upload'></i> " + Dynamic.manage_upload + " </a></li>" + runn1 + "<li><a href='javascript:;' class='delete_pro'><i class='icon-trash'></i> " + Dynamic.manage_delProject + " </a></li><li><a href='javascript:;' class='delete_file'><i class='icon-trash'></i> " + Dynamic.manage_delData + " </a></li></ul></div><div class='modal' style='display: none; padding-right: 17px;'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close'></button><h4 class='modal-title'>" + Dynamic.manage_delData + "</h4></div><div class='modal-body'><ul>" + li_file + "</ul></div><div class='modal-footer'><button type='button' class='btn dark btn-outline cbtn'>" + Dynamic.manage_cancle + "</button><button type='button' class='btn red delete_f'>" + Dynamic.manage_delselected + "</button></div></div></div></div></td>" +
                            "<td class='td1 td2'>" + file_name + "</td>" +
                            "<td class='td1'>" + file_type + "</td>" +
                            "<td class='td1'>" + file_up + "</td>" +
                            "<td class='td1'>" + file_lose + "</td>" +
                            "<td class='td1'>" + file_size + "</td>" +
                            "</tr>");
                        $("tbody").append(tr1);
                    });
                    $("#xxx").html(pro_num);

                    $.ajax({
                        async: true,
                        type: "post",
                        data: {
                            roleId: roleID
                        },
                        dataType: "json",
                        url: "/api/dosage.open",
                        success: function(data) {
                            $.each(data, function(index, values) {
                                var file_ID = '<li><input type="checkBox" class="cell" data-id="' + values.ds_id + '"/>' + values.name + '</li>';
                                var tr2 = $("<tr data-file=" + values.ds_id + " class='noPro'>" +
                                    "<td></td>" +
                                    "<td></td>" +
                                    "<td><select class='selectpicker'></select></td>" +
                                    "<td></td>" +
                                    "<td></td>" +
                                    "<td><div class='btn-group'><button class='btn blue btn-outline dropdown-toggle control' type='button' data-toggle='dropdown' aria-expanded='false'> " + Dynamic.manage_control + " <i class='fa fa-angle-down'></i></button><ul class='dropdown-menu' role='menu'>" + anyy2 + "<li><a href='javascript:void(0);' class='to_serch' style='color:#ccc;'><i class='icon-magnifier' style='color:#ccc;'></i> " + Dynamic.manage_search + " </a></li><li><a href='javascript:void(0);' class='edit_proN' style='color:#ccc;'><i class='icon-note' style='color:#ccc;'></i> " + Dynamic.manage_rename + " </a></li><li><a href='javascript:void(0);' class='edit_proD' style='color:#ccc;'><i class='icon-note' style='color:#ccc;'></i> " + Dynamic.manage_redes + " </a></li><li><a href='javascript:void(0);' class='up_load' style='color:#ccc;'><i class='icon-cloud-upload' style='color:#ccc;'></i> " + Dynamic.manage_upload + " </a></li>" + runn2 + "<li><a href='javascript:void(0);' class='delete_pro' style='color:#ccc;'><i class='icon-trash' style='color:#ccc;'></i> " + Dynamic.manage_delProject + " </a></li><li><a href='javascript:void(0);' class='delete_file'><i class='icon-trash'></i> " + Dynamic.manage_delData + " </a></li></ul></div><div class='modal' style='display: none; padding-right: 17px;'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close'></button><h4 class='modal-title'>" + Dynamic.manage_delData + "</h4></div><div class='modal-body'><ul>" + file_ID + "</ul></div><div class='modal-footer'><button type='button' class='btn dark btn-outline cbtn'>" + Dynamic.manage_cancle + "</button><button type='button' class='btn red delete_f'>" + Dynamic.manage_delselected + "</button></div></div></div></div></td>" +
                                    "<td><div class='fen'>" + values.name + "</div></td>" +
                                    "<td><div class='fen' data-type=" + values.data_type + "" +
                                    ">" + pro_type[values.data_type] + "</td>" +
                                    "<td><div class='fen'>" + values.uptime + "</div></td>" +
                                    "<td><div class='fen'>" + values.deadtime + "</div></td>" +
                                    "<td><div class='fen'>" + values.filesizes + "</div></td>" +
                                    "</tr>");
                                $("tbody").append(tr2);
                            });
                            sTable = $("#source").DataTable({
                                "autoWidth": false,
                                "info": true,
                                "ordering": false,
                                "searching": true,
                                "lengthChange": true,
                                "paging": true,
                                "deferRender": true,
                                "pageLength": 10,
                                "language": Lang,

                            });
                        }
                    });

                },
                error: function() {
                    console.log(Dynamic.strings_senderror);
                }
            });
        };

        //表格、复选框、下拉框初始化
        var resTable = function() {
        	$("tbody").find(".selectpicker").selectpicker({
                width: "200%",
                title: Dynamic.search_select,
            });
            $('table input[type="checkbox"]').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                increaseArea: '20%' // optional
            });
            var opp = "";
            var opp1 = "";
            var opp2 = "";
            var opp3 = "";
            $.ajax({
                async: true,
                type: "get",
                dataType: "json",
                url: "/api/project.open?cmd=WEL:SELECTPROJECTNAME",
                data: {
                    roleId: roleID
                },
                success: function(data) {
                    $.each(data.all, function(index, values) {
                        opp1 += "<option data-id='" + values.id + "' data-status='" + values.status + "'>" + values.name + "</option>";
                    });
                    $.each(data.file, function(index, values) {
                        opp2 += "<option data-id='" + values.id + "' data-status='" + values.status + "'>" + values.name + "</option>";
                    });
                    $.each(data.stream, function(index, values) {
                        opp3 += "<option data-id='" + values.id + "' data-status='" + values.status + "'>" + values.name + "</option>";
                    });
                    $(".noPro").each(function() {
                        var _type = $(this).children("td:nth-of-type(8)").children("div").attr("data-type");
                        var _selectt = $(this).find(".selectpicker");
                        if (_type == 1) {
                            opp = opp2;
                        } else {
                            opp = opp3;
                        }
                        _selectt.html(opp);

                    });
                    $("tbody").find(".selectpicker").selectpicker('render');
                    $("tbody").find(".selectpicker").selectpicker('refresh');
                }
            });
            $("input[type='search']").attr("class", "form-control input-sm input-small input-inline");
            var selectall2 = $("tbody .sel").not("input[name='nopro']");
            var check2 = $(".allsel");
            check2.on("ifChecked", function() {
                selectall2.iCheck('check');
            });
            check2.on("ifUnchecked", function() {
                selectall2.iCheck('uncheck');
            });
            $(".tr_mid").each(function() {
                var _status = $(this).find(".status").attr("data-status");
                if (_status == 3) {
                    $(this).find(".run_pro").attr("data-run", "0");
                    $(this).find(".to_ana").attr("data-run", "1");
                    $(this).find(".to_serch").attr("data-run", "1");
                    $(this).find(".up_load").attr("data-run", "0");
                } else if (_status == 1) {
                    $(this).find(".run_pro").attr("data-run", "1");
                    $(this).find(".to_ana").attr("data-run", "0");
                    $(this).find(".to_serch").attr("data-run", "0");
                    $(this).find(".up_load").attr("data-run", "0");
                } else if (_status == 2) {
                    $(this).find(".run_pro").attr("data-run", "1");
                    $(this).find(".to_ana").attr("data-run", "1");
                    $(this).find(".to_serch").attr("data-run", "1");
                    $(this).find(".up_load").attr("data-run", "1");
                }
                if ($(this).attr("data-file") == "null") {
                    $(this).find(".run_pro").attr("data-run", "1");
                }
            });
            $(".tr_mid .run_pro").bind("click", runpro);
            $(".tr_mid .to_ana").bind("click", go_ana);
            $(".tr_mid .up_load").bind("click", go_up);
            $(".tr_mid .to_serch").bind("click", go_serch);
            $(".tr_mid .run_pro[data-run='1']").css("color", "#ccc").children().css("color", "#ccc");
            $(".tr_mid .run_pro[data-run='1']").unbind("click", runpro);
            $(".tr_mid .to_ana[data-run='1']").css("color", "#ccc").children().css("color", "#ccc");
            $(".tr_mid .to_ana[data-run='1']").unbind("click", go_ana);
            $(".tr_mid .to_serch[data-run='1']").css("color", "#ccc").children().css("color", "#ccc");
            $(".tr_mid .to_serch[data-run='1']").unbind("click", go_serch);
            $(".tr_mid .up_load[data-run='1']").css("color", "#ccc").children().css("color", "#ccc");
            $(".tr_mid .up_load[data-run='1']").unbind("click", go_up);

            function runpro() {
                var pid = $(this).parents("tr").attr("data-id");
                swal({
                    title: Dynamic.manage_sl_makesurea,
                    text: Dynamic.manage_sl_pa,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: Dynamic.manage_sl_run,
                    cancelButtonText: Dynamic.manage_cancle,
                    closeOnConfirm: false,
                    closeOnCancel: true,
                    showLoaderOnConfirm: true
                }, function() {
                    $.ajax({
                        async: true,
                        type: "post",
                        url: "/api/project.open?cmd=WEL:STARTUPPROJECT",
                        data: {
                            pid: pid
                        },
                        success: function(data) {
                            swal({
                                title: Dynamic.manage_sl_runsucess,
                                confirmButtonText: Dynamic.manage_sl_apply,
                                type: "success",
                            }, function() {
                                sTable.destroy();
                                $("tbody tr").remove();
                                drawTable();
                            });
                        }
                    });

                });
            }

            function go_ana() {
                projectID = $(this).parents("tr").attr("data-id");
                skipSwiper = 0;
                skipPage = "PV";
                upDateProID();
                location.href = "#/analysis/pv";

            }

            function go_up() {
                projectUP = $(this).parents("tr").attr("data-id");
                location.href = "#/upload";
            }

            function go_serch() {
                if (roleType == 3) {
                    projectID = $(this).parents("tr").attr("data-id");
                    upDateProID();
                } else {
                    sprojectID = $(this).parents("tr").attr("data-id");
                }
                var fi = $(this).parents("tr").attr("data-file").split(",");
                dataID = fi;
                location.href = "#/search";
            }
        };

        var eventBind = function() {
            //项目名称编辑
            $('tbody').delegate(".tr_mid .edit_proN", "click", function(event) {
                var iv1 = $(this).parents("tr").find(".ccc").eq(0).html();
                var that = $(this);
                swal({
                    title: Dynamic.manage_sl_writepro,
                    type: "input",
                    showCancelButton: true,
                    confirmButtonText: Dynamic.manage_sl_apply,
                    cancelButtonText: Dynamic.manage_cancle,
                    closeOnConfirm: false,
                    inputValue: iv1,
                    showLoaderOnConfirm: true
                }, function(inputValue) {
                    if (inputValue === false) return false;
                    if (inputValue === "") {
                        swal.showInputError(Dynamic.manage_sl_pleaseb);
                        return false;
                    }
                    var id = that.parents("tr").attr("data-id");
                    var val1 = inputValue;
                    var val2 = that.parents("tr").children("td").eq(3).children(".ccc").html();
                    var data = [id, val1, val2];
                    $.post("/api/project.open?cmd=WEL:update", {
                        'updata[]': data
                    }, function() {
                        swal({
                            title: Dynamic.manage_sl_subsucess,
                            confirmButtonText: Dynamic.manage_sl_apply,
                            type: "success",
                        }, function() {
                            sTable.destroy();
                            $("tbody tr").remove();
                            drawTable();
                        });
                    });

                });
            });
            //项目描述编辑
            $('tbody').delegate(".tr_mid .edit_proD", "click", function(event) {
                var that = $(this);
                var iv2 = $(this).parents("tr").find(".ccc").eq(1).html();
                swal({
                    title: Dynamic.manage_sl_writedes,
                    type: "input",
                    showCancelButton: true,
                    confirmButtonText: Dynamic.manage_sl_apply,
                    cancelButtonText: Dynamic.manage_cancle,
                    closeOnConfirm: false,
                    inputValue: iv2,
                    showLoaderOnConfirm: true
                }, function(inputValue) {
                    if (inputValue === false) return false;
                    if (inputValue === "") {
                        swal.showInputError(Dynamic.manage_sl_pleaseb);
                        return false;
                    }
                    var id = that.parents("tr").attr("data-id");
                    var val1 = that.parents("tr").children("td").eq(2).children(".ccc").html();
                    var val2 = inputValue;
                    var data = [id, val1, val2];
                    $.post("/api/project.open?cmd=WEL:update", {
                        'updata[]': data
                    }, function() {
                        swal({
                            title: Dynamic.manage_sl_subsucess,
                            confirmButtonText: Dynamic.manage_sl_apply,
                            type: "success",
                        }, function() {
                            sTable.destroy();
                            $("tbody tr").remove();
                            drawTable();
                        });
                    });
                });
            });

            //选中行
            $('tbody').on('ifChecked', '.sel', function() {
                $(this).parents("tr").addClass('selected');
            });
            $('tbody').on('ifUnchecked', '.sel', function() {
                $(this).parents("tr").removeClass('selected');
            });
            $('tbody').on('click', 'tr.tr_mid', function() {
                $(this).toggleClass('selected');
                $(this).find(".sel").iCheck('toggle');
            });
            //新建项目
            var addProCheck=false;
    		$("#go_sumb").attr("class","btn default disabled")
    		$("#new_name").blur(function(){
    			$.ajax({
                    async: true,
                    type: "post",
                    url: "/api/project.open?cmd=WEL:VALIDATEPROJECTNAME",
                    data: {
                    	name:$("#new_name").val()
                    },
                    success: function(data) {
                    	if(data.code === "20007"){
                    		addProCheck=true;
                    		$("#go_sumb").attr("class","btn btn-primary")
                    		$("#new_name").parent().removeClass("has-error")
                    		$("#new_name").next().text("")
                    	}else if(data.code === "20000"){
                    		addProCheck=false;
                    		$("#go_sumb").attr("class","btn default disabled")
                    		$("#new_name").parent().addClass("has-error")
                            $("#new_name").next().text(Dynamic.upload_proRepetition)
                    	}
    					if(("#new_name").val()!==''){
    						addProCheck=false;
                    		$("#go_sumb2").attr("class","btn default disabled")
                    		$("#new_name").parent().addClass("has-error")
                    		$("#new_name").next().text(Dynamic.upload_proNameEmpty)
    					}
                    },
                    error: function(data){
                    }
    			})
    		})
            $("#newModal").on("hide.bs.modal", function () {
    			$("#new_name").val('')
    			$("#new_des").val('')
    			$("#new_name").next().text("")
    			addProCheck=false
    			$("#new_name").parent().removeClass("has-error")
    			$("#go_sumb").attr("class","btn default disabled")
    		})
            $("#go_sumb").on("click", function() {
            	if(addProCheck){
	                var n_name = "";
	                var n_des = "";
	                $("#new_name").val() === "" ? n_name = Dynamic.manage_newP : n_name = $("#new_name").val();
	                $("#new_des").val() === "" ? n_des = Dynamic.manage_newD : n_des = $("#new_des").val();
	                var _data = {
	                    projectName: n_name,
	                    projectDesc: n_des
	                };
	                $.ajax({
	                    async: true,
	                    type: "post",
	                    url: "/api/project.open?cmd=WEL:insertfile",
	                    data: _data,
	                    success: function(data) {
	                        swal({
	                            title: Dynamic.manage_sl_newsuccess,
	                            confirmButtonText: Dynamic.manage_sl_apply,
	                            type: "success",

	                        }, function() {
                                $('#newModal').modal('hide');
	                            sTable.destroy();
	                            $("tbody tr").remove();
	                            drawTable();
	                        });
	                    },
	                    error: function() {
	                        swal({
	                            title: Dynamic.manage_sl_newfalse,
	                            confirmButtonText: Dynamic.manage_sl_apply,
	                            type: "error",
	                        });
	                    }
	                });
            	}else{
    				return
    			}
            });
            //删除项目
            $("body").delegate(".tr_mid .delete_pro", "click", function() {
                var parent = $(this).parents("tr");
                var _sid = [];
                _sid.push($(this).parents("tr").attr('data-id'));
                swal({
                        title: Dynamic.manage_sl_makesureb,
                        text: Dynamic.manage_sl_pb,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: Dynamic.manage_sl_suredel,
                        cancelButtonText: Dynamic.manage_cancle,
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    },
                    function() {
                        $.ajax({
                            async: true,
                            type: "post",
                            url: "/api/project.open?cmd=WEL:DELETE",
                            data: {
                                ids: _sid
                            },
                            success: function(data) {
                                swal({
                                    title: Dynamic.manage_sl_delsuccess,
                                    confirmButtonText: Dynamic.manage_sl_apply,
                                    type: "success",
                                }, function() {
                                    sTable.destroy();
                                    $("tbody tr").remove();
                                    drawTable();
                                });
                            },
                            error: function() {
                                swal({
                                    title: Dynamic.manage_sl_delfalse,
                                    confirmButtonText: Dynamic.manage_sl_apply,
                                    type: "error",
                                });
                            }
                        });
                    });
            });
            //删除选中
            $("#delete_select").on("click", function() {
                if ($("table input[type='checkbox']:checked").length === 0) {
                    swal({
                        title: Dynamic.manage_sl_pleasec,
                        confirmButtonText: Dynamic.manage_sl_apply,
                    });
                    return false;
                }
                var sid = [];
                var snum = $("tr.selected").length;
                $("tr.selected").each(function() {
                    sid.push($(this).attr('data-id'));
                });
                swal({
                        title: Dynamic.manage_sl_makesureb,
                        text: Dynamic.manage_sl_pb,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: Dynamic.manage_sl_suredel,
                        cancelButtonText: Dynamic.manage_cancle,
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    },
                    function() {
                        $.ajax({
                            async: true,
                            type: "post",
                            url: "/api/project.open?cmd=WEL:DELETE",
                            data: {
                                ids: sid
                            },
                            success: function(data) {
                                swal({
                                    title: Dynamic.manage_sl_delsuccess,
                                    confirmButtonText: Dynamic.manage_sl_apply,
                                    type: "success",
                                }, function() {
                                    sTable.destroy();
                                    $("tbody tr").remove();
                                    drawTable();
                                });
                            },
                            error: function() {
                                swal({
                                    title: Dynamic.manage_sl_delfalse,
                                    confirmButtonText: Dynamic.manage_sl_apply,
                                    type: "error",
                                });
                            }
                        });
                    });
            });
            //删除数据
            $("tbody").delegate(".delete_file", "click", function() {
                $(this).parents(".btn-group").next(".modal").show();
            });
            $("tbody").delegate(".close", "click", function() {
                $(this).parents(".modal").hide();
            });
            $("tbody").delegate(".cbtn", "click", function(event) {
                event.stopPropagation();
                $(this).parents(".modal").hide();
            });
            $("tbody").delegate(".delete_f", "click", function() {
                if ($(this).parents("tr").find(".cell:checked").length === 0) {
                    swal({
                        title: Dynamic.manage_sl_pleasec,
                        confirmButtonText: Dynamic.manage_sl_apply,
                    });
                    return false;
                }
                var pid = "";
                var trStatus = $(this).parents("tr").find(".status").attr("data-status");
                if ($(this).parents("tr").hasClass("tr_mid")) {
                    pid = $(this).parents("tr").attr('data-id');
                }
                var _fileid = "";
                $(this).parents("tr").find(".cell:checked").each(function() {
                    _fileid += $(this).attr("data-id") + ",";
                });
                swal({
                        title: Dynamic.manage_sl_makesurec,
                        text: Dynamic.manage_sl_pc,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: Dynamic.manage_sl_suredel,
                        cancelButtonText: Dynamic.manage_cancle,
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        showLoaderOnConfirm: true
                    },
                    function() {
                        $.ajax({
                            async: true,
                            type: "post",
                            url: "/api/dosage.open?cmd=WEL:DELETE",
                            data: {
                                fid: _fileid,
                                pid: pid,
                                status: trStatus
                            },
                            success: function(data) {
                                swal({
                                    title: Dynamic.manage_sl_delsuccess,
                                    confirmButtonText: Dynamic.manage_sl_apply,
                                    type: "success",
                                }, function() {
                                    sTable.destroy();
                                    $("tbody tr").remove();
                                    drawTable();
                                });
                            },
                            error: function() {
                                swal({
                                    title: Dynamic.manage_sl_delfalse,
                                    confirmButtonText: Dynamic.manage_sl_apply,
                                    type: "error",
                                });
                            }
                        });
                    });
            });
            //下拉表格行
            $("tbody").delegate(".shou_fang", "click", function(event) {
                event.stopPropagation();
                var shouP = $(this).parents(".tr_mid").find(".td1");
                if ($(this).parents(".tr_mid").attr("data-ptn") == 0) {
                    shouP.children("div").show();
                    $(this).parents(".tr_mid").attr("data-ptn", "1");
                    $(this).css("transform", "rotate(180deg)");
                } else {
                    shouP.children("div").hide();
                    shouP.each(function() {
                        $(this).children("div").eq(0).show();
                    });
                    $(this).parents(".tr_mid").attr("data-ptn", "0");
                    $(this).css("transform", "rotate(0deg)");
                }
            });
            //归属项目
            $('tbody').delegate(".selectpicker", "change", function() {
                var proid = $(this).find("option:selected").attr("data-id");
                var prost = $(this).find("option:selected").attr("data-status");
                var profile = $(this).parents("tr").attr("data-file");
                var protype = $(this).parents("tr").children("td:nth-of-type(8)").children().attr("data-type");

                if (prost == 1) {
                    swal({
                            title: Dynamic.manage_sl_makesured,
                            text: Dynamic.manage_sl_pd,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: Dynamic.manage_sl_apply,
                            cancelButtonText: Dynamic.manage_cancle,
                            closeOnConfirm: false,
                            closeOnCancel: true,
                            showLoaderOnConfirm: true
                        },
                        function() {
                            $.ajax({
                                async: true,
                                type: "post",
                                url: "/api/project.open?cmd=WEL:BINDINGPROJECT",
                                data: {
                                    roleType: roleType,
                                    pid: proid,
                                    fileid: profile,
                                    file_type: protype
                                },
                                success: function(data) {
                                    swal({
                                        title: Dynamic.manage_sl_savasuccess,
                                        confirmButtonText: Dynamic.manage_sl_apply,
                                        type: "success",

                                    }, function() {
                                        sTable.destroy();
                                        $("tbody tr").remove();
                                        drawTable();
                                    });
                                },
                                error: function() {
                                    swal({
                                        title: Dynamic.manage_sl_savefalse,
                                        confirmButtonText: Dynamic.manage_sl_apply,
                                        type: "error",
                                    });
                                }
                            });
                        });
                } else {
                    $.ajax({
                        async: true,
                        type: "post",
                        url: "/api/project.open?cmd=WEL:BINDINGPROJECT",
                        data: {
                            roleType: roleType,
                            pid: proid,
                            fileid: profile,
                            file_type: protype
                        },
                        success: function(data) {
                            swal({
                                title: Dynamic.manage_sl_savasuccess,
                                confirmButtonText: Dynamic.manage_sl_apply,
                                type: "success",
                            }, function() {
                                sTable.destroy();
                                $("tbody tr").remove();
                                drawTable();
                            });
                        },
                        error: function() {
                            swal({
                                title: Dynamic.manage_sl_savefalse,
                                confirmButtonText: Dynamic.manage_sl_apply,
                                type: "error",
                            });
                        }
                    });
                }

            });

            //导出pdf文件
            $("#c_pdf").on("click", function() {
                window.location.href = "/api/download.open?cmd=WEL:RESMGTDOWNLOADPDF";
            });

            //导出csv文件
            $("#c_csv").on("click", function() {
                window.location.href = "/api/download.open?cmd=WEL:RESMGTDOWNLOADCSV&&os_type="+(isMac()?"mac":"");
            });
        };

        $('#source').on('draw.dt', function() {
            resTable();
            if ($("#source_wrapper").width() < 1120) {
                $("#source_wrapper").css("overflow-x", "scroll");
            } else {
                $("#source_wrapper").css("overflow-x", "visible");
            }
        });
        drawData();
        drawTable();
        eventBind();


    }
    return {
        render: render
    };
});
