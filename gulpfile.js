var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var copy = require('gulp-contrib-copy');
var argv = require('yargs').argv;
var git = require('gulp-git');
var runSequence = require('run-sequence');

var distFolder = "./dist";

gulp.task('lint-app', function () {
    return gulp.src('./multipleDatePicker.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('uglify', ['lint-app'], function () {
    return gulp.src('./multipleDatePicker.js')
        .pipe(uglify())
        .pipe(rename('multipleDatePicker.min.js'))
        .pipe(gulp.dest(distFolder));
});

gulp.task('copy', [], function () {
    return gulp.src('./multipleDatePicker.js')
        .pipe(copy())
        .pipe(gulp.dest(distFolder));
});

gulp.task('version', function(cb){
    if(argv.release) {
        gulp.src(['package.json'])
            .pipe(replace(/("version": ")(.*)(")/, '$1' + argv.release + "$3"))
            .pipe(gulp.dest('.'));
        gulp.src(['bower.json'])
            .pipe(replace(/("version": ")(.*)(")/, '$1' + argv.release + "$3"))
            .pipe(gulp.dest('.'));
        gulp.src(['./multipleDatePicker.js'])
            .pipe(replace(/(@version: )(.*)/, '$1' + argv.release))
            .pipe(gulp.dest('.'));
    }
    cb();
});

/******* LESS ******/
gulp.task('styles', [], function () {
    return gulp.src('multiple-date-picker.less')
        .pipe(less())
        .pipe(prefix({cascade: true}))
        .pipe(minifyCSS())
        .pipe(gulp.dest(distFolder));
});

/******* GIT ******/
gulp.task('tag', function(cb){
    git.tag(argv.release, 'release: ' + argv.release, function (err) {
        if (err) throw err;
    });
    cb();
});

gulp.task('add', function(){
    return gulp.src('.')
        .pipe(git.add({args: '-A'}));
});

gulp.task('commit', function(){
    return gulp.src('.')
        .pipe(git.commit('release: ' + argv.release));
});

gulp.task('push', function(cb){
    git.push('origin', 'master', {args: "--follow-tags"}, function (err) {
        if (err) throw err;
    });
    cb();
});

gulp.task('create-and-push-release', ['uglify', 'styles', 'version'], function(cb){
    if(!argv.release){
        throw new Error('Need a version to tag, use --release=YOUR_VERSION');
    }
    runSequence('copy', 'add', 'commit', 'tag', 'push', cb);
});

/******* COMMAND LINE TASKS ******/
gulp.task('default', ['uglify', 'styles']);
gulp.task('release', ['create-and-push-release']);