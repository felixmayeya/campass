define([
	"text!/tpl/analysis_status.html",
	"chart",
	"smChart",
	'css!/css/analysis.css',
	"analysis",
	"statusCharts",
	],function(html, chart, smChart){
	function render(){
		swiper=undefined;
		cvrPageMark=0;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis(chart, smChart);
		changeLanguage("analysis")
		statusBtn(chart, smChart);
	}
	return {
		render:render
	};
});
