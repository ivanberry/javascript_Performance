# 前端开发

前端开发端没有一套完整的流程来实现静态资源的压缩，打包，这导致资源请求数量（http)请求数量过多，导致资源加载缓慢，对于开发流程的优化，首先从资源管理：

- 打包1：
	- css

当前开发过程，对应页面的css文件是通过`Page.reg().css()`方法引入的，也就是说只有注册的页面中才会引入对应的css文件，而一般情况下某页面只有一个css文件，所以某页面的css打包没有必要了。

如果某页面有几个css文件，可以通过配置文件实现打包。

- 打包2：
	- js:

js文件载入策略同css，通过`Page.reg().js()`引入，并且数组的形式传入多个**JS**文件。如果在这之前打包需要的**JS**文件，会出现多页面打包同一文件的情况。

而当前机制是打包了常用**插件**，公用较多的文件


- 压缩：压缩静态资源，减小请求下载时间
	- css
	- js
	- images
	- html

- 图片资源懒加载
	- [lazysizes](https://github.com/aFarkas/lazysizes)

需要解决的问题，不同屏幕下我们的图一般都是一般大，比如首页banner图原始尺寸为750 * X，通过设置`width: 100%`实现响应式适配不同屏幕大小，那么这里就存在一个优化点：
> 我一个小屏幕手机为什么要加载一个这么大图，然后通过适配来改变大小呢？而不是直接适配我屏幕的大小呢？

```html
<!--非响应式懒加载-->

<img data-src="image.jpg" class="lazyload" />

<!--响应式懒加载-->
<img
	data-sizes="auto"
    data-src="xsmall.jpg"
    data-srcset="small.jpg 300w,
    larget.jpg 600w,
    xlarget.jpg 900w" class="lazyload" />
```
自动化图片resize插件：gulp-responsive


图片精灵图处理
- gulp-cssSprite

资源引用base64处理
- gulp-css-base64


### 构建

利用**gulp**，实现一个简单的包含资源打包--压缩的工具流程，基于当前从路由注册的方法，这一策略需要其它的方法：
- 打包、 文件MD5命名、替换
	- gulp-contat
	- gulp-rev
	- gulp-rev-controller

```css
gulp.task('contat', function() {
//待合并文件
	gulp.src(['1.css', '2.css'])
    		//捕获错误
    		.pipe(plumber())
            //合并为
            .pipe(contat('1-2.min.css'))
            //添加MD5后缀
            .pipe(rev())
            //输出到本地
            .pipe(gulp.dest('path/to/dest/css'))
            //生成rev-manifest.json
            .pipe(rev.manifest())
            //保存mainfest.json到本地
            .pipe(gulp.dest('path/to/rev'))
});

gulp.task('rev', function(){
	gulp.src(['path/to/rev/*.json', 'path/to/relativeHTML'])
    		.pipe(revCollector())
            .pipe(gulp.dest('path/to/relativeHTML'))
});
```

- 压缩：
	- css: gulp-cssnano
	- js: gulp-uglify
	- image: gulp-imagemin
	- image cache: gulp-cache（缓存已处理的图片，以处理图片不再次压缩）

- 重命名：gulp-rename

### 使用方法
当前完整子项目开发流程：

- 项目中新建子项目html文件夹(创建投资组合：invest/invest_instance.html)
- res/js下新建子项目js文件夹--js文件书写
- res/css下新建子项目css文件夹--css文件书写
- res/img/下新建子项目图片文件--img资源管理
- route.js中引入js、css依赖
- 开发完毕更新代码至代码库

流程优化：

基于当前项目及项目目录的压缩、打包

基于当前项目的构建，定义**config**


### 后续

模块化开发：
- 代码管理
- 更好利用构建工具
- 作用域管理

### 当前插件(fw.all.js)

- progress.js: 首页进度图
- modernizr: 特性组合探测库
- isScroll: 滑动特效等
- Hightcharts/echarts: 数据可视化库
- touchjs.min：手势库
- ~~H5lock: 锁屏库~~
- ~~twemoji：表情库~~
- swiper： slide库

## 存在问题
1. JS
经初次打包后，页面出现一定问题，需要进一步分析问题本质是压缩工具引起还是语法不规范导致工具压缩出现问题。
	
2. css
打包后出现部分机器的兼容问题，cssnano选项可以定制不移除它认为不必要的prefix。

## 使用

1. 环境依赖

>node v4.5.0 +

>npm v2.15.9 +

```bash
cp gulpfile.js package.josn path/to/project/

npm install
```
复制**gulpfile.sj** **package.json**复制到**fclc2**同级目录

2. 配置问题

其中gulp-responsive 依赖gulp-sharp，按照gulp-sharp，它又依赖node-gyp，需要安装Visual C++编译包，需要windows SDK windows SDK 8,具体实践中解决。

[node-gyp](https://github.com/nodejs/node-gyp)文档有介绍各OS下的安装方法。

>On Windows:

> - Option 1: Install all the required tools and configurations using Microsoft's [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) using npm install --global --production windows-build-tools from an elevated PowerShell or CMD.exe (run as Administrator).
> - Option 2: Install tools and configuration manually:
>
> 	- Visual C++ Build Environment:
>
>		- Option 1: Install [Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools) using the Default Install option.
>
>		- Option 2: Install [Visual Studio 2015](https://www.visualstudio.com/products/visual-studio-community-vs) (or modify an existing installation) and select Common Tools for Visual C++ during setup. This also works with the free Community and Express for Desktop editions.
>    - Install [Python 2.7](https://www.python.org/downloads/) (v3.x.x is not supported), and run npm config set python python2.7 (or see below for further instructions on specifying the proper Python version and path.)
>
>   - Launch cmd, npm config set msvs_version 2015
>If the above steps didn't work for you, please visit Microsoft's Node.js Guidelines for Windows for additional tips.
>

2. docker化


