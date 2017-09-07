define([
	"text!/tpl/analysis_pv.html",
	"chart",
	"smChart",
	'css!/css/analysis.css',
	"analysis",
	"pvCharts",
	],function(html, chart, smChart){
	function render(){
		swiper=undefined;
		cvrPageMark=0;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis(chart, smChart);
		changeLanguage("analysis")
		pvBtn(chart, smChart);

		// render.onRouteChange = function(){
		// 	console.info("router change")
		// }
	}
	return {
		render:render
	};
});
