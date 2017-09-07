define(["text!/tpl/apps.html"], function(html) {
    function render() {
    	$(".page-content").html(html);
    	changeLanguage("apps");
    	if(localStorage.getItem("language") === "en"){
    		$(".portlet-body h4").css("font-size","16px");
    		$(".hideI18nLi").css("display","none")
    	};
    }
    return {
		render:render
	}
})