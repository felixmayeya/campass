function brBtn(e,t){pageName="BR",btnUrl="/api/browser.open",dataTableObj=[],chartTime=[],chartObj=[],smChartArr=[],moreDateMark=0,chartType="vBar",chartTxt=[Dynamic.analysis_step,Dynamic.analysis_br,Dynamic.analysis_ViewNum],localStorage.setItem("CHART_DATA","");var a=Dynamic.analysis_br_paginationArr;if(swiper&&swiper.destroy(!1),swiper=new Swiper(".swiper-container",{observer:!0,observeParents:!0,pagination:".swiper-pagination",paginationClickable:!0,paginationBulletRender:function(e,t){return'<li class="'+t+' swiperContainer col-md-4 col-xs-4">'+a[e]+"</li>"},onSlideChangeStart:function(a){var r=startTime+"|"+endTime;if(0==a.activeIndex&&chartTime[a.activeIndex]!=r){var n=new e.Chart($(".echarts_vBar"),{type:"hbarplot",title:Dynamic.homeCharts_title19});chartObj[0]=[n],n.showLoading();var i=new t.SmChart($(".smCharts-"+a.activeIndex),{interval:interval,startTime:startTime,endTime:endTime,btnUrl:btnUrl,pageName:pageName,interval:interval});smChartArr[0]=i;var l=localStorage.getItem("CHART_DATA");l&&""!==l?(renderChart(JSON.parse(l),n),chartTime[a.activeIndex]=r,"自定义日期"!==localStorage.getItem("ANALYSIS_LABLE")&&"Custom Range"!==localStorage.getItem("ANALYSIS_LABLE")&&smChartsBuild(a.activeIndex)):getChartData({projectID:projectID,startTime:startTime,endTime:endTime,url:btnUrl,datetype:_interval,rpType:"hbarplot",chart:[n],setLocalStorage:!0,smCharts:i})}else if(1==a.activeIndex&&chartTime[a.activeIndex]!=r){var o=new e.Chart($(".echarts_area"),{type:"treeplot",title:Dynamic.homeCharts_title17});chartObj[1]=[o],o.showLoading();var s=new t.SmChart($(".smCharts-"+a.activeIndex),{interval:interval,startTime:startTime,endTime:endTime,btnUrl:btnUrl,pageName:pageName,interval:interval});smChartArr[1]=s;var l=localStorage.getItem("CHART_DATA");l&&""!==l?(renderChart(JSON.parse(l),o),chartTime[a.activeIndex]=r,"自定义日期"!==localStorage.getItem("ANALYSIS_LABLE")&&"Custom Range"!==localStorage.getItem("ANALYSIS_LABLE")&&smChartsBuild(a.activeIndex)):getChartData({projectID:projectID,startTime:startTime,endTime:endTime,url:btnUrl,datetype:_interval,rpType:"hbarplot",chart:[o],setLocalStorage:!0,smCharts:s})}}}),0==skipSwiper){var r=new e.Chart($(".echarts_vBar"),{type:"hbarplot",title:Dynamic.homeCharts_title19,clickable:!1});chartObj[0]=[r],r.showLoading();var n=new t.SmChart($(".smCharts-"+swiper.activeIndex),{interval:interval,startTime:startTime,endTime:endTime,btnUrl:btnUrl,pageName:pageName,interval:interval});smChartArr[0]=n,getChartData({projectID:projectID,startTime:startTime,endTime:endTime,url:btnUrl,datetype:_interval,rpType:"hbarplot",isLoadSmallCharts:!1,chart:[r],setLocalStorage:!0,smCharts:n})}swiper.slideTo(skipSwiper),skipSwiper=0,skipPage=""}function brRefresh(e){for(var t=e.allPvCount,a=e.No1,r=e.No1Name,n=e.No2,i=e.No2Name,e=e.dataList[0].data,l=0,o=0;o<e.length;o++)l+=e[o].value;if($(".infoCount_1").html(l),isNaN(ForDight(l/t*100,2))?$(".infoCount_2").html("0"):$(".infoCount_2").html(ForDight(l/t*100,2)),0==t)$(".counterSpan").eq(0).attr("data-value","--"),$(".counterSpan").eq(1).attr("data-value","--"),$(".counterSpan").eq(2).attr("data-value","--"),$(".counterSpan").eq(3).attr("data-value","--"),$(".font-red-haze").eq(1).html(""),$(".font-purple-soft").eq(4).html("");else{$(".counterSpan").eq(0).attr("data-value",r);var s=(a/t*100).toFixed(2);0==s&&0!=a?$(".counterSpan").eq(1).attr("data-value","<0.01"):0==s&&0==a?$(".counterSpan").eq(1).attr("data-value","0"):$(".counterSpan").eq(1).attr("data-value",toDecimal2(s)),$(".counterSpan").eq(2).attr("data-value",i);var m=(n/t*100).toFixed(2);0==m&&0!=n?$(".counterSpan").eq(3).attr("data-value","<0.01"):0==m&&0==n?$(".counterSpan").eq(3).attr("data-value","0"):$(".counterSpan").eq(3).attr("data-value",toDecimal2(m)),$(".font-red-haze").eq(1).html("%"),$(".font-purple-soft").eq(4).html("%")}$(".counterSpan").counterUp({delay:10,time:1e3})}