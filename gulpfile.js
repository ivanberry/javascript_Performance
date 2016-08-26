var gulp     = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    $        = require('gulp-load-plugins')();


var config = {
    baseDir: 'fclc2-bk/',
    //css path
    cssPath: 'res/css/',
    imagePath: 'res/img/',
    jsPath: 'res/js/',

    //build dest path
    //change the dist file to 8081 server
    //buildPath: 'build/'
    buildPath: 'fclc2/',
    configPath: '../project/fc2/hybrid/'
};

var exclude = {
				jsPath: 'res/js/global/**'
				};

//html压缩
gulp.task('html:build', function () {
    gulp.src(config.baseDir + '**/*.html')
        .pipe($.plumber())
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.buildPath))
});

//css压缩
gulp.task('css:minify', ['css:prefixer'], function () {
    gulp.src(config.baseDir + config.cssPath + '**/*.css')
        .pipe($.plumber())
        .pipe($.cssnano())
        .pipe(gulp.dest(config.buildPath + config.cssPath))

});

//autoprefixer
gulp.task('css:prefixer', function () {
    return gulp.src(config.baseDir + config.cssPath + '**/*.css')
        .pipe($.plumber())
        .pipe($.autoprefixer({
            browser: ['> 15%', 'IE 9', 'Android >= 4.0', 'last 3 Safari versions', 'iOS >= 8'],
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
 * */
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

//js 压缩
gulp.task('js:minify', function () {
    gulp.src([config.baseDir + config.jsPath + '**/*.js'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.uglify({
            preserveComments: 'license'
        }))
        .pipe($.sourcemaps.write('../sourcemaps'))
        .pipe(gulp.dest(config.buildPath + config.jsPath));

//合并公用Js文件

});

//js构建任务
gulp.task('js:build', ['js:minify']);

//default task
gulp.task('default', ['js:build', 'css:build', 'image:build', 'html:build']);

//复制manifest 和 VERSION到项目文件(手动执行过程也不麻烦)
gulp.task('shell', function () {
    gulp.src(config.configPath)
        .pipe($.plumber())
        .pipe($.shell([
            'cp <%= file.path %>/fclc.manifest <%= file.path %>/VERSION <%= file.path %>/fclc2'
        ]))
});
