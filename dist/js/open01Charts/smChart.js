define([],function(){function a(t,e){this.$el=$(t),this.chartData=[],this.opts=$.extend({},a.DEFAULTS,e)}return a.DEFAULTS={},a.prototype.build=function(){this.$el.empty(),this._getTimeArr(),this._getChartData(5,0)},a.prototype._getTimeArr=function(){for(var a=[],t=[],e=0,s=5;s>=0;s--)a[e]=this._calculateTime(this.opts.startTime,s),t[e]=this._calculateTime(this.opts.endTime,s),e++;this.smChartStartTimeArr=a,this.smChartEndTimeArr=t},a.prototype._getChartData=function(a,t){var e=this.smChartStartTimeArr,s=this.smChartEndTimeArr,t=t,a=a,i=this;rpTypeCheck();var r=e[t],m=s[t],n=(projectID,chartObj[swiper.activeIndex][0].opts.mapType);if(a<0)return!1;var p=swiper.activeIndex,o="";0===p?o="ONE":1===p?o="TWO":2===p?o="THREE":3===p&&(o="FOUR"),$.ajax({type:"get",url:this.opts.btnUrl+"?cmd=WEL:SELECTHOUR"+o,data:{date:"",startTime:timeZoneChange(r),endTime:timeZoneChange(m),rpType:rpType,project_id:projectID,country:"World"===n?"":n,timeZone:timeZone},async:!0,cache:!0,dataType:"json",success:function(e){console.log(t),console.log(e),i._getSmChartImg({cStartTime:r,cEndTime:m,data:e.dataList,idx:t}),t++,a--,i._getChartData(a,t)}})},a.prototype._getSmChartImg=function(a){var t,e=swiper.activeIndex,s=this.$el,i=a.cStartTime,r=a.cEndTime,m=a.idx,n=a.data,p=this;s.append('<li class="smChartsImg noPad col-md-2 col-xs-2 smChartsImg'+m+'"></li>');var o=[{time:i,data:n[0].data}];"CRAWLER"===pageName&&0===e||"CRAWLER"===pageName&&3===e||"INJECTION"===pageName&&3===e||"LOOPHOLE"===pageName&&3===e||"SCRIPT"===pageName&&3===e?$.each(n,function(a,t){0===a?o[0].data=t.data:$.each(t.data,function(t,e){o[0].data[t]["value"+a]=e.value})}):"DATA"===pageName&&(o[0].data=[],$.each(n[0].data,function(a,t){o[0].data.push({name:t.name,value:t.value})}));var l=this.opts.pageName;if(t="BR"==l||"OS"==l||"TP"==l?this.$el.prev().prev().attr("class").split(" ").pop():this.$el.prev().attr("class").split(" ").pop(),"CRAWLER"===l&&0===e&&(l="pv_crawler"),"mapplot"===t){var c=chartObj[1][0].opts.mapType;"World"===c?t="globalmap":"China"===c&&(t="cnmap")}var h=t;"CRAWLER"!==pageName&&"INJECTION"!==pageName&&"LOOPHOLE"!==pageName&&"SCRIPT"!==pageName||(1===e?h="byip":2===e?h="byurl":3===e&&(h="bystatus")),$.ajax({type:"get",url:"/api/analysis.open?cmd=WEL:PLOTDRAW",data:{filePath:"/NailFIG/"+userID+"/"+projectID+"/"+this.opts.pageName+"/"+h+"/"+this.opts.interval,plotType:t,plotName:l.toLowerCase(),dataJson:JSON.stringify(o)},async:!1,cache:!0,dataType:"json",success:function(a){console.log(a);var t=interval,e=p.$el.find(".smChartsImg"+m);"0"===localStorage.getItem("LINK_STATUS")&&(imgTime=parseInt(parseInt(20160426e4)/1e4),t="day");var s,n;if(a&&""!=a?(s="/chart"+a,n="smChartImg-h"):(s=Dynamic.analysis_errorimg,n="smChartImg-v"),"day"==t)e.append("<img class='"+n+"' src='"+s+"' alt='缩略图加载失败'></img><br /><span class='smChartsSt' style='line-height:32px;'>"+formatTime(i,t)+"</span>");else if("week"==t){var o=i,l=r,c="<img class='"+n+"' src='"+s+"' alt='缩略图加载失败'></img><br /><span> "+Dynamic.analysis_form+" </span><span class='smChartsSt'>"+formatTime(o,t)+"</span></br><span> "+Dynamic.analysis_to+" </span><span class='smChartsEt'>"+formatTime(l,t)+"</span>";e.append(c)}else if("oneMonth"==t){var c="<img class='"+n+"' src='"+s+"' alt='缩略图加载失败'></img><br /><span class='smChartsSt' style='line-height:32px;'>"+formatTime(i,t)+"</span>";e.append(c)}else if("year"==t){var c="<img class='"+n+"' src='"+s+"' alt='缩略图加载失败'></img><br /><span class='smChartsSt' style='line-height:32px;'>"+formatTime(i,t)+"</span>";e.append(c)}}})},a.prototype._calculateTime=function(a,t){var a=a,t=t,e=a.slice(0,4)+"-"+a.slice(4,6)+"-"+a.slice(6,8)+" "+a.slice(8,10)+":"+a.slice(10,12);return"year"===this.opts.interval?a.slice(0,4)-t+a.slice(4):"oneMonth"===this.opts.interval?moment(e).add(-t,"month").format("YYYYMMDDHHmm"):"week"===this.opts.interval?moment(e).add(-7*t,"day").format("YYYYMMDDHHmm"):"day"===this.opts.interval?moment(e).add(-t,"day").format("YYYYMMDDHHmm"):void 0},{SmChart:a}});