const gulp         = require( 'gulp' ),
	  babel        = require( 'gulp-babel' ), // babel
	  concat       = require( 'gulp-concat' ), // concat js
	  uglify       = require( 'gulp-uglify' ), // min js
	  stylus       = require( 'gulp-stylus' ), // stylus
	  rename       = require( 'gulp-rename' ), // rename
	  cssnano      = require( 'gulp-cssnano' ), // min css
	  csscomb      = require( 'gulp-csscomb' ), // css order rules
	  plumber      = require( 'gulp-plumber' ), // err control
	  sourcemaps   = require( 'gulp-sourcemaps' ), // files sourcemaps
	  autoprefixer = require( 'gulp-autoprefixer' ); // autoprefix css
 

/* CSS */


// transform stylus in css
gulp.task( 'stylus', () => {

	return gulp.src( './dev/styles/stylus/main.styl' )
			.pipe(sourcemaps.init())
			   .pipe( plumber() )
			   .pipe( stylus() )
		   .pipe(sourcemaps.write())
		   .pipe( gulp.dest( './dev/styles/css' ) )
});

// prefix css
gulp.task( 'prefix', ['stylus'], () => {

	return gulp.src( 'dev/styles/css/main.css' )
			.pipe(sourcemaps.init())
			   .pipe( plumber() )
			   .pipe( autoprefixer({browsers: ['last 3 versions'], cascade: true}) )
		   .pipe(sourcemaps.write())
		   .pipe( gulp.dest( 'dev/styles/css/' ) )
});


// order css
gulp.task( 'csscomb', ['stylus', 'prefix'], () => {
  	return gulp.src( 'dev/styles/css/main.css' )
  			.pipe(sourcemaps.init())
			   .pipe( plumber() )
    		   .pipe( csscomb() )
		   .pipe(sourcemaps.write())
		   .pipe( gulp.dest( 'dev/styles/css' ) );
});


// min main.css
gulp.task( 'min-main', ['stylus', 'csscomb', 'prefix'], () => {

    return gulp.src( 'dev/styles/css/main.css' )
    		.pipe(sourcemaps.init())
    		   .pipe( plumber() )
		       .pipe( cssnano() )
		       .pipe( rename( 'main.min.css' ) )
	       .pipe(sourcemaps.write())
	       .pipe( gulp.dest( 'assets/styles/' ) );
});

// min reset.css
gulp.task( 'min-reset', () => {

    return gulp.src( 'dev/styles/css/reset.css' )
    		.pipe(sourcemaps.init())
    		   .pipe( plumber() )
		       .pipe( cssnano() )
		       .pipe( rename( 'reset.min.css' ) )
	       .pipe(sourcemaps.write())
	       .pipe( gulp.dest( 'assets/styles/' ) );
});


/* JS */


gulp.task( 'es6', () => {
    return gulp.src( './dev/js/main.js' )
    		.pipe(sourcemaps.init())
    			.pipe( plumber() )
		        .pipe(babel({presets: [ 'es2015' ]}))
	        .pipe(sourcemaps.write())
	        .pipe(gulp.dest( './assets/js/' ));
});

gulp.task( 'js', () => {
    return gulp.src( [
            './assets/js/main.js',
            './dev/js/fastclick.js'
        ] )
    	.pipe(sourcemaps.init())
	        .pipe( concat( 'script.min.js' ) ) 
	        .pipe( uglify() )    
        .pipe(sourcemaps.write())              
        .pipe( gulp.dest( './assets/js/' ) );
} );


/* WATCH */

gulp.task( 'watch', () => {

	gulp.watch( 'dev/styles/stylus/main.styl', ['prefix', 'csscomb', 'min-main'] );
	gulp.watch( 'dev/js/main.js', ['es6'] );
	gulp.watch( 'assets/js/main.js', ['js'] );

});

/* DEFAULT */

gulp.task( 'default', [ 'min-main', 'js', 'watch' ] );