to-do tasks:

## gulp-flow:
0. html处理
	- 压缩

1. 图片处理
	- 压缩
	- 精灵图合并
	- 响应式处理：不同屏幕手机请求大小不同的尺寸
    
2. css处理
	- 压缩
	- base64处理
	- 合并（备选）

3. js处理
	- 压缩
	- 合并（备选）
    
4. 项目增量处理

   -  只对变动的文件处理，而不是全局处理
   -  全局监听文件，配合SVN更新代码就监听变化，进而触发增量处理
   
5. 开发调试

sourcemap建立源文件与构建文件的映射关系，使得调试方便，若为开发模式，就开启sourcemap生成，如为发布模式，可关闭sourcemap生成，针对项目而言，我们需要在发布前就行增量处理，开发阶段不需要关心构建过程，所以，配置可以设置为发布模式，即取消sourcemap生成。

要尝试使用带sourcemap的构建，可以将sourcemap文件写到特定文件夹中，无需使用默认方式
    
## lazysizes

实现懒加载

## 预测加载

预计用户行为加载


## 首屏输出、白屏
首屏依赖资源的加载优化

对首页加载的fw.all.js进行拆分，合并首页展现必须的文

- progress.js: 首页进度图
- modernizr: 特性组合探测库
- isScroll: 滑动特效等
- Hightcharts/echarts: 数据可视化库
- touchjs.min：手势库
- H5lock: 锁屏库
- twemoji：表情库
- swiper： slide库

## 首页到发现页跳转卡顿

## gulp-if 区分开发与构建