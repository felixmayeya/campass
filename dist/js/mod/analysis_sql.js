define(["text!/tpl/analysis_sql.html","chart","smChart","css!/css/analysis.css","analysis","sqlCharts"],function(s,a,n){function t(){swiper=void 0,cvrPageMark=0,$(".page-content").html(s),analysis(a,n),changeLanguage("analysis"),sqlBtn(a,n)}return{render:t}});