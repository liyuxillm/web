var gulp = require('gulp');//引入gulp依赖
var spritesmith = require('gulp.spritesmith');//引入合并雪碧图的依赖
var sass = require('gulp-sass');//css预编译语言sass,能将scss文件变为css文件

sass.compiler = require('node-sass');//使用node-sass作为sass的编译器

// 合成雪碧图
gulp.task('sprite', function () {
    var spriteData = gulp.src('img/icons/*{.jpg,.png}')
        .pipe(spritesmith({
            cssOpts: {
                cssSelector: function(item) {
                    // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
                    if (item.name.indexOf('-hover') !== -1) {
                        return '.icons-' + item.name.replace('-hover', ':hover');
                        // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
                    } else {
                        return '.icons-' + item.name;
                    }
                }
            },
            imgName: 'sprite.png',
            imgPath: '../img/sprite.png',
            cssName: '_sprite.scss',
            padding: 40,
            algorithm: "top-down"
        }));
    
    spriteData.img.pipe(gulp.dest('img'));
    return spriteData.css.pipe(gulp.dest('sass/sprites'));
    // spriteData.pipe();
});

// 编译Sass文件为css文件
gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

// 监听scss文件的改动，随时生成新的css文件
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});

// 默认启动的gulp 任务，执行雪碧图生成和监听sass文件的任务
gulp.task('default', gulp.series(gulp.parallel(['sprite', 'sass:watch',])));