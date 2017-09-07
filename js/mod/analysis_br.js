define([
	"text!/tpl/analysis_br.html",
	"chart",
	"smChart",
	'css!/css/analysis.css',
	"analysis",
	"brCharts",
	],function(html, chart, smChart){
	function render(){
		swiper=undefined;
		cvrPageMark=0;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis(chart, smChart);
		changeLanguage("analysis")
		brBtn(chart, smChart);
	}
	return {
		render:render
	};
});
