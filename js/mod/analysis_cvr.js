define([
	"text!/tpl/analysis_cvr.html",
	'css!/css/analysis.css',
	"analysis",
	"cvrCharts",
	],function(html){
	function render(){
		swiper=undefined;
		cvrPageMark=1;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis();
		changeLanguage("analysis")
		cvrBtn()
	}
	return {
		render:render
	};
});
