define([],function(){
	var routesMap = {
	    "dashboard2": "js/mod/ehome.js",
	    "task_detail": "js/mod/emonitor.js",
	    "dashboard1": "js/mod/home.js",
	    "manage": "js/mod/manage.js",
	    "analysis/pv": "js/mod/analysis_pv.js",
	    "analysis/tp": "js/mod/analysis_tp.js",
	    "analysis/rf": "js/mod/analysis_rf.js",
	    "analysis/ip": "js/mod/analysis_ip.js",
	    "analysis/os": "js/mod/analysis_os.js",
	    "analysis/br": "js/mod/analysis_br.js",
	    "analysis/cvr": "js/mod/analysis_cvr.js",
	    "analysis/status": "js/mod/analysis_status.js",
	    "analysis/data": "js/mod/analysis_data.js",
	    "analysis/request": "js/mod/analysis_request.js",
	    "analysis/crawler":"js/mod/analysis_crawler.js",
	    "analysis/sqlinjection":"js/mod/analysis_sql.js",
	    "analysis/fileinclusion":"js/mod/analysis_fi.js",
	    "analysis/xss":"js/mod/analysis_xss.js",
	    "search": "js/mod/search.js",
	    "help": "js/mod/help.js",
	    "ehelp": "js/mod/ehelp.js",
	    "dosage": "js/mod/dosage.js",
	    "upload": "js/mod/upload.js",
	    "options": "js/mod/options.js",
	    "resetPassword": "js/mod/resetPassword.js",
	    "recycle": "js/mod/recycle.js",
	    "check": "js/mod/check.js",
	    "notice": "js/mod/notice.js",
	    "package": "js/mod/package.js",
	    "parse": "js/mod/uploadParse.js",
	    "apps":"js/mod/apps.js",
	    "*actions": "defaultAction"
	};


    var Router = Backbone.Router.extend({

        routes: routesMap,

        defaultAction: function () {
        	if(localStorage.getItem("ROLE_ID")==2){
                location.hash="#/dashboard2"
        	}else{
                location.hash="#/dashboard1"
        	}
        }

    });

    var router = new Router();
    //彻底用on route接管路由的逻辑，这里route是路由对应的value
    router.on('route', function (route, params) {
    	//判断是否显示隐藏左侧菜单
    	var cLocation = location.hash;
    	if(cLocation === "#/options" || cLocation === "#/check" || cLocation === "#/apps" || cLocation === "#/parse" || cLocation === "#/notice"){
    		$('.page-sidebar-wrapper').css({
                'display':'none'
            })
            $('.page-content').css({
                'margin':'0',
                'padding':'10px'
            })
    	} else {
    		$('.page-sidebar-wrapper').css({
                'display':'block'
            })
            $('.page-content').css({
                'margin-left':'235px'
            })
    	}
    	// //每次路由变化检查role_user是否存在
    	// var roleId = localStorage.getItem('ROLE_ID');
    	var roleUser = localStorage.getItem('ROLE_USER');

    	if(!(roleUser && roleUser !== '')){
    		location.href = 'index.html';
    	}

    	if(route!=="defaultAction"){
    		require([route], function (controller) {
	            if(router.currentController && router.currentController !== controller.render){
	                router.currentController.onRouteChange && router.currentController.onRouteChange();
	            }
	            
	            router.currentController = controller.render;
	            controller.render.apply(null, params);     //每个模块约定都返回controller
	        });
    	}    
    });

    return router;
    /*
	var Router = Backbone.Router.extend({

	  routes: {
	    "home":                 "home",
	    "manage":               "manage",
	    "analysis/pv":             "analysis_pv",
	    "analysis/tp":             "analysis_tp",
	    "analysis/rf":             "analysis_rf",
	    "analysis/ip":             "analysis_ip",
	    "analysis/os":             "analysis_os",
	    "analysis/br":             "analysis_br",
	    "analysis/cvr":             "analysis_cvr",
	    "analysis/status":             "analysis_status",
	    "analysis/data":             "analysis_data",
	    "analysis/request":             "analysis_request",
	    "search":                "search",
	    "help":                 "help",
	    "dosage":               "dosage",
	    "upload":				"upload",
	    "options":              "options",
	    "resetPassword":        "resetPassword",
	    "recycle":              "recycle",
	    "check":                "check",
	    "notice": 				"notice",
	    "package":              "package",
			"parse":								"parse",
	    "*actions":				"index"
	  },

	  home: function() {
	    require(["mod/home.js"],function(home){

	    	home.render();
	    })
	  },
	  manage: function() {
	    require(["mod/manage.js"],function(manage){

	    	manage.render();
	    })
	  },
	  check: function() {
	    require(["mod/check.js"],function(check){

	    	check.render();
	    })
	  },
	  analysis_pv: function() {
	    require(["mod/analysis_pv.js"],function(analysis_pv){

	    	analysis_pv.render();
	    })
	  },
	  analysis_tp: function() {
	    require(["mod/analysis_tp.js"],function(analysis_tp){

	    	analysis_tp.render();
	    })
	  },
	  analysis_rf: function() {
	    require(["mod/analysis_rf.js"],function(analysis_rf){

	    	analysis_rf.render();
	    })
	  },
	  analysis_ip: function() {
	    require(["mod/analysis_ip.js"],function(analysis_ip){

	    	analysis_ip.render();
	    })
	  },
	  analysis_os: function() {
	    require(["mod/analysis_os.js"],function(analysis_os){

	    	analysis_os.render();
	    })
	  },
	  analysis_br: function() {
	    require(["mod/analysis_br.js"],function(analysis_br){

	    	analysis_br.render();
	    })
	  },
	  analysis_cvr: function() {
	    require(["mod/analysis_cvr.js"],function(analysis_cvr){

	    	analysis_cvr.render();
	    })
	  },
	  analysis_status: function() {
	    require(["mod/analysis_status.js"],function(analysis_status){

	    	analysis_status.render();
	    })
	  },
	  analysis_data: function() {
	    require(["mod/analysis_data.js"],function(analysis_data){

	    	analysis_data.render();
	    })
	  },
	  analysis_request: function() {
	    require(["mod/analysis_request.js"],function(analysis_request){

	    	analysis_request.render();
	    })
	  },
	  search: function() {
	    require(["mod/search.js"],function(search){

	    	search.render();
	    })
	  },
	  help: function() {
	    require(["mod/help.js"],function(help){

	    	help.render();
	    })
	  },
	  dosage: function() {
	    require(["mod/dosage.js"],function(dosage){

	    	dosage.render();
	    })
	  },
	  upload: function() {
	    require(["mod/upload.js"],function(upload){

	    	upload.render();
	    })
	  },
		parse: function() {
	    require(["mod/uploadParse.js"],function(parse){

	    	parse.render();
	    })
	  },
	  options: function() {
	    require(["mod/options.js"],function(options){

	    	options.render();
	    })
	  },
	  resetPassword: function() {
	    require(["mod/resetPassword.js"],function(resetPassword){

	    	resetPassword.render();
	    })
	  },
	  recycle: function() {
	    require(["mod/recycle.js"],function(recycle){

	    	recycle.render();
	    })
	  },
	  notice: function() {
		  require(["mod/notice.js"],function(notice){

			  notice.render();
		  })
	  },
	  package: function() {
		  require(["mod/package.js"],function(package){

			  package.render();
		  })
	  },
	  index: function() {
	    location.hash="home"
	  }
	});

	var router=new Router();
	return router;
	*/
})

