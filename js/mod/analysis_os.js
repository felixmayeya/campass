define([
	"text!/tpl/analysis_os.html",
	"chart",
	"smChart",
	'css!/css/analysis.css',
	"analysis",
	"osCharts",
	],function(html, chart, smChart){
	function render(){
		swiper=undefined;
		cvrPageMark=0;
		//HTML节点注入section中
		$(".page-content").html(html);
		analysis(chart, smChart);
		changeLanguage("analysis")
		osBtn(chart, smChart);
	}
	return {
		render:render
	};
});
