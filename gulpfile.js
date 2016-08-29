var gulp     = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    $        = require('gulp-load-plugins')(),
    del      = require('del');


var config = {
    baseDir: 'fclc2-bk/',
    //css path
    cssPath: 'res/css/',
    imagePath: 'res/img/',
    jsPath: 'res/js/',

    //build dest path
    //buildPath: 'build/'
    buildPath: 'fclc2/',
    configPath: '../project/fc2/hybrid/'
};

//排除路径
var exclude = {
    cssPath: 'res/css/global/'

};


/*
 *构建文件的两种方式
 * 1. 源文件操作
 * 2.另外文件夹生成
 * */
//无需额外处理文件的复制
gulp.task('assert:copy', function () {
    gulp.src([config.baseDir + '*.manifest', config.baseDir + 'VERSION'])
        .pipe(gulp.dest(config.buildPath));

    gulp.src([config.baseDir + config.jsPath + 'global/app_worker.jsworker', config.baseDir + config.jsPath + 'global/version.json'])
        .pipe(gulp.dest(config.buildPath + config.jsPath + 'global'));

    gulp.src(config.baseDir + 'res/webfont/*')
        .pipe(gulp.dest(config.buildPath + 'res/webfont/'));

});


//html压缩
gulp.task('html:build', function () {
    gulp.src(config.baseDir + '**/*.html')
        .pipe($.plumber())
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.buildPath))
});

//css压缩，可以是多个src dest,不需要压缩的文件直接就src==>dest就好,相当于复制
gulp.task('css:minify', ['css:prefixer'], function () {
    gulp.src(config.baseDir + config.cssPath + '**/*.css')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('../sourcemaps'))
        .pipe(gulp.dest(config.buildPath + config.cssPath))

});

/*
 *1. autoprefix
 *2 browser需要定义的前缀
 **/
gulp.task('css:prefixer', function () {
    return gulp.src(config.baseDir + config.cssPath + '**/*.css')
        .pipe($.plumber())
        .pipe($.autoprefixer({
            browser: ['> 15%', 'Android >= 4.0', 'last 3 Safari versions', 'iOS >= 8'],
            cascade: false,
            remove: true
        }))
});

//资源base64替换
gulp.task('css:base64', function () {
    return gulp.src(config.baseDir + config.cssPath + '**/*.css')
        .pipe($.plumber())
        .pipe($.cssBase64({
            maxWeightResource: 8000
        }))
});

gulp.task('css:build', ['css:prefixer', 'css:minify']);

//图片
gulp.task('image:minify', function () {
    gulp.src(config.baseDir + config.imagePath + '**/*.{png,jpg,gif,ico}')
        .pipe($.plumber())
        .pipe($.cache($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(config.buildPath + config.imagePath))
});

//图片构建任务
gulp.task('image:build', ['image:minify']);

/*
 *1. 不同屏幕请求不同尺寸的图片
 *2. 通过这个任务可以处理某一图片为多种尺寸
 *3. src定义为特定的文件夹，处理后再放置到指定资源路径中
 *4. 接力压缩处理
 *5. 一般设计切图为750px
 *6. 需要配合 img srcset sizes实现响应式和按需加载
 * */
gulp.task('image:responsive', function () {
    //路径处理
    return gulp.src('*.{jpg,png}')
        .pipe($.plumber())
        .pipe($.responsive({
            // Convert all images to JPEG format
            '*': [{
                // image.jpg is 375 pixels wide
                width: 375,
                rename: {
                    extname: '.jpg'
                },
            }, {
                // image@2x.jpg is 480 pixels wide
                width: 480,
                rename: {
                    suffix: '@2x',
                    extname: '.jpg',
                },
            }, {
                // image@3x.jpg is 768 pixels wide
                width: 750,
                rename: {
                    suffix: '@3x',
                    extname: '.jpg',
                },
            }],
        }))
        .pipe(gulp.dest('dist'));
});

/*
 *1. 精灵图、css自动化生成
 *2. 对全局使用的可精灵化的图生成
 *@cssFormat: css, scss
 **/
gulp.task('image:sprite', function () {
    var spriteDatas = gulp.src('image/*.png')
        .pipe($.plumber())
        .pipe($.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            cssFormat: 'scss'
        }));
    spriteDatas.img.pipe(gulp.dest('build/img/'));
    spriteDatas.css.pipe(gulp.dest('build/css'));
});

/*
 *1. js压缩
 *2. 开发 sourcemaps生成
 *3. 构建无需生成
 **/
gulp.task('js:minify', function () {
    gulp.src([config.baseDir + config.jsPath + '**/*.js'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.uglify({
            preserveComments: 'license'
        }))
        .pipe($.sourcemaps.write('../sourcemaps'))
        .pipe(gulp.dest(config.buildPath + config.jsPath));

});

//js构建任务
gulp.task('js:build', ['js:minify']);

//default task
gulp.task('build', ['js:build','css:build', 'image:build', 'html:build', 'assert:copy']);

//del the sourcemaps
gulp.task('del', function () {
    del(config.buildPath + 'res/sourcemaps');
});

//watch
gulp.task('watch', function () {
    gulp.watch(config.baseDir + config.jsPath + '**/*.js', ['js:build']);
    gulp.watch(config.baseDir + config.cssPath + '**/*.css', ['css:build']);
    gulp.watch(config.baseDir + '**/*.html', ['html:build']);
    gulp.watch(config.baseDir + config.imagePath + '**/*', ['image:build']);
});


