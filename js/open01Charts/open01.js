//----------analysis使用变量-----------
var title = "页面访问总量统计";
var btnUrl;
//模块ID
var roleID = localStorage.getItem("ROLE");
var roleType = localStorage.getItem("ROLE_ID");
//公共swiper对象
var swiper;
var pageName;
var sessionObj = {};
var allData;
var drillTime; //下钻判断不重复变量
//cvr页面禁用更多数据和添加首页标记
var cvrPageMark;
var statusArr = [];
var interval = "";
var daterangeArr = Dynamic.analysis_daterangeArr;
if (localStorage.getItem("ANALYSIS_LABLE") != "" && localStorage.getItem("ANALYSIS_LABLE") != null) {
    if (localStorage.getItem("ANALYSIS_LABLE") == daterangeArr[0] || localStorage.getItem("ANALYSIS_LABLE") == daterangeArr[1]) {
        interval = "day";
    } else if (localStorage.getItem("ANALYSIS_LABLE") == daterangeArr[2]) {
        interval = "week";
    } else if (localStorage.getItem("ANALYSIS_LABLE") == daterangeArr[3]) {
        interval = "oneMonth";
    } else if (localStorage.getItem("ANALYSIS_LABLE") == daterangeArr[4]) {
        interval = "year";
    }
} else {
    interval = "day";
}

var _interval = "";
if (localStorage.getItem("ANALYSIS_INTERVAL") != "" && localStorage.getItem("ANALYSIS_INTERVAL") != null) {
    _interval = localStorage.getItem("ANALYSIS_INTERVAL");
} else {
    _interval = "hour";
}
var analysisOnload = true;
//打印判断地域
var controlMapType;
//----------analysis使用变量END-----------
//--------------全局变量------------------
var storageArr;
var userID;
var projectID;
var projectUP = "";
//ajax全局对象
var xhr;
//预解析filePath
var filePath = "";
var messageData;
//时间变量
var startTime;
var endTime;
var smChartST = [];
var smChartET = [];
var os_type;
var rpType;
var language = localStorage.getItem("language");

//首页到分析报表地域判断变量
var homeSkipMapType;
//--------------全局变量END------------------
//--------------智能搜索变量------------------
var Search = 0;
var dataID = [];
var sprojectID = "";
//--------------智能搜索变量END------------------
//--------------首页使用变量----------------
//首页跳转分析报表时间参数
var addChartCheck = 0;
var indexToAnalysis = false;
var projectTimeArr;
var skipSwiper = 0;
var skipPage;
var titleStartTime;
var titleEndTime;
var titleProID;
var skipInterval;
//首页判断地域
var homeMapType;
//首页项目过滤标记
var indexProjectSelected = false;
//首页拖拽图标后保存图表信息的数组
var newStorageArr;
//--------------首页使用变量END----------------
//获取用户信息
console.log("正在获取用户信息...")
    //	$(".loginStep_1").html("正在获取用户信息...")
if (localStorage.getItem("PROJECTID") != "" && localStorage.getItem("PROJECTID") != null) {
    projectID = localStorage.getItem("PROJECTID");
}
$.ajax({
    async: true,
    cache: false,
    type: "post",
    url: "/api/options.open",
    data: {},
    success: function(data) { // 请求成功后处理函数。
        $('#userAvatar_s').attr('src', data.image);
        $("#head_name").html(data.name);
        $(".avatar").attr("src", data.image);
        $(".username").html(data.sitename);
        userID = data.user_id;
        console.log("获取用户信息成功...")
            //			$(".loginStep_1").html("正在获取用户信息...<span style='color:green;'>Success</span>")
            //获取最后一次浏览的项目ID
        console.log("正在获取项目ID...")
            //			$(".loginStep_2").html("正在获取项目目录...")
        if (data.last_project == 0) {
            projectID = "00"
        } else {
            projectID = data.last_project;
        }
        localStorage.setItem("PROJECTID", projectID)

        //			$(".loginStep_2").html("正在获取项目目录...<span style='color:green;'>Success</span>")
        //			$(".loginStep_3").css("display","block");
        if (location.hash != "#home") {
            setTimeout(function() {
                $(".loadingBox").fadeOut();
            }, 1000)
        }

        initMessageInfo(userID);

    },
    error: function() { // 请求失败处理函数
        console.log('获取用户信息失败');
        //			$(".loginStep_1").html("正在获取用户信息...<span style='color:red;'>Fail</span>")
    }
});

