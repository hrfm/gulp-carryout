(function() {

    "use strict;"

	var concat = require('gulp-concat'),
		sass   = require('gulp-sass'),
		uglify = require('gulp-uglify')
		;

	module.exports = {

		'common_pipes' : {
			'concat' : function( gulp, stream, plan ){
				if( typeof plan.concat !== 'undefined' ){
					return stream.pipe( concat(plan.concat) );
				}
				return stream;
			}
		},

		'css' : {
			'order' : ['sass','concat'],
			'pipes' : {
				'sass' : function( gulp, stream, plan ){
					if( plan.sass === false ){
						return stream;
					}
					var src = ( plan.src instanceof Array ) ? plan.src.join(",") : plan.src;
					if( src.match(/\.sass|\.scss/) ){
						return stream.pipe( sass() );
					}else{
						return stream;
					}
				}
			}
		},

		'js' : {
			'order' : ['concat','uglify'],
			'pipes' : {
				'uglify' : function( gulp, stream, plan ){
					if( plan.uglify === true ){
						return stream.pipe( uglify() );
					}
					return stream;
				}
			}
		}

	}

}).call(this);