define(["text!/tpl/package.html", "ion", "jqueryForm"], function(html) {
    function render() {
        $(".page-content").html(html);
        $(function() {
            var r1 = 0;
            var r2 = 0;
            var r3 = 0;
            var _value1 = Dynamic.package_value1;
            var _value2 = Dynamic.package_value2;
            var _value3 = Dynamic.package_value3;
            $.ajax({
                async: false,
                type: "get",
                dataType: "json",
                url: "/api/check.open?cmd=WEL:SELECTPACKAGEBYUSERIDROLEID",
                success: function(data) {
                    if (data && JSON.stringify(data) != "{}") {
                        r1 = $.inArray(data.comp[0], _value1);
                        r2 = $.inArray(data.comp[1], _value2);
                        r3 = $.inArray(data.comp[2], _value3);
                        if(r1 == -1 || r2 == -1 || r3 == -1){
                            $("#mspan1").val(_value1[1]);
                            $("#mspan2").val(_value2[1]);
                            $("#mspan3").val(_value3[1]);
                            $("#mspan4").text(Dynamic.package_sum);
                        }else{
                            $("#mspan1").val(_value1[r1]);
                            $("#mspan2").val(_value2[r2]);
                            $("#mspan3").val(_value3[r3]);
                            $("#mspan4").text(data.comp[3]);
                        }
                    } else {
                        $("#mspan1").val(_value1[1]);
                        $("#mspan2").val(_value2[1]);
                        $("#mspan3").val(_value3[1]);
                        $("#mspan4").text(Dynamic.package_sum);
                    }

                }
            });
            changeLanguage("package");
            //选条
            $("#range_01").ionRangeSlider({
                grid: true,
                from: r1,
                hide_min_max: true,
                from_min: 1,
                force_edges: true,
                values: _value1
            });
            $("#range_01").change(function() {
                $("#mspan1").val($(this).val());
            });
            $("#range_02").ionRangeSlider({
                grid: true,
                from: r2,
                hide_min_max: true,
                from_min: 1,
                values: _value2
            });
            $("#range_02").change(function() {
                $("#mspan2").val($(this).val());
            });
            $("#range_03").ionRangeSlider({
                grid: true,
                from: r3,
                hide_min_max: true,
                from_min: 1,
                values: _value3
            });
            $(".mod2 .portlet-body .small").css("left", "0");
            $("#range_03").change(function() {
                $("#mspan3").val($(this).val());
            });
            $("#trans").click(function() {
                $.post("/api/check.open?cmd=WEL:NOTICESALER", function() {
                    swal({
                        title: Dynamic.package_tell,
                        text: Dynamic.package_hours,
                        confirmButtonText: Dynamic.manage_sl_apply,
                        type: "success",
                    });
                });

            });
            $('#myForm').ajaxForm(function() {
                swal({
                    title: Dynamic.package_tell,
                    confirmButtonText: Dynamic.manage_sl_apply,
                    type: "success",
                }, function() {
                    $('#myModal').modal('hide');
                });
            });


            $("#sure").click(function() {
                var _num1 = $("#mspan1").val();
                var _num2 = $("#mspan2").val();
                var _num3 = $("#mspan3").val();
                var _num4 = $("#mspan4").text();
                if (localStorage.getItem("language") == "zh") {
                    _num1 = _num1.substring(0, _num1.length - 4);
                    _num2 = _num2.substring(0, _num2.length - 2);
                    _num3 = _num3.substring(0, _num3.length - 1);
                    _num4 = _num4.substring(0, _num4.length - 1);
                } else {
                    _num1 = _num1.substring(0, _num1.length - 8);
                    _num2 = _num2.substring(0, _num2.length - 6);
                    _num3 = _num3.substring(0, _num3.length - 3);
                    _num4 = _num4.substring(0, _num4.length - 4);
                }
                var data = {
                    deploy: _num1,
                    compact: _num2,
                    duration: _num3,
                    total: _num4
                };
                $.post("/api/check.open?cmd=WEL:INSERTPACKAGEORDER", data, function() {
                    swal({
                        title: Dynamic.package_sure,
                        text: Dynamic.package_create,
                        confirmButtonText: Dynamic.manage_sl_apply,
                        type: "success",
                    });
                });
            });
            $(".trange").change(function() {
                //				$("#mspan4").html("价格计算中...");
                var num1 = $("#range_01").val();
                var num2 = $("#range_02").val();
                var num3 = $("#range_03").val();
                if (localStorage.getItem("language") == "zh") {
                    num1 = num1.substring(0, num1.length - 4);
                    num2 = num2.substring(0, num2.length - 2);
                    num3 = num3.substring(0, num3.length - 1);
                } else {
                    num1 = num1.substring(0, num1.length - 8);
                    num2 = num2.substring(0, num2.length - 6);
                    num3 = num3.substring(0, num3.length - 3);
                }

                var _data = {
                    data_config: num1,
                    contract_period: num2,
                    storage_days: num3
                };
                $.ajax({
                    async: true,
                    type: "post",
                    dataType: "json",
                    data: _data,
                    url: "/api/check.open?cmd=WEL:SELECTPACKAGEPRICE",
                    success: function(data) {
                        $("#mspan4").html(data.contractPrice + Dynamic.package_yuan);
                    }
                });
            });
        });
    }
    return {
        render: render
    };
});