function initMessageInfo(userID) {
    $(".indexMessage li").remove();
    $.ajax({
        url: "/api/notice.open?cmd=WEL:SELECTUNREADNOTICE",
        async: true,
        cache: false,
        type: "post",
        data: {
            user_id: userID
        },
        success: function(data) {
            console.log(data)
            messageData = data;
            var tpl = "";
            $(".messageNum").html(data.length)
            if (data.length > 0) {
                for (var i = 0; i < data.length ; i++) {
                    var messageType = data[i].type;
                    var label_type = "label-info";
                    var fabell = "fa fa-bell-o";
                    if ("1" == messageType || "2" == messageType) {
                        label_type = "label-info";
                    }
                    if ("8" == messageType) {
                        label_type = "label-warning";
                    }
                    if ("3" == messageType) {
                        label_type = "label-warning";
                    }
                    if ("4" == messageType) {
                        label_type = "label-danger";
                        fabell = "fa fa-bolt";
                    }
                    if ("1" == messageType) {
                        //							$.bootstrapGrowl("<a href='javascript:uploadParse("+i+")'>"+data[i].content+"</a>");
                        var file_path_num = i
                        if (location.hash != "#/upload" && location.hash != "#/parse" && localStorage.getItem("ROLE") === "3" && localStorage.getItem("ROLE_ID") === "3") {
                            swal({
                                title: localStorage.getItem('language') == 'zh' ? "请确认预解析" : "请确认预解析",
                                text: data[i].content,
                                type: "info",
                                showCancelButton: true,
                                confirmButtonClass: "btn-success",
                                confirmButtonText: localStorage.getItem('language') == 'zh' ? "确认" : "Comfirm"
                            }, function() {
                                uploadParse(file_path_num)
                            })
                        }
                        tpl += '<li onclick="javascript:uploadParse(' + file_path_num + ');"><a>' +
                            '<span class="time">' + data[i].time + '</span><span class="details">' +
                            '<span class="label label-sm label-icon ' + label_type + '" style="padding: 4px 3px 4px 4px;">' +
                            '<i class="' + fabell + '"></i></span> ' + data[i].content + ' </span></a></li>';
                    } else {
                        tpl += '<li><a href="javascript:closeThisMessage(' + data[i].id + "," + userID + ');">' +
                            '<span class="time">' + data[i].time + '</span><span class="details">' +
                            '<span class="label label-sm label-icon ' + label_type + '" style="padding: 4px 3px 4px 4px;">' +
                            '<i class="' + fabell + '"></i></span> ' + data[i].content + ' </span></a></li>';
                    }
                }
                $(".indexMessage").append(tpl)
            } else {

            }
        }
    })

}
setInterval(function() {
    initMessageInfo(userID);
}, 60000)

function closeThisMessage(messageId, nUserId) {
    $.ajax({
        url: "/api/notice.open?cmd=WEL:CHANGENOTICE",
        async: true,
        cache: false,
        type: "post",
        data: {
            noticeId: messageId
        },
        success: function(data) {
            initMessageInfo(nUserId);
        }
    })
}

function uploadParse(i) {
    filePath = messageData[i];
    console.log(filePath)
    localStorage.setItem("ROLE", 3);
    localStorage.setItem("ROLE_ID", 3);
    location.href = "#/parse"
}

