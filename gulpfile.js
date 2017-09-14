'use strict';
const gulp       = require('gulp');
const watch      = require('gulp-watch');
const shell      = require('gulp-shell')
const sass       = require('gulp-sass');
const concat     = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const spawn      = require('child_process').spawn;


const paths = {
	/**
	 * gulp-sass configuration
	 */
	style: {
		src:            'src/styles/**/*.scss',
		dist:           './lib/styles',
		sourcemap_root: '.'
	},
	/**
	 * webpack config and files to watch
	 */
	webpack: {
		config: 'webpack.config.js'
	}
};

/** sass **/
gulp.task('sass', () => {
	gulp.src(paths.style.src)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write('.', {
			sourceRoot: paths.style.sourcemap_root
		}))
		.pipe(gulp.dest(paths.style.dist));
});

/** webpack **/
gulp.task('webpack', done => {
	var webpack_process = spawn('./node_modules/.bin/webpack', [
		'--config',
		paths.webpack.config
	]);
	webpack_process.on('close', (code, signal) => {
		done();
	});
	webpack_process.stdout.on('data', (data) => {
		console.log(`${data}`);
	});
	webpack_process.stderr.on('data', (data) => {
		console.log(`Error: ${data}`);
	});
	return webpack_process;
});


/** gulp task setup **/
gulp.task('default', ['sass', 'webpack']);
