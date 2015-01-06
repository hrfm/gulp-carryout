var g        = require('gulp');
var carryout = require('./index.js')( g, {
	'js':{
		'default':{
			'src'  : 'test/js/*.js',
			'pipe' : [
				[ 'concat' , 'ab.js'        ],
				[ 'dest'   , 'test/dest/js' ]
			]
		},
		'minify':{
			'src'  : 'test/js/*.js',
			'pipe' : [
				[ 'uglify' , true           ],
				[ 'concat' , 'ab.min.js'    ],
				[ 'dest'   , 'test/dest/js' ]
			]
		}
	}
});
//*/

//*
carryout.run('js');
/*/
g.src('test/js/*.js')
 .pipe( carryout.pipe('js','minify') )
 .pipe( g.dest('test/dest/js') );
//*/