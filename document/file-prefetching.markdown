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
- iframe
利用iframe，配合合并压缩的样式，脚本文件，有效减少HTTP请求。关键在于，哪些资源可以合并，需要合并。

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
  
  - 添加到可以某些页面或者主页：
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
(function (window, document) {
    /*!
     *@method: prefetchResource
     *@method: createNode
     *@pram: arr
     *@pram: resourceType
     *@callback: callback
     *@return: Prefetch object
     *@author: tab
     */
    function prefetchResource(arr, resourceType, callback) {

        var type = resourceType || 'script';

        //get the resource and cache them all with Image instance
        var urlCache = [];

        arr.forEach(function (element) {
            //cache the resource
            var img = new Image();
            img.src = element;

            //error events
            img.onload = img.onerror = function (e) {
            if (typeof callback === 'function') {
                callback();
                } else {
                console.log('Good Job! The ' + element + ' has been cached!');
                document.cookie = 'isCache=true';
            };

            //element will ok too!
            urlCache.push(img.src);
        });

        //获取已缓存的资源地址,insert to top window document
        setTimeout(function () {
            var time = new Date();
            console.log(time);
            urlCache.forEach(function (element) {
                createNode(element, type);
            });
        }, 3e3);
    }

    //create and run it
    function createNode(url, resourceType) {
        var type = resourceType,
                nodesFragment = document.createDocumentFragment(),
                //get the top window context
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

    var Prefetch = {
        load: prefetchResource,
        create: createNode
    }

    //暴露
    window.parent.Prefetch = window.Prefetch = Prefetch;

    return Prefetch;


})(window, document);
```

结果

![beforeCache.PNG](https://ooo.0o0.ooo/2016/09/02/57c8f468a14de.png)
![afterCache.PNG](https://ooo.0o0.ooo/2016/09/02/57c8f46893d4d.png)

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

这里怎么办么？没有思路呀！


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