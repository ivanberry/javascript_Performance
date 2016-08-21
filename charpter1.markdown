## chapter 1
用脚本实现对DOM的操作代价是十分昂贵的，它是富Web应用最常见的性能瓶颈，有这么三类问题：

- 访问和修改DOM元素
- 修改DOM元素的样式会导致重绘和重排
- 通过DOM事件与用户的交互

## 浏览器中的DOM
文档对象模型（DOM）是一个独立于语言的，用于操作XML和HTML的程序接口（API）。它是一个与语言无关的API，但是它在浏览器的接口是用Javascript实现的，浏览器通常会把DOM和Javascript独立实现，IE中，Javascript中实现名为JScript，位于jscript.dll中，而DOM实现与另一库中，mshtml.dll,称为Trident。

正是它们的分离，直接导致它们俩之间的任何交往都需要通过定义的接口实现，就像两座岛屿的一般，要通过收费桥沟通一样，二者的任何联系必然要有所消耗，联系越多必然也就消耗越多。

## 访问和修改DOM元素

对DOM元素的访问是有代价的，上面我的比喻中的“过桥费”可以形象化，便于理解。而修改元素的代价更高，因为浏览器会重新计算元素的几何变化，重新绘制对应的元素。

其中，最坏的情况就是在循环中访问或修改元素，尤其是HTML元素集合的循环操作。

```javascript
function innerHTMLLoop() {
    for (var i = 0; i <= 12000; i++) {
        document.getElementById('loop').innerHTML += 'a';
    }
}


function innerHTMLLoop1() {
    var content = '';
    for (var i = 0; i<= 12000; i++) {
        content += 'a';
    }

    document.getElementById('loop').innerHTML = content;
}

console.time('loop0');
innerHTMLLoop();
console.timeEnd('loop0');

console.time('loop1');
innerHTMLLoop1();
console.timeEnd('loop1');

```
![时间对比](https://ooo.0o0.ooo/2016/08/20/57b8ff799463b.png)

## HTML集合
HTML集合是包含了DOM节点引用的类数组对象，以下方法会返回一个HTML集合：

- document.getElementsByName()
- document.getElementsByClassName()
- document.getElementsByTagName()

以下属性同样也返回HTML集合：

- document.images
- document.links
- document.forms
- document.forms[0].elements: 第一表单元素的所有元素集合

以上，都返回类数组对象，没有`spice`等方法，但是有`length`属性，还能通过数字索引访问到其中的元素。而DOM标准定义：

> HTML集合以一种**假定时态**实时存在

这意味着当底层文档更新是，它也会自动更新，事实上，HTML集合一直与文档保持着连接，每当你需要最新的信息时，都会重复执行查询的过程，哪怕只是获取集合元素的个数，这正是对HTML集合操作的低效之源。

### 昂贵的集合

实时性演示：意外的死循环

```javascript
var alldivs = document.getElementsByTagName('div');
for (var i = 0; i < alldivs.length; i++) {
	document.body.appendChild(document.createElement('div'));
}
```

为什么这会死一个死循环呢？这不应该就是把当前文档的`div`翻倍吗？这个死循环例子能很好的解释HTML集合的**假定时态**。

因为循环退出的条件`alldivs.length`是会自动更新的。

在循环条件控制语句中读取数组的`length`属性是不推荐的做法，而读取一个数组的`lenght`比读取HTML集合又高效，这里衍生出两种方法：

- 缓存HTML集合的长度为局部变量
- 将HTML集合重置为普通数组

第一种方式很容易操作，我们只需提前声明一个变量来缓存集合的长度，并在循环退出语句中使用该变量，在集合本身不大，即*length*大小不是很大情况下，缓存处理有很大的性能优化：

```js
function loopCacheLenghtCollection() {
	var coll = document.getElementsByTagName('div'),
    	  len = coll.length;
          for (var count = 0; count < len; count++) {
          	/* code here */
          }
}
```

第二种方式，实现也很简单，原理也很简单，类数组对象的*length*查询没有真正数组*length*块：

```js
function toArray(coll) {
    for (var i = 0, a = [], len = coll.length; i < len; i++) {
    	a[i] = coll[i];
    }
    return a;
}

//use
var coll = document.getElementsByTagName('div');
var arr = toArray(coll);
```

## DOM遍历

DOM遍历也是日常中较多接触的，我们最好为特定操作选择最高效的API。

### 获取DOM元素







