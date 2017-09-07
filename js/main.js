require.config({
    baseUrl: "./js",
    paths: {
        jquery: "../assets/global/plugins/jquery.min",
        bootstrap: "../assets/global/plugins/bootstrap/js/bootstrap.min",
        backbone: "lib/backbone",
        underscore: "lib/underscore",
        jqueryUi: "../assets/global/plugins/jquery-ui/jquery-ui.min",
        
        analysis: "mod/analysis",
        jqueryForm: "lib/jquery.form",
        icheck: "../assets/global/plugins/icheck/icheck.min",
        dropzone: "../assets/global/plugins/dropzone/dropzone.min",
        fileInput: "../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput",
        ion: "lib/ion.rangeSlider.min",
        scroll: "lib/jquery.scrollTo.min",
        pagination: "../assets/global/plugins/pagination.min",
        blockui: "../assets/global/plugins/jquery.blockui.min",

        text: "lib/text",
        css: 'lib/css',

        open01: "open01Charts/open01",
        chart: "open01Charts/chart",
        smChart: "open01Charts/smChart",
        pvCharts: "open01Charts/pvCharts",
        ipCharts: "open01Charts/ipCharts",
        dataCharts: "open01Charts/dataCharts",
        statusCharts: "open01Charts/statusCharts",
        brCharts: "open01Charts/brCharts",
        osCharts: "open01Charts/osCharts",
        reqCharts: "open01Charts/requestCharts",
        cvrCharts: "open01Charts/cvrCharts",
        tpCharts: "open01Charts/tpCharts",
        rfCharts: "open01Charts/rfCharts",
        crawlerCharts: "open01Charts/crawlerCharts",
        sqlCharts: "open01Charts/sqlCharts",
        fiCharts: "open01Charts/fiCharts",
        xssCharts: "open01Charts/xssCharts",
        
        homeCharts: "mod/homeCharts",
        serchCharts: "mod/searchCharts",

        router: "router",
        international: "international"
    },
    urlArgs: "bust=" + (new Date()).getTime()
})

