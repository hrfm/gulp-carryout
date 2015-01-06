/**
 *
 * Copyright (c) 2010 - 2015, https://github.com/hrfm
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function() {

  "use strict;"

  var _gulp    = require('gulp'),
      plumber  = require('gulp-plumber'),
      minimist = require('minimist'),
      merge    = require('merge-stream'),
      through  = require('through2')
  ;

  module.exports = function( plan, pipes, gulpRef ){

    // ==============================================================================
    // --- Initialize arguments.
    // ------------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // --- gulp.

    var gulp = gulpRef || _gulp;
    
    // --------------------------------------------------------------------------
    // --- setup plans.

    var _plan = ( typeof plan === 'string' ) ? require(task) : plan;

    if( typeof _plan === 'undefined' ){
      throw 'gulp-carryout can not run without plans.';
    }
    
    // --------------------------------------------------------------------------
    // --- setup pipes.

    var _pipes;

    if( typeof pipes === 'undefined' ){
      _pipes = require('./pipes.js');
    }else if( typeof pipes === 'string' ){
      _pipes = require(pipes);
    }else{
      _pipes = pipes;
    }

    // --------------------------------------------------------------------------
    // --- check command line arguments.

    var argv, runAll, watchMode, runTask;

    _argv = minimist(process.argv.slice(2));
    
    // -a : Run all task in the category.
    runAll    = ( _argv['a'] === true );
    // -w : Watching targeted tasks.
    watchMode = ( _argv['w'] === true );
    // -t : Specify run tasks.
    runTask   = _argv['t'];



    // ==============================================================================
    // --- private functions
    // ------------------------------------------------------------------------------

    /**
     * This is main function of this plugin.
     * Building gulp-task from task file or arguments. And start run or watching.
     * After that, return those stream.
     * 
     * Actual process are defined into _helper().
     * 
     * @param category  
     * @param target  
     * @param order 
     * @return single or marged stream
     */
    function _run( category, target, order, src ){
      
      var sm, streams = [];

      // --- Case1 : Running task if target specified from arguments. --------

      if( typeof !target === 'undefined' ){

        // If target has multiple tasks. Running them all.

        if( target instanceof Array ){
          
          for( var i=0; i<target.length; i++ ){
            sm = _helper( category, target[i], order, src );
            if( typeof sm !== 'undefined' ){
              streams.push( sm );
            }
          }
          return merge.apply(this,streams);

        }else{

          return _helper( category, target, order, src );

        }

      }
      
      // --- Case2 : If using -a options. That means run all tasks. --------------

      if( runAll === true ){
        
        // Run all tasks on _plan[category].

        for( var key in _plan[category] ){
          sm = _helper( category, key, order, src );
          if( typeof sm !== 'undefined' ){
            streams.push( sm );
          }
        }
        return merge.apply(this,streams);

      }

      // --- Case3 : If using -p options. Run those tasks. --------------------

      if( typeof runTask !== 'undefined' ){

        // If specified runTask has multipre parts.
        // Run all tasks that specified from command line and return marged stream.

        // Otherwise, simply run task and return that stream.

        if( runTask instanceof Array ){

          for( var i=0; i<runTask.length; i++ ){
            sm = _helper( category, runTask[i], order, src );
            if( typeof sm !== 'undefined' ){
              streams.push( sm );
            }
          }
          return merge.apply( this, streams );

        }else{

          return _helper( category, runTask, order, src );

        }

      }

      // --- Neither : Run default task. -----------------

      return _helper( category, 'default', order, src );
      
    }

    /**
     * This is helper function of build and call or watching tasks.
     * Build task depends on _pipes object. _pipes is initialized from pipes.js or object.
     * 
     * @param category  
     * @param target  
     * @param order 
     * @return stream
     */
    function _helper( category, target, order, src ){
      
      target = target || 'default';   
      
      if( !_plan[category] || !_plan[category][target] ){
        gulp.emit('error', new Error('gulp-carryout : Task "' + target + '" is not found.' ) );
        return;
      }

      var plan = _plan[category][target];

      var fn = function(){

        console.log("Starting '"+category+":"+target+"'");

        var time = new Date().getTime(), stream, order;

        // --- Setup stream.

        stream = gulp.src( src || plan.src );

        if( plan.plumber !== false ){
          stream = stream.pipe( plumber() );
        }

        // --- connect pipes from order.

        order = order || plan['@order'] || _pipes[category]['order'];

        for( var i=0, len=order.length; i<len; i++ ){
          if( typeof plan[order[i]] !== 'undefined' ){
            var f = _pipes[category]['pipes'][order[i]] || _pipes['common_pipes'][order[i]];
            if( f ){
              stream = f( gulp, stream, plan );
            }
          }
        }

        // --- dest files if needed.

        if( typeof plan.dest !== 'undefined' ){
          stream = stream.pipe( gulp.dest(plan.dest) );
        }

        //stream.on( 'end', function(){ console.log('end'); });
        //stream.on( 'unpipe', function(){ console.log('unpipe'); });
        
        // --- Listen 'end' event and logging when event triggered.

        stream.on( 'end', function(){
          var elapsed = new Date().getTime() - time;
          console.log("Finished '" + category + ":" + target + "' after " + elapsed + " ms");
        });

        return stream;

      }

      if( watchMode === true ){
        console.log("Watching '"+category+":"+target+"'");
        gulp.watch( plan.src, fn );
      }else{
        return fn();
      }

    }

    /**
     * This is helper function of using carryout with pipe.
     * Build task and execute with src from recent plugin's result.
     * 
     * @param category  
     * @param target  
     * @param order 
     */
    function _pipe( category, target, order ){

        var src = [];

        function transform(file, encoding, callback){
          if(file.isNull()  ){ return callback(); }
          if(file.isStream()){ return this.emit('error', new PluginError('gulp-carryout', 'Streaming not supported')); }
          src.push(file.path);
          callback();
        }

        function flush(callback){

          var that = this, files = [];

          _run( category, target, callback, src )
            .pipe( through.obj(
              function(file, encoding, callback){
                if(file.isNull()  ){ return callback(); }
                if(file.isStream()){ return this.emit('error', new PluginError('gulp-carryout', 'Streaming not supported')); }
                files.push(file);
                callback();
              },
              function(callback){ callback(); }
            ))
            .on('end',function(){
              for( var i=0; i<files.length; i++ ){
                that.push(files[i]);
              }
              that.emit('end');
            });

        }

        return through.obj( transform, flush );

    }

    // ==============================================================================
    // --- public functions
    // ------------------------------------------------------------------------------

    return {
      
      // @see _run
      'run' : function( category, target, order ){
        
        if( typeof category === 'undefined' ){
          throw '"category" is required.';
        }
        
        return _run( category, target, order );

      },

      'pipe' : function( category, target, order ){

        if( typeof category === 'undefined' || typeof target === 'undefined' ){
          throw '"category" and "target" are required.';
        }

        // --- Not capable 'runAll' and 'watchMode' with pipe mode.

        runAll    = false;
        watchMode = false;

        // --- start pipe mode.

        return _pipe( category, target, order );

      }

    }

  }

}).call(this);
