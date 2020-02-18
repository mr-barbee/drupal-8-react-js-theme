var gulp = require('gulp');
var livereload = require('gulp-livereload')
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

gulp.task('imagemin', function () {
  return gulp.src('./themes/custom/granderaent/images/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('./themes/custom/granderaent/images'));
});

gulp.task('sass', function () {
  gulp.src(['./themes/custom/granderaent/sass/*.scss',
    './themes/custom/granderaent/sass/**/*.scss',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./themes/custom/granderaent/css'));
});

gulp.task('react', () => {
  return browserify('./themes/custom/granderaent/build/index.js')
    .transform(babelify, {
                          presets: ["@babel/preset-env", "@babel/preset-react"],
                          plugins: ["@babel/plugin-proposal-class-properties"]
                        }
                      )
    .bundle()
    .pipe(source('build.min.js'))
    .pipe(gulp.dest('./themes/custom/granderaent/js'))
    .pipe(streamify(concat('build.min.js')))
    // TODO Add back when development is finsihed.
    // .pipe(streamify(uglify()))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./themes/custom/granderaent/js'));
});

gulp.task('watch', function(){
  // livereload.listen();

  gulp.watch(['./themes/custom/granderaent/sass/*.scss',
    './themes/custom/granderaent/sass/**/*.scss',
    ], ['sass']);
  gulp.watch(['./themes/custom/granderaent/build/*.js',
    './themes/custom/granderaent/build/**/*.js'
    ], ['react']);
  // gulp.watch([['./themes/custom/granderaent/sass/*.scss',
  //   './themes/custom/granderaent/sass/**/*.scss',
  //   ], './themes/custom/granderaent/**/*.twig', './themes/custom/granderaent/js/*.js'], function (files){
  //     livereload.changed(files)
  // });
});

// Only using this due to resource limits.
gulp.task('default', ['imagemin', 'watch']);
// gulp.task('default', ['imagemin', 'sass', 'react', 'watch']);
