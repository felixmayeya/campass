define([
	"text!/tpl/analysis_fi.html",
	"chart",
	"smChart",
	'css!/css/analysis.css',
	"analysis",
	"fiCharts",
	],function(html,chart, smChart){
	function render(){
		swiper=undefined;
		cvrPageMark=0;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis(chart, smChart);
		changeLanguage("analysis")
		fiBtn(chart, smChart);
	}
	return {
		render:render
	};
});
