(function(){var t;t=jQuery,t.bootstrapGrowl=function(s,e){var a,o,i;switch(e=t.extend({},t.bootstrapGrowl.default_options,e),a=t("<div>"),a.attr("class","bootstrap-growl alert"),e.type&&a.addClass("alert-"+e.type),e.allow_dismiss&&(a.addClass("alert-dismissible"),a.append('<button  class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&#215;</span><span class="sr-only">Close</span></button>')),a.append(s),e.top_offset&&(e.offset={from:"top",amount:e.top_offset}),i=e.offset.amount,t(".bootstrap-growl").each(function(){return i=Math.max(i,parseInt(t(this).css(e.offset.from))+t(this).outerHeight()+e.stackup_spacing)}),o={position:"body"===e.ele?"fixed":"absolute",margin:0,"z-index":"9999",display:"none"},o[e.offset.from]=i+"px",a.css(o),"auto"!==e.width&&a.css("width",e.width+"px"),t(e.ele).append(a),e.align){case"center":a.css({left:"50%","margin-left":"-"+a.outerWidth()/2+"px"});break;case"left":a.css("left","20px");break;default:a.css("right","20px")}return a.fadeIn(),e.delay>0&&a.delay(e.delay).fadeOut(function(){return t(this).remove()}),a},t.bootstrapGrowl.default_options={ele:"body",type:"info",offset:{from:"top",amount:60},align:"right",width:250,delay:4e3,allow_dismiss:!0,stackup_spacing:10}}).call(this);