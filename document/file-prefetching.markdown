## 构建处理

![11.PNG](https://ooo.0o0.ooo/2016/09/01/57c7841ba2fe3.png)

## 白屏优化
3秒的loading图：

1.优化首屏输出
2.利用iframe加载资源，较少切屏时的卡顿

对于首屏需要加载的文件需要提取处理，并采用内联的方式载入。分离出对应的资源后，利用iframe策略化资源加载。

### 资源拆分与合并
- 首屏
考虑到有3秒的loading图存在，首屏的极速输出要求不高，可最大化利用，不影响页面输出的情况下，加载更多的资源，实现缓存。

 #### iframe资源加载（一）
 
  - 来个独立页面,prefetching.html
  - 页面中是iframe元素,src为**prefetching.html**
  
  ```html
  <html>
  <head>
  <link href="path/to/prefetching-css" />
  ...其他需要预先加载的资
  ...甚至某些图片
  <body>
  <script src='path/to/prefetching-js' />
  </body>
  </html>
  ```
  
  - 添加到可以某些页面：

```html
<iframe src="prefetching.html"></iframe>
```

简单试验后：

- 地址栏回车（非强制刷新）

from cache，缓存

![preching-css.PNG](https://ooo.0o0.ooo/2016/09/01/57c7941ecab5d.png)
![prefetching-js.PNG](https://ooo.0o0.ooo/2016/09/01/57c7941ed8ed5.png)

- ctrl + R （强制刷新）
304，服务器通讯一次

![force-prefetch.js.PNG](https://ooo.0o0.ooo/2016/09/01/57c7944625858.png)
![reforce-prefetch.cs.PNG](https://ooo.0o0.ooo/2016/09/01/57c7944633820.png)

问题：

1. 初次加载iframe浏览器模拟会闪现元素，尽管`display:none; position: absolute;left: -9999px`,手机测试未出现，弱网未测试
2. prefetch.html中的js会执行，这无疑不允许的，占用我们的浏览器线程，影响绘制。
3. 通过iframe 加载 prefetching.html 会影响到当前页面相关资源的加载速度，一旦资源过大，严重影响体验。

#### iframe资源加载（二）

```javascript
 window.onload = function () {
     var i = 0,
           preloadJS = ['res/js/prefetch-test.js'],
           len = preloadJS.length,
           src = [];
     try {
         preloadJS.forEach(function (element) {
             //只缓存资源地址，不运行对应的js文件，并不会运行，要运行必须要appendChild
             var img = new Image();
             img.src = element;
             src.push(img.src);
         });
     } catch (e) {};

     //创建脚本容器
     var scriptsFragment = document.createDocumentFragment(),
         head = document.querySelector('head');

     //获取已缓存的资源地址
     src.forEach(function (element) {
         var script = document.createElement('script');
         script.src = element;
         scriptsFragment.appendChild(script);
     });

     //挂载
     head.appendChild(scriptsFragment);
   };
   
   //抽象方法loadAsync,缺省为javascript脚本
/*!
 *@method: loadAsync
 *@pram: arr
 *@pram: resourceType
 *@return :undefined
 *@author: tab
 */
function loadAsync(arr, resourceType) {

    var type = resourceType || 'script';
    //cache them all with Image instance
    var srcCache = [];
    arr.forEach(function (element) {
        //cache it
        var img = new Image();
        img.src = element;
        //element will ok too!
        srcCache.push(img.src);
    });

    //获取已缓存的资源地址,insert to document
srcCache.forEach(function (element) {

        createNode(element, type);
    });
}

function createNode(url, resourceType) {
    var type = resourceType,
            nodesFragment = document.createDocumentFragment(),
            head = window.parent.document.head,
            node;

    if (type === 'css') {
        node = document.createElement('link');
        node.setAttribute('rel', 'stylesheet');
        node.href = url;

    } else {
        node = document.createElement('script');
        node.src = url;
    }

    nodesFragment.appendChild(node);

    head.appendChild(nodesFragment);

}

//()
try {
    loadAsync(['res/js/prefetch-test.js'], 'script');
    loadAsync(['res/css/prefetch-test.css'], 'css');
} catch (e) {
    console.error(e);
} 
```

问题：

1.消除了第一种方法的js会马上执行的弊端。
2.消除了iframe的闪现(未理清闪现消失的原因)

#### 结合dns-prefetch
```html
<link type="dns-prefetch" href=""  />
```

#### 样式资源的合并策略

- 为什么合并
- 合并的策略是什么

#### 版本更新处理


### 图片懒加载

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

### 构建流程监听CPU占用率过高