require(["router", "open01"], function() {
    Backbone.history.start();
    changeLanguage("strings");
    skipPage = "PV";
    if (localStorage.getItem("language") == "en") {
        $('a[data-i18n="string_agreementQ"]').attr("href", "/static/agreement_en.html");
        $('a[data-i18n="string_licenseQ"]').attr("href", "/static/license_en.html");
        $('a[data-i18n="string_policyQ"]').attr("href", "/static/privacy_en.html");
    } else {
        $('a[data-i18n="string_agreementQ"]').attr("href", "/static/agreement.html");
        $('a[data-i18n="string_licenseQ"]').attr("href", "/static/license.html");
        $('a[data-i18n="string_policyQ"]').attr("href", "/static/privacy.html");
    }
    
    //“更多”按钮
    var moreBtnMark = 0;
    $("#moreBtn").click(function() {
        event.stopPropagation();
        if (moreBtnMark == 1) {
            $("#moreBtn").removeAttr("class");
            $(".moreNav").animate({ "opacity": "0" }, 167, function() {
                moreBtnMark = 0;
                $(".moreNav").css("display", "none");
            })
        } else {
            $("#moreBtn").attr("class", "navLiSelected");
            $(".moreNav").css("display", "block");
            $(".moreNav").animate({ "opacity": "1" }, 167, function() {
                moreBtnMark = 1;
            })
        }
    })
    $("body").not("#moreBtn").click(function() {
        $("#moreBtn").removeAttr("class");
        $(".moreNav").animate({ "opacity": "0" }, 167, function() {
            moreBtnMark = 0;
            $(".moreNav").css("display", "none");
        })
    })
    //获取菜单
    var mainCLocation = location.hash;
	if(!(mainCLocation === "#/options" || mainCLocation === "#/notice" || mainCLocation === "#/check" || mainCLocation === "#/apps" || mainCLocation === "#/parse")){
		getSideMenu();
	}
	function getSideMenu(){
		$.ajax({
			async : true,
			cache : false,
			type : "post",
			url : "/api/user.open?cmd=WEL:GETFUNCTON",
			data : {
				role_id:localStorage.getItem("ROLE"),
				role_type:localStorage.getItem("ROLE_ID")
			},
			success : function(data){
                if(data.code && data.code==="200007"){
                    window.location.href = "/login.html";
                    // swal({
                    //     title: Dynamic.analysis_seesionExpired,
                    //     text: "",
                    //     type: "info",
                    //     confirmButtonText: Dynamic.analysis_ok,
                    //     closeOnConfirm: false
                    // }, function() {
                    //     window.location.href = "/login.html";
                    // })
                }else{
                    var tpl = '';
                    $.each(data, function(index, item){
                        if(index === 0){
                            tpl += '<li class="nav-item start">'+
                                     '<a href="'+item.menu_href+'" class="nav-link nav-toggle" data-status="'+item.status+'">'+
                                        '<i class="'+item.menu_icon+'"></i>'+
                                        '<span class="title">'+item.menu_name+'</span>'+
                                     '</a>'+
                                   '</li>'
                        }else{
                            if(item.status==="1"){
                                if(item.child&&item.child.length>0){
                                    var childTpl = ''
                                    $.each(item.child, function(index, child){
                                        childTpl = childTpl + '<li class="nav-item ">'+
                                             '<a href="'+child.menu_href+'" style="text-indent: 1em;" class="nav-link analysisA" data-status="'+item.status+'">'+child.menu_name+'</a>'+
                                          '</li>'
                                    })
                                    tpl+= '<li class="nav-item">'+
                                         '<a href="javascript:void(0);" class="nav-link nav-toggle" data-status="'+item.status+'">'+
                                            '<i class="'+item.menu_icon+'"></i>'+
                                            '<span class="title">'+item.menu_name+'</span>'+
                                            '<span class="arrow"></span>'+
                                         '</a>'+
                                         '<ul class="sub-menu">'+
                                            childTpl+
                                          '</ul>'+
                                       '</li>'
                                }else{
                                    tpl += '<li class="nav-item">'+
                                         '<a href="'+item.menu_href+'" class="nav-link nav-toggle" data-status="'+item.status+'">'+
                                            '<i class="'+item.menu_icon+'"></i>'+
                                            '<span class="title">'+item.menu_name+'</span>'+
                                         '</a>'+
                                       '</li>'
                                }
                            }else{
                                if(item.child&&item.child.length>0){
                                    var childTpl = ''
                                    $.each(item.child, function(index, child){
                                        childTpl = childTpl + '<li class="nav-item ">'+
                                             '<a href="'+child.menu_href+'" style="text-indent: 1em;color:#ccc;" class="nav-link analysisA" data-status="'+item.status+'" data-parent-id="'+child.parent_id+'">'+child.menu_name+'</a>'+
                                          '</li>'
                                    })
                                    tpl+= '<li class="nav-item">'+
                                         '<a href="javascript:void(0);" class="nav-link nav-toggle nav-link-disabled" data-status="'+item.status+'">'+
                                            '<i class="'+item.menu_icon+'"></i>'+
                                            '<span class="title">'+item.menu_name+'</span>'+
                                            '<span class="arrow"></span>'+
                                         '</a>'+
                                         '<ul class="sub-menu">'+
                                            childTpl+
                                          '</ul>'+
                                       '</li>'
                                }else{
                                    tpl += '<li class="nav-item">'+
                                         '<a href="'+item.menu_href+'" class="nav-link nav-toggle nav-link-disabled" data-status="'+item.status+'">'+
                                            '<i class="'+item.menu_icon+'"></i>'+
                                            '<span class="title">'+item.menu_name+'</span>'+
                                         '</a>'+
                                       '</li>'
                                }
                            }   
                        }
                    })
                    $(".page-sidebar-menu").append(tpl)
                    changePage()
                }
    				
			}
		})
	}
    //切页
    function changePage() {
        var url = location.hash;
        
        var linkList = $('.page-sidebar-menu').find('a')
        $.each(linkList, function(index, item) {
                if ($(item).attr('href') === url) {
                    if ($(item).next().hasClass('sub-menu') === false) {
                        var menu = $('.page-sidebar-menu');
                        menu.find('li.open').removeClass('open');
                        menu.find('li.active').removeClass('active');

                        $(item).parent().addClass('open');
                        if ($(item).parent().parent().parent('li').length > 0) {
                            $(item).parent().parent().parent('li').addClass('active').addClass('open')
                            $(item).parent().parent().parent().children('.arrow').addClass('open')
                        }else{
                            $(item).parent().addClass('active');
                        }

                        var linkStatus = $(item).attr('data-status');
                        localStorage.setItem("LINK_STATUS", linkStatus);
                        if(linkStatus === '0'){
                            var parentId = $(item).attr('data-parent-id'); 
                            localStorage.setItem("PARENT_ID", parentId);
                        } 
                    }
                }
            })
            /*
            
            $("body").eq(0).css("min-height","screen.height"-125+"px");*/
    }
    window.onhashchange = changePage;
    //$(document).ready(changePage);

	//模块切换
	var userN = localStorage.getItem("ROLE_USER");
	var btmenu="";
	localStorage.getItem("language")=="zh"?btmenu="返回模块切换页面":btmenu="Main Menu";
	$.ajax({
		async: false,
		type: "get",
		dataType: "json",
		data: {
			user_name: userN
		},
		url: "/api/jurisdiction.open?cmd=WEL:GETBYUSERNAME",
		success: function (data) {
			var _cont = "";
			$.each(data, function (index, values) {
				var cont = "";
				if (values.role_status == 1) {
					cont = '<li><a href="javascript:;" data-id='+ values.id +' data-type=' + values.role_type + ' class="cli">' + values.role_name + '</a></li>';
				} else {
					cont = '<li><a href="javascript:;" data-id='+ values.id +' data-type=' + values.role_type + ' class="uncli">' + values.role_name + '</a></li>';
				}
				_cont += cont;
			})
			_cont+='<li class="divider"></li><li><a href="/home.html">'+ btmenu +'</a></li>';
			$(".role_menu").html(_cont);
		}
	});
	$("body").delegate(".cli", "click", function () {
		localStorage.setItem("ROLE", $(this).attr("data-id"));
		localStorage.setItem("ROLE_ID", $(this).attr("data-type"));
		window.location.href = "index.html";
	})

    //更多按钮分页
    $("a:lt(3)", $(".moreNav .nav")).each(function() {
            $(this).click(function() {
                $(".moreNav .nav a").not($(this)).animate({ "opacity": "0" }, 167, function() {
                    $(this).css("display", "none")
                    $(".moreNav .nav a:nth-child(5)").css("display", "block")
                })
                $(".moreNav .nav a:nth-child(5)").animate({ "opacity": "1" }, 330)
                $(this).css({ "position": "absolute" })
                $("e", $(this)).css({ "background-position-y": "-690px" })
                $(this).animate({ "left": "0" }, 167)
            })
        })
        //更多按钮 返回
    $(".moreNav .nav a:nth-child(5)").click(function() {
            $("a:lt(4)", $(".moreNav .nav")).animate({ "opacity": "0" }, 0, function() {
                $(this).css({ "position": "relative", "left": "", "display": "inline-block" })
                $("e", $(this)).css({ "background-position-y": "-647px" })
                $(".moreNav .nav a:nth-child(5)").css("display", "none")
                $(this).animate({ "opacity": "1" }, 330)
            })
        })
        // windows = (navigator.userAgent.indexOf("Windows",0) != -1)?1:0;
        // mac = (navigator.userAgent.indexOf("mac",0) != -1)?1:0;
        // linux = (navigator.userAgent.indexOf("Linux",0) != -1)?1:0;
        // unix = (navigator.userAgent.indexOf("X11",0) != -1)?1:0;
        // if (windows) os_type = "MS Windows";
        // else if (mac) os_type = "Apple mac";
        // else if (linux) os_type = "Lunix";
        // else if (unix) os_type = "Unix";
        // return os_type;

    //注销用户信息
    $(function() {
    	var Dy;
    	var Dy_zh={
    			a:"确认要注销账户?",
    			b:"注销",
    			c:"取消"
    	};
    	var Dy_en={
    			a:"Do you want to log out?",
    			b:"Log out",
    			c:"Cancel"
    	};
    	localStorage.getItem("language")=="zh"?Dy=Dy_zh:Dy=Dy_en;
        console.log("%c\n       ", "font-size:100px;line-height:80px;background:url('http://www.open01.com/img/LOGO_02.png') no-repeat");
        $('#exit').click(function() {
            swal({
                title: Dy.a,
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: Dy.b,
                cancelButtonText: Dy.c,
                closeOnConfirm: false,
                closeOnCancel: true
            }, function() {
                $.cookie("rmbUser", "false", {
                    expire: -1
                });
                $.cookie("user_name", "", {
                    expires: -1
                });
                $.cookie("pass_word", "", {
                    expires: -1
                });
                $.post('/api/index.open?cmd=WEL:DESTROY', function(text, status) {
                    location.href = 'login.html';
                });
                localStorage.removeItem('ROLE_USER');
            })
        })
        $("#lock").click(function() {
            localStorage.setItem("history", window.location.href);
            window.location.href = "/static/lock.html";
        })
    })
})
