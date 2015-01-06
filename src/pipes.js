(function() {

    "use strict;"

	var concat = require('gulp-concat'),
		sass   = require('gulp-sass'),
		uglify = require('gulp-uglify')
		;

	module.exports = {

		'common_pipes' : {
			'concat' : function( gulp, stream, config ){
				if( typeof config.concat !== 'undefined' ){
					return stream.pipe( concat(config.concat) );
				}
				return stream;
			}
		},

		'css' : {
			'order' : ['sass','concat'],
			'pipes' : {
				'sass' : function( gulp, stream, config ){
					if( config.sass === false ){
						return stream;
					}
					var src = ( config.src instanceof Array ) ? config.src.join(",") : config.src;
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
				'uglify' : function( gulp, stream, config ){
					if( config.uglify === true ){
						return stream.pipe( uglify() );
					}
					return stream;
				}
			}
		}

	}

}).call(this);