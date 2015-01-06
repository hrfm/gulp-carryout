/*
var carryout = require('./index.js')( require('./test/plan.js') );
/*/
var carryout = require('./index.js')({
	'js':{
		'default':{
			'src':'test/js/*.js',
			'concat':'ab.js',
			'dest':'test/dest/js'
		},
		'minify':{
			'uglify':true,
			'concat':'ab.min.js'
		}
	}
});
//*/

var g = require('gulp');

/*
carryout.run('js','test');
/*/
g.src('test/js/*.js')
 .pipe( carryout.pipe('js','minify') )
 .pipe( g.dest('test/dest/js') );
//*/