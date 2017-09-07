define([
	"text!/tpl/analysis_crawler.html",
	"chart",
	"smChart",
	'css!/css/analysis.css',
	"analysis",
	"crawlerCharts",
	],function(html,chart, smChart){
	function render(){
		swiper=undefined;
		cvrPageMark=0;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis(chart, smChart);
		changeLanguage("analysis")
		crawlerBtn(chart, smChart);
	}
	return {
		render:render
	};
});
