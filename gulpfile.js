require('es6-promise').polyfill();

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifycss = require('gulp-clean-css'),
	clean = require('gulp-clean'),
	rename = require('gulp-rename'),
	usemin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
	requirejs = require('requirejs'),
	fs = require('fs'),
	proxy = require('http-proxy-middleware'),
	connect = require('gulp-connect');

var path = {
	fontAwesome: [
		'assets/global/plugins/font-awesome/fonts/*'
	],
	simpleLineIcons: [
		'assets/global/plugins/simple-line-icons/fonts/*'
	],
	images: [
		'assets/layouts/layout4/img/sidebar-toggle-light.png',
		'assets/global/img/remove-icon-small.png',
		'assets/global/img/accordion-plusminus.png'
	]
}

gulp.task('clean.all', function(){
    return gulp.src(['dist'], {read: false}).pipe(clean())
})


///////////
//静态资源处理 //
///////////

gulp.task('mv.tpl', function(){
	return gulp.src('tpl/**')
		.pipe(gulp.dest('dist/tpl'))
})

gulp.task('mv.css', function(){
	return gulp.src('css/**')
		.pipe(gulp.dest('dist/css'))
})

gulp.task('mv.static', function(){
	return gulp.src('static/**')
		.pipe(gulp.dest('dist/static'))
})

gulp.task('mv.assets', function(){
	return gulp.src('assets/**')
		.pipe(gulp.dest('dist/assets'))
})

gulp.task('mv.img', function(){
	return gulp.src('img/**')
		.pipe(gulp.dest('dist/img'))
})

gulp.task('mv.i18n', function(){
	return gulp.src('i18n/**')
		.pipe(gulp.dest('dist/i18n'))
})


gulp.task('copy.FontAwesome', function(){
	return gulp.src(path.fontAwesome)
		.pipe(gulp.dest('dist/fonts'))
})

gulp.task('copy.SimpleLineIcons', function(){
	return gulp.src(path.simpleLineIcons)
		.pipe(gulp.dest('dist/css/fonts'))
})

gulp.task('copy.AssetImg', function(){
	return gulp.src(path.images)
		.pipe(gulp.dest('dist/img'))
})

////////////////////
//requirejs相关文件处理 //
////////////////////

var jsDir = 'js';
var jsModules = [];

gulp.task('build.requirejs', function(cb){
	return requirejs.optimize({
        baseUrl: 'js',
        dir: 'dist/js',
        findNestedDependencies : false,   //代码内部写的require也计算在打包内
        preserveLicenseComments : false,  //去掉头部版权声明
        removeCombined: false,            //自动删除被合并过的文件
        modules: jsModules
    }, function(){
        cb();
    }, cb);
})

//////////////////
//css，js 基础依赖合并 //
//////////////////

gulp.task('build.base.home', function(){
	return gulp.src('home.html')
		.pipe(usemin({
	     	css: [ minifycss()],
	      	js: [ uglify() ]
	    }))
        .pipe(gulp.dest('dist'))
})
gulp.task('build.base.login', function(){
	return gulp.src('login.html')
		.pipe(usemin({
	     	css: [ minifycss()],
	      	js: [ uglify() ]
	    }))
        .pipe(gulp.dest('dist'))
})
gulp.task('build.base', ['build.base.home', 'build.base.login'], function(){
	return gulp.src('index.html')
		.pipe(usemin({
	     	css: [ minifycss()],
	      	js: [ uglify() ]
	    }))
        .pipe(gulp.dest('dist'))
})

gulp.task('build.css.rev', ['build.base', 'build.requirejs'], function(){
	return gulp.src('dist/css/*.css')
		.pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
})

gulp.task('build.js.rev', ['build.css.rev'], function(){
	return gulp.src('dist/js/*.js')
		.pipe(rev())
		.pipe(gulp.dest('dist/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist/rev/js'))
})

gulp.task('build.rev', ['build.base', 'build.requirejs'], function () {
    return gulp.start(['build.css.rev', 'build.js.rev']);
});

//##########################################################

gulp.task('build.index', ['build.js.rev'], function () {
    return gulp.src(['dist/rev/**/*.json', 'dist/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));
});

gulp.task('build.all', ['build.index'], function () {
    gulp.start(['mv.img', 'mv.static', 'mv.tpl', 'mv.assets', 'mv.i18n', 'mv.css', 'copy.FontAwesome', 'copy.SimpleLineIcons', 'copy.AssetImg']);
});

gulp.task('default', ['clean.all'], function(){
	gulp.start(['build.all'])
});

//##########################################################

//开发环境
gulp.task('server', function(){
	connect.server({
        livereload: true,
        root: "./",
        index: "login.html",
        port: 9080,
        middleware: function(connect, opt) {
        	return [
            	proxy('/api', {
            		target: 'http://localhost:8080',
					changeOrigin: true,
					pathRewrite: {'^/api' : ''}
            	}),
            	proxy('/druid', {
            		target: 'http://192.168.1.137:3000',
					changeOrigin: true,
					pathRewrite: {'^/druid' : ''}
            	}),
            	proxy('/data', {
            		target: 'http://localhost:8080',
					changeOrigin: true,
					//pathRewrite: {'^/api' : ''}
            	}),
            	proxy('/upload', {
            		target: 'http://192.168.1.135:5000',
					changeOrigin: true,
					//pathRewrite: {'^/api' : ''}
            	}),
            	proxy('/chart', {
            		target: 'http://60.205.152.23:8000',
					changeOrigin: true,
					pathRewrite: {'^/chart' : ''}
            	})
            ]
   //      	var filter = function (pathname, req) {
			//     return (pathname.match('\.open$'));
			// };
   //          return [
   //          	proxy(filter, {
   //          		target: 'http://localhost:8080',
			// 		changeOrigin: true,
			// 		// pathRewrite: {'^/campass' : ''}
   //          	})
   //          ]
        }
    });
})

//生产环境
gulp.task('distServer', function(){
	connect.server({
        livereload: true,
        root: "./dist",
        index: "login.html",
        port: 9080,
        middleware: function(connect, opt) {
        	return [
            	proxy('/api', {
            		target: 'http://localhost:8080',
					changeOrigin: true,
					pathRewrite: {'^/api' : ''}
            	}),
            	proxy('/data', {
            		target: 'http://localhost:8080',
					changeOrigin: true,
					//pathRewrite: {'^/api' : ''}
            	}),
            	proxy('/upload', {
            		target: 'http://192.168.1.135:5000',
					changeOrigin: true,
					//pathRewrite: {'^/api' : ''}
            	}),
            	proxy('/chart', {
            		target: 'http://60.205.152.23:8000',
					changeOrigin: true,
					pathRewrite: {'^/chart' : ''}
            	})
            ]

   //      	var filter = function (pathname, req) {
			//     return (pathname.match('\.open$'));
			// };
   //          return [
   //          	proxy(filter, {
   //          		target: 'http://localhost:8080',
			// 		changeOrigin: true,
			// 		// pathRewrite: {'^/campass' : ''}
   //          	})
   //          ]
        }
    });
})
