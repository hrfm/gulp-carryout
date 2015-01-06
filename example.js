/*
var carryout = require('./index.js')( require('./test/plan.js') );
/*/
var carryout = require('./index.js')({
	'js':{
		'default':{
			'src':'test/js/*.js',
			'uglify':true,
			'concat':'ab.js',
			'dest':'test/dest/js'
		}
	}
});
//*/

carryout.run('js');