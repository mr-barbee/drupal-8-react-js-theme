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
var buffer = require('vinyl-buffer')
var terser = require('gulp-terser');

gulp.task('imagemin', function () {
  return gulp.src('./src/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('./src/img'));
});

gulp.task('sass', function () {
  gulp.src(['./src/sass/*.scss',
    './src/sass/**/*.scss',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('react', () => {
  return browserify('./src/build/index.js')
    .transform(babelify, {
                          presets: ["@babel/preset-env", "@babel/preset-react"],
                          plugins: ["@babel/plugin-proposal-class-properties"]
                        }
                      )
    .bundle()
    .pipe(source('build.min.js'))
    .pipe(streamify(concat('build.min.js')))
    .pipe(gulp.dest('./src/js'));
});

gulp.task('react-production', function () {
  process.env.NODE_ENV = 'production';
  return browserify('./src/build/index.js')
    .transform('babelify', {
                presets: ["@babel/preset-env", "@babel/preset-react"],
                plugins: ["@babel/plugin-proposal-class-properties"]
              })
    .bundle()
    .pipe(source('build.min.js'))
    .pipe(buffer())    // Stream files
    .pipe(terser()) // minifiy files
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./src/js'))
});

// Only using this due to resource limits.
gulp.task('default', ['imagemin', 'watch']);
// gulp.task('default', ['imagemin', 'sass', 'react', 'watch']);
