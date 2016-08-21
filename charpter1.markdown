## chapter 1
用脚本实现对DOM的操作代价是十分昂贵的，它是富Web应用最常见的性能瓶颈，有这么三类问题：

- 访问和修改DOM元素
- 修改DOM元素的样式会导致重绘和重排
- 通过DOM事件与用户的交互

### 浏览器中的DOM
文档对象模型（DOM）是一个独立于语言的，用于操作XML和HTML的程序接口（API）。它是一个与语言无关的API，但是它在浏览器的接口是用Javascript实现的，浏览器通常会把DOM和Javascript独立实现，IE中，Javascript中实现名为JScript，位于jscript.dll中，而DOM实现与另一库中，mshtml.dll,称为Trident。

正是它们的分离，直接导致它们俩之间的任何交往都需要通过定义的接口实现，就像两座岛屿的一般，要通过收费桥沟通一样，二者的任何联系必然要有所消耗，联系越多必然也就消耗越多。

### 访问和修改DOM元素

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
![时间对比](./images/loop-assume.png)




