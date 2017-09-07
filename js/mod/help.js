var helpLang;
localStorage.getItem("language")=="zh"?helpLang="help":helpLang="help_en";
define(["text!/tpl/"+ helpLang +".html", "scroll"], function(html) {
    function render() {
        $(".page-content").html(html);
        $('.swiperBox').scrollUnique();

        $(function() {
            $(function() {
                var body = $('body');
                var sidebar = $('.page-sidebar');
                var sidebarMenu = $('.page-sidebar-menu');
                $(".sidebar-search", sidebar).removeClass("open");

                if (body.hasClass("page-sidebar-closed")) {
                    return false;
                } else {
                    body.addClass("page-sidebar-closed");
                    sidebarMenu.addClass("page-sidebar-menu-closed");
                    if (body.hasClass("page-sidebar-fixed")) {
                        sidebarMenu.trigger("mouseleave");
                    }
                    if (Cookies) {
                        Cookies.set('sidebar_closed', '1');
                    }
                }
            });
            $(".leftBtnTit i").click(function(event) {
                event.stopPropagation();
                var leftBtnn = $(this).parent();
                if (leftBtnn.attr("class") == "leftBtnTit tithide") {
                    leftBtnn.next(".leftBtnSeclect").slideDown();
                    leftBtnn.attr("class", "leftBtnTit titshow");
                    leftBtnn.css("background", "#f2f6f9");
                    $(this).css("transform", "rotate(180deg)");
                } else {
                    leftBtnn.next(".leftBtnSeclect").slideUp();
                    leftBtnn.attr("class", "leftBtnTit tithide");
                    leftBtnn.css("background", "#fff");
                    $(this).css("transform", "rotate(0deg)");
                }
            });
            $(".helpimg").click(function() {
                if ($(this).attr("alt") == "0") {
                    $(this).attr({
                    	alt: "1",
                    	class: "helpimg toB"
                	});
                } else {
                	$(this).attr({
                    	alt: "0",
                    	class: "helpimg toL"
                	});
                }
            });
            $.extend($.scrollTo.defaults, {
                axis: 'y'
            });
            $(".leftBtn a").click(function() {
                var pos = $(this).attr("data-pos");
                $(".swiperBox").scrollTo("#" + pos, 350);
            });
            $("#dic").click(function() {
                $(".swiperBox").scrollTo("#a12", 350);
            });
        });
    }
    return {
        render: render
    };
});