function upDateProID() {
    localStorage.setItem("PROJECTID", projectID)
    $.ajax({
        type: "POST",
        url: "/api/toppage.open?cmd=WEL:UPDATEPROJECTID",
        data: {
            projectID: projectID
        },
        async: true,
        cache: true,
        dataType: "json", //返回json格式
        success: function(data) {

        }
    })
}
/**
 *js中更改日期
 * y年， m月， d日， h小时， n分钟，s秒
 */
Date.prototype.add = function(part, value) {
    value *= 1;
    if (isNaN(value)) {
        value = 0;
    }
    switch (part) {
        case "y":
            this.setFullYear(this.getFullYear() + value);
            break;
        case "m":
            this.setMonth(this.getMonth() + value);
            break;
        case "d":
            this.setDate(this.getDate() + value);
            break;
        case "h":
            this.setHours(this.getHours() + value);
            break;
        case "n":
            this.setMinutes(this.getMinutes() + value);
            break;
        case "s":
            this.setSeconds(this.getSeconds() + value);
            break;
        default:
    }
    return this;
}

//时间设置
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
startTime = moment().startOf('day').format('YYYYMMDDHHmm');
endTime = moment().add(1, "d").startOf('day').format('YYYYMMDDHHmm');
//sliderBar十个分页
$(".page-sidebar-menu").delegate(".analysisBtn", "click", function() {
    if (localStorage.getItem("ANALYSIS_START_TIME") != "" && localStorage.getItem("ANALYSIS_START_TIME") != null && localStorage.getItem("ANALYSIS_END_TIME") != "" && localStorage.getItem("ANALYSIS_END_TIME") != null) {
        $('#reportrange').data('daterangepicker').setStartDate(localStorage.getItem("ANALYSIS_START_TIME"));
        $('#reportrange').data('daterangepicker').setEndDate(localStorage.getItem("ANALYSIS_END_TIME"));
    }
});



/*设置要保留的小数位数，四舍五入。
 *ForDight(Dight,How):数值格式化函数，Dight要格式化的 数字，How要保留的小数位数。
 *这里的方法是先乘以10的倍数，然后去掉小数，最后再除以10的倍数。
 */
function ForDight(Dight, How) {
    Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
    return Dight;
}
/*Javascript设强制保留两位数
 */
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

var loadingObj = {
    text: 'loading',
    color: '#678098',
    textColor: '#678098',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
};

function addLoadEvent(fn) {
    var old = window.onresize;
    if (typeof window.onresize != 'function') {
        window.onresize = fn;
    } else {
        window.onresize = function() {
            old();
            fn();
        }
    }
};

//滚动事件处理
$.fn.scrollUnique = function() {
    return $(this).each(function() {
        var eventType = 'mousewheel';
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function(event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;

            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);

            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0 ? 0 : scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }
        });
    });
};

//datatable弹窗报错重置
$.fn.dataTable.ext.errMode = function(s, h, m) {};

var timeZone = -(new Date()).getTimezoneOffset() / 60

//时区转换
function timeZoneChange(item) {
    var timeZone = (new Date()).getTimezoneOffset() / 60;
    return moment(item.slice(0, 4) + "-" + item.slice(4, 6) + "-" + item.slice(6, 8) + " " + item.slice(8, 10) + ":" + item.slice(10, 12)).add(timeZone, "hour").format('YYYYMMDDHHmm');
}

//判断是否为mac系统
var isMac = function() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
}

var isWindows = function() {
    return /windows|win32/i.test(navigator.userAgent);
}

//注册map格式
var registMap = function(mapType) {
	$.get('js/map/json/'+ mapType.toLowerCase() +'.json', function (jsonData) {
	    echarts.registerMap(mapType, jsonData);
	});
}

var maptype = 'China';
language === 'zh' ? mapType = 'China' : mapType = 'World';

registMap(mapType);
