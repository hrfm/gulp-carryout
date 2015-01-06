# gulp-carryout

## Background

I don't want to write similar gulp task anymore.  
I want to run task likes below.  

- run minify for develop.
```sh
gulp minify -t devlep
```

- run minify for product
```sh
gulp minify -t product
```

- watch minify for develop.
```sh
gulp minify -t product -w
```

Those commands looks like simple. (Atleast for me.)

## Getting started

You can install this module from npm.

    npm install gulp-carryout

## Usage

### 1. Create task plan.

Task plan format should be like below.

```javascript
var plan = {
  'category' : {
    'target' : {
      'src'  : 'path/to/src',
      'pipe' : [
        [ 'key', value ]
        // ... tasks
      ]
    }
  }
}
```

For example : "concat and uglify js files" named "minify".

```javascript
var plan = {
  'js' : {
    'default' : 'minify',
    'minify' : {
      'src'  : ['/path/to/*.js','!**/*.map'],
      'pipe' : [
        [ 'plumber', true             ],
        [ 'concat' , 'jsfiles.min.js' ],
        [ 'uglify' , true             ],
        [ 'dest'   , '/path/to/dest'  ]
      ]
    }
  }
}
```

For now. You can use key listed below.

|key    |behavior |
|-------|---------|
|concat |pipe(concat(concat))     |
|dest   |pipe(gulp.dest(dest))    |
|plumber|if(true) pipe(plumber()) |
|sass   |if(true) pipe(uglify())  |
|uglify |if(true) pipe(uglify())  |

Probably almost people think "Too less to use!".  
Yes. I think that too.

#### How to use another plugins.

You have 2 ways to add pipes.

- Create pipe settings and use on init.
- Call addBehavior method after init. 

This topic will be long story.
Check out the [Configure](#Configure) term.

---

### 2. Setup gulp-carryout

```javascript
var gulp     = require('gulp');
var carryOut = require('gulp-carryout')( gulp, plan );

gulp.task('run-carryout',function(){
  carryOut.run('category');
});
```

---

### 3. Run

```sh
gulp run-carryout
```

That command same as

```sh
gulp run-carryout -t default
```

---

### 4. Watch

If you want to watch the task.  
Use -w option. That is all.

```sh
gulp run-carryout -w
```

### And more

他にも色々あるけど後で書く・・・

## <a name ="Configure">Configure


後で書く・・・

## etc.

### Chain pipe after run

You can use pipe() after run

```javascript
gulp.task('run-carryout',function(){
  carryOut.run('category')
    .pipe( gulp.dest('out') );
});
```

### Using gulp-carryout berween pipes

You can also using between flow using pipe method.

```javascript
gulp.task('run-carryout',function(){
  gulp.src('/path/to/*.js')
    .pipe( carryOut.pipe('category','target') )
    .pipe( gulp.dest('out') );
});
```

carryOut.pipe() will use recent pipe results. Ignore plan's src.



LICENSE
-------

(MIT License)

Copyright (c) 2015 [ Hirofumi Kawakita ] https://github.com/hrfm

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
