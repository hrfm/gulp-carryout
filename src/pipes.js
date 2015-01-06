(function() {

    "use strict;"

	var concat  = require('gulp-concat'),
		plumber = require('gulp-plumber'),
		sass    = require('gulp-sass'),
		uglify  = require('gulp-uglify')
		;

	module.exports = {

		'common_pipes' : {
			
			'dest'    : function( gulp, stream, value ){
				if( typeof value !== 'undefined' ){
					return stream.pipe( gulp.dest( value ) );
				}
				return stream;
			},

			'concat'  : function( gulp, stream, value ){
				if( typeof value !== 'undefined' ){
					return stream.pipe( concat(value) );
				}
				return stream;
			},
			'plumber' : function( gulp, stream, value ){
				if( value === true ){
					return stream.pipe( plumber() );
				}
				return stream;
			},
			'sass'    : function( gulp, stream, value ){
				if( typeof value !== 'undefined' ){
					return stream.pipe( sass() );
				}
				return stream;
			},
			'uglify'  : function( gulp, stream, value ){
				if( value === true ){
					return stream.pipe( uglify() );
				}
				return stream;
			}
			
		},

		'css' : {},
		'js'  : {}

	}

}).call(this);