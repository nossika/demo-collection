const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('package_js', () => {
    gulp.src('AudioCore.js')
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(concat('AudioCore.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/..'));
});

gulp.watch(['AudioCore.js'], ['package_js']);

gulp.task('default', ['package_js'], () => {
    console.log('done');
});

process.on('uncaughtException', function(err) {
    console.log('uncaughtException: ' , err.stack);
});