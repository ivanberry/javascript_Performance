## JavaScript 数据结构与算法学习

### JavaScript 环境

#### 函数

JavaScript提供了两种定义函数的方法，一种有返回值，一种没有返回值（子程）。

JavaScript中，函数的参数传递方式都是按值传递，没有按引用传递的参数。但是JavaScript中有保存引用的对象，比如数组，它们是按引用传递的。

#### 变量作用域

变量的作用域是指一个变量在程序中的哪些地方可以访问。JavaScript中的变量作用域被定义为函数作用域。这是指变量的值在定义该变量的函数内是可见的，并且定义在改函数内的嵌套函数中也可以访问该变量。

在主程中，如果在函数外定义了一个变量，那么该变量拥有*全局作用域*，这是指可以在包括该函数体内的程序任何部分访问该变量。

```js
function showScope() {
  return scope;
}

var scope = 'global';
console.log(scope); // 'gobal'
console.log(showScope()); //'gobla'
```
函数showScope()可以访问变量scope，因为scope是一个全局变量。可以在程序的任意位置定义全局变量，比如函数定义前或者函数定义后。

在showScope()函数内再定义一个scope变量：

```js
function showScope() {
  var scope = 'local';
  return scope;
}

var scope = 'global';
console.log(scope); // 'gobal'
console.log(showScope()); // 'local'
```
函数体内定义的变量scope拥有局部作用域，而在主程序中定义的变量scope是一个全局变量。尽管两个变量名字相同，但它们的作用域不容，在定义它们的地方访问时得到的值也不一样。

这些行为是符合预期的，但是，如果我们在定义变量时**省略了关键字var**,那么一切就变啦。JavaScript允许定义变量时不使用关键子var，但这样做的后果是定义的变量自动拥有了全局作用域，即使你是在一个函数内定义的该变量，它也是全局变量。

```js
function showScope() {
  scope = 'local';
  return scope;
}
scope = 'gobal';
console.log(scope); // 'gobal'
console.log(showScope()); // 'local'
console.log(scope); // 'local'
```

前面提到JavaScript是函数作用域，这就意味着它没有块级作用域的概念。

#### 递归

JavaScript中允许函数递归调用:

```js
function factorial(number) {
  if ( number === 1) {
    return number;
    }else {
      return number * factorial( number -1 );
      }
      }
      
console.log(factorial(5));
```

当一个函数被递归调用时，在递归没有完成时，函数的计算结果暂时被挂起。

```js
5 *  factorial(4)
5 * 4 * factorial(3)
5 * 4 * 3 * factorial(2)
5 * 4 * 3 * 2 * factorial(1)
5 * 4 * 3 * 2 * 1
5 * 4 * 3 * 2
5 * 4 * 6
5 * 24
120
```

对于大多数情况，JavaScript都有能力处理递归层次较深的递归调用，但是也不全然，这时我们就需要寻求迭代解决方案。**任何可以被递归定义的函数，都可以别改写为迭代式的程序，要将这点牢记于心**。

## 对象和面向对象编程
本书讨论到的数据结构都被实现为对象。JavaScript提供了多种方式创建和使用对象。
对象通过如下方式创建：定义包含属性和方法声明的构造函数，并在构造函数后紧跟方法的定义。

```js
function Checking(amount) {
  this.balance = amount; //属性
  this.deposit = deposit; //方法
  this.withdraw = withdrawj; //方法
  this.toString = toString; //方法
}
```

this关键字用来将方法和属性绑定到一个对象的实例上：

```js
function deposit(amount) {
  this.balance += amount;
}

function withdraw(amount) {
  if (amount <=this.balance) {
    this.balance -= amount;
  }
  if (amount > this.balance) {
    console.log('余额不足');
  }
}

function toString() {
  return "Balance:" + this.balance;
}

var account = new Checking(500);
account.deposit(1000);
console.log(account.toString()); //存款1500
console.log(withdraw(750)); 
console.log(account.toString()); //存款750
console.log(account.withdraw(800)); //余额不足
console.log(account.toString()); //余额： 750

```

这里，我们又一次使用了this关键字和balance属性，以便让JavaScript解释器知道我们引用的是哪个对象的balance属性。
    
编写出让人容易阅读的代码和编写出让计算机能正确执行的代码同等重要。 

## 数组

数组是计算机编程里最常见的数据结构。任何一种编程语言都包含数组，只是形式上略有不同，数组是编程语言中内建类型，通常效率很高，可以满足不同需求的数据存储。

### JavaScript中对数组的定义

数组的标准定义是：一个存储元素的线性集合，元素可以通过索引来任意存取，索引通常是数字，用于计算元素之间的存储位置的偏移量。几乎所有的编程语言都有类似的数据结构。然而JavaScript的数组却略有不同。

JavaScript中的数组是一种特殊的对象，用来表示偏移量的索引是该对象的属性，索引可能是整数。然而，这些数字索引在内部被转换为字符串类型，这时因为JavaScript对象中的属性必须是字符串。数组在JavaScript只是一种特殊的对象，所以效率上不如其他语言的数组高。

JavaScript中的数组，严格来说应该称为对象，是特殊的JavaScript对象，在内部被归类为数组。由于Array在JavaScript中被当作对象，因此它有许多属性和方法可以在编程时使用。

### 使用数组

JavaScript中数组非常灵活。单是创建数组与存取元素就有好几种，也可以通过不同方式对数组进行查找和排序。

1. 创建数组

最简单的方式：
```js
var arr = [];
```
2. 读取数组

在一条赋值语句中，可以使用[]操作符将数据赋值给数组中的元素，比如下面的循环:

```js
var numbers = [1, 2, 3, 4, 5];
var sum = 0;
for (var i = 0; i < numbers.length; i++) {
  sum += numbers[i];
  }
console.log(sum);
```

3. 由字符串生成数组

调用字符串对象的split方法也可以生成数组。该方法通过一些常见的分割符，比如分隔单词的空格，将一个字符串分成几部分，并将每部分作为一个元素保存于一个新建的数组中。

```js
var sentence = 'the quick brown fox jumped over the lazy dog';
var words = sentence.split(' ');
for (var i = 0; i < words.length; i++) {
  console.log('word' + i + ':' + words[i]);
  }
  ```
 4. 数组的整体性操作

有几个操作是将数组作为整体操作的。首先，可以将一个数组赋值给另一个数组

```js
var nums = [];
for (var i = 0; i < nums.length; i++) {
  nums[i] = i + 1;
}
```
但是，当把一个数组附给另一个数组时，只是为被赋值的数组新增来一个新的引用。当你通过原引用修改来数组的值，另一个引用也会感知到这个变化。下面的代码展示来这种情况：

```js
var nums = [];
for (var i = 0; i < nums.length; i++) {
  nums[i] = i + 1;
}
var samenums = nums;
nums[0] = 400;
console.log(samenums[0]); //400
```
这种行为被称为浅复制，新数组依然指向原来的数组。一个更好的方法是使用深复制，将原数组中的每一个元素都复制到新的数组中。

```js
function copy(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    arr2[i] = arr1[1];
}
}

var nums = [1, 2, 3,4];
var samenums = [];
copy(nums, samenums);
nums[0] = 300;
console.log(samenums[0]); //1
```

### 存取函数
JavaScript提供来一组用来访问数组元素的函数，叫做存取函数，这些函数返回目标数组的某种变体。

1. 查找元素

indexOf()函数是最常用的存取函数之一，用来查找传进来的参数在目标数组中是否存在。如果目标数组包含该参数，旧返回该元素在数组中的索引；如果不包含，旧返回-1.

```js
var names = ['tab', 'shirting', 'T'];
var exist = names.indexOf('D');
if (exist != -1) {
  console.log('Yeeh, I found it');
}else {
  console.log('Soory, There isn't there');
}
```
如果数组中包含多个相同的元素，indexOf()函数总是返回第一个匹配元素的索引。另外,lastIndexOf()函数返回相同元素中最后一个元素的索引，如果没有找到相同元素，则返回-1.

2. 数组的字符串表示

有两个方法可以将数组转化为字符串：join()和toString()。这两个方法都返回一个包含数组所有元素的字符串，个元素之间用逗号隔开。

```js
var nums = [1,2,3,5];
nums.join(); //1,2,3,5
nums.toString(); //1,2,3,5
```
3. 由已有数组创建新数组

concat()和splice()方法允许通过已有数组创建新数组。concat方法可以合并多个数组创建一个新数组，splice方法截取一个数组的子集创建一个新的数组。

我们先看看concat方法的工作原理。该方法的发起者是一个数组，参数是另一个数组。作为参数的数组，其中的所有元素都会链接到调用concat方法的数组后面。
```js
var cis = ['tab', 'love', 'who', 'is'];
var dpm = ['shiring', 'apple'];

var con = cis.concat(dpm);
console.log(con); //['tab', 'love', 'who', 'is', 'shirting', 'apple'
```
concat方法返回浅复制的新数组，而不会对原数组进行修改，对于对象等是索引的复制，而简单数据类型则是对值的复制。

splice方法则是从现有数组中截取一个新的数组。该方法的第一个参数是截取的其实索引，第二个参数是截取的长度：

```js
var cis = ['tab', 'shiriting', 'love', 'each', 'lol'];
var dpm = cis.splice(3, 1);
console.log(dpm); // each
```  
splice方法返回移除的数组，若没有移除元素，返回空数组。

**splice(start[, deleteCount, itemAdd1, itemAdd2])**

- start: 被操作数组起始索引
- deleteCount：移除元素个数，若为0，不移除，若大于数组长度，清空数组
- itemAdd: 新加入元素

```js
var a = ['tab', 'shirting', 'lova'];
var b = a.splice(1, 0, 'yooh');
console.log(a); //['tab', 'shirting', 'yooh', 'lova'];
console.log(b); //[]
```
### 可变函数

JavaScript拥有一组可变函数，使用它们，可以不必引用数组中的某个函数，就能改变数组内容。这些函数常常化繁为简，让困难的事情变得简单：

1. 为数组添加元素

有两个方法可以为数组添加元素：push()和unshift()。push()方法会将一个元素添加到数组末尾：

```js
var nums = [1,2,3,4];
nums.push(8);
console.log(nums); // [1,2,3,4,8]
```
unshift()方法可以将元素添加到数组的开头：

```js
var nums = [2, 3, 4];
nums.unshift(1);
console.log(nums); // [1, 2,3,4]
```

2. 从数组中删除元素

使用pop方法可以删除数组末尾的元素

```js
var nums = [1, 2, 3, 4];
nums.pop(); // 4
console.log(nums); //[1, 2, 3]
```
返回移除的元素，若空数组调用pop方法，则返回undefined。

shift方法可以删除数组的第一个元素：

```js
var nums = [9, 0. 1, 2];
nums.shift(); //9
console.log(nums); // [0, 1, 2];
```

3. 从数组中间位置添加和删除元素

删除数组中的第一个元素和子数组开头添加一个元素存在同样的问题--两者操作都需要将数组中的剩余元素向前或向后移动，然而splice方法帮助我们执行其中任何一种操作。

splice方法为数组添加元素：

**splice(start[, deleteCount, itemAdd1, itemAdd2])**

- start: 被操作数组起始索引
- deleteCount：移除元素个数，若为0，不移除，若大于数组长度，清空数组
- itemAdd: 新加入元素

4. 为数组排序

剩下的两个可变方法是为数组排序。第一个方法reverse(),该方法将数组中的元素顺序进行翻转：

```js
var nums = [1, 2, 4];
nums.reverse();
console.log(nums); // [4, 2, 1];
```

对数组进行排序时经常会遇到的需求，如果元素是字符串类型，那么数组的可变方法sort()就非常好使：

```js
var names = ['Tab', 'Ci', 'Ab'];
names.sort();
console.log(names); //['Ab', 'Ci', 'Tab']
```
但元素是数字类型时，排序结果就不准确了，它是按照字典顺序对元素进行排序的，因此它会假定待排序元素是字符串类型，即使元素是数字类型，也被认为字符串类型。为了让sort()方法也能排序数字类型的元素，可以调用方式时传入一个大小排序比较函数，排序时，sort()方法将根据该函数比较数组中两个元素的大小，从而决定数组的顺序。

对于数字类型，该函数可以是一个简单的相减函数，从一个数字中减去另一个数字。如果结果为负，那么被减数小于减数；如果结果为0，那么被减数与减数相等；如果结果为正，那么被减数大于减数。

```js
function compare(num1, num2) {
  return num1 - num2;
}

var nums = [3, 1.3, 100, 4, 200];
nums.sort(compare);
console.log(nums);
```

sort排序方法是不稳定的，它根据string Unicode code points大小来排序，其中In Unicode, numbers come before upper case letters,
 which come before lower case letters.
 Unicode中，数字排在大写字母前，而大写字母又排在小写字母前。
 
 sort方法返回被排序的数组，即它会修改原数组。
 
 ## 迭代器方法
 
 最后一组方法是迭代器方法。这写方法对数组中的每一个元素应用一个函数，可以返回一个值，一组值或者一个新的数组。
 
 ### 不生成新数组的迭代器方法
 
 我们要讨论的第一组迭代器不产生任何新的数组，相反，它们要么对于数组中的每一元素执行某种操作，要么返回一个值。
 
 1. forEach

**array.forEach(function)**

该方法接受一个函数作为参数，对数组中的每一元素使用该函数。

```js
function square(num) {
  console.log(num, num * num);
}

var nums = [1, 2, 3, 4, 5];
nums.forEach(square);
1 1
2 4
3 9
...
```
2. every

**The every() method tests whether all elements in the array pass the test implemented by the provided function**

*array.every(callback[,thisArg])*

- callback 
  - currentElement (必须）
  - index option
  - array option （执行every的数组）
- thisArg option callback中的this关键字

- return @Boolean 

该函数接受一个返回值为布尔类型的函数，对数组中的每一元素使用该函数。如果对于所有元素，该函数均返回true, 则该方法返回true。

```js
function isEven(num) {
  return num % 2 === 0;
}

var nums = [2, 4, 6, 8 , 10];
var even = nums.every(isEven);
```

- some 跟every类型，只需要有一个元素，使得函数返回值为true，该方法就返回true。

- reduce 

  The reduce() method applies a function against an accumulator and each value of the array (from left-to-right) to reduce it to a single value

  arr.reduce(callback[,initialValue])

- callback 
  - accumulator: 积累值
  - currentValue: 当前值
  - currentIndex: 当前值索引,0或1（无initialValue)
  - array: 被操作数组
  
- initialValue: option， 初始值

**当存在初始值时，currentIndex从0开始，accumlator为第一个元素，索引为0，当不存在初始值时，accumulator和currentValue分别为第一个元素和第二个元素，currentIndex为1，最好提高一个初始值**

```js
[1, 2, 3, 4, 5, 6].reduce(function(accumulator, currentValue, currentIndex, array) {
  return accumulator + currentValue;
 }
);
```
|callback|accumulator|currentValue|currentIndex|array|return
---|---|---|---|---|---|
|first call|1|2|1|[1,2,3,4,5,6]|3
|second call|3|3|2|[1,2,3,4,5,6]|6
third call|6|4|3|[1,2,3,4,5,6]|10
forth call|10|5|4|[1,2,3,4,5,6]|15
fifth call|15|6|5|[1,2,3,4,5,6]|21

reduce就是利用回调函数把数组减少的过程。

带初始值的处理：

```js
[1,2,3].reduce(function(accumulator, currentValue, currentIndex, array) {
  return accumulator + currentValue;
 }, 10);
```
调用|accumulator|currentValue|currentIndex|array|return
---|---|---|---|---|---
1|10|1|0|[1,2,3]|11
2|11|1|1|[1,2,3]|12
3|12|2|2|[1,2,3]|14
4|14|3|3|[1,2,3]|17

reduceRight提供，它从右开始执行，可以利用它翻转字符串数组

```js
var sarray = ['tab', 'shirting'];
sarray.reduceRight(function(accumulator, item) {
  return accumulator + item;
  }
);

console.log(sarray); //shirtingtab
```
### 生成新数组的迭代方法

有两个迭代器方法会生成新数组：map,filter。map和forEach有点像，对数组中每个元素使用某函数。两者区别是`map`返回一个新数组，该数组的元素是对原数组元素应用了某函数得到的结果：

```js
function curve(grade) {
  return grade += 5;
}

var grades = [77, 65, 81, 92 83];
var newgrades = grades.map(curve);
console.log(newgrades); //[82, 70, 86, 97, 88]
```

```js
function first(word) {
  return word[0];
}

var words = ['for', 'your', 'information'];
var acronym = words.map(first);
console.log(acronym.join('')); //fyi
```
filter和every类似，传入一个返回值为布尔值类型的函数。和every方法不同的是，当对数组中所有元素应用该函数，结果为真时，该方法并不返回真，而是返回一个新数组，该数组包含应用该函数后结果为真的元素：

```js
function isEven(num) {
  return num % 2 === 0;
}

function isOdd(num) {
  return num % 2 !== 0;
}

var nums = [];
for (var i = 0; i < 10; i++) {
  nums[i] = i;
}

var evens = nums.filter(isEven);
var odds = nums.filter(isOdd);
```

利用filter函数还可以过滤字符串数组，下面的例子用来过滤字符串数组中结尾不含cie的单词：

```js
function nocie(str) {
  if (str.indexOf('cie') > -1) {
    return true;
  }
  return false;
}

var words = ['tcie', 'tab', 'shircie', 'ss']'
var nocieA = words.filter(nocie);
console.log(nocieA); // ['tcie', 'shircie']
```
## 创建多维数组

### 创建二位数组

二维数组类似一种由行和列构成的数据表格。在Javascript中创建二维数组，需先创建一个一维数组，然后让数组的每一元素也是一个数组。最起码，我们需要知道二维数组要包含多少行，那么，我们可以创建一个n行1列的二维数组：

```js
var tword = [];
var rows = 5;
for (var i = 0; i < rows; i++) {
  tword[i] = [];
}
```
这样做存在一个问题，这使得数组中每一个元素都是undefined，以下是JavaScript：最佳实践中的一个方法实例：

```js
Array.matrix = function(numrows, numcols, initial) {
var arr = [];
for (var i = 0; i < numrows; i++) {
  var colums = [];
  for (var j = 0; j < numcols; j++) {
    colums[j] = initial;
  }
  arr[i] = colums[j];
 }
return arr;
}
```

### 处理二维数组的元素

处理二维数组中元素的，有两种最基本的方式：按列访问和按行访问。对于两种方式，我们均使用一组嵌入式的for循环。对于按列访问，外层循环对应行，内层循环对应列：

```js
var grades = [[90,80,75],[88,72,66],[86,68,99]];
var total = 0;
var average = 0.0;
for (var row = 0; row < grades.length; row++) {
  for (var col = 0; col < grades[row].length; col++) {
    total += grades[row][col];
  }
  average = total /grades[row].length;
  console.log('Student' + pareseInt(row + 1) + 'average: " + average.toFixed(2);
  total = 0;
  average = 0.0;
}
```
内层循环由一下表达式控制：

`col < grades[row].length`

它之所以可行，是因为每一行都是一个数组，我们可以使用数组的length属性来判断每行包含多少列。

对于按行，指需稍微调整for循环的顺序，使外层循环列，内层循环对应行即可，我们来计算各科平均成绩：

```js
var grades = [[90,80,75],[88,72,66],[86,68,99]];
var total = 0;
var average = 0.0;
for (var col = 0; col < grades.length; col++) {
  for (var row = 0; row < grades[row].length; row++) {
    total += grades[col][row];
  }
  average = total /grades[col].length;
  console.log('Student' + pareseInt(col + 1) + 'average: " + average.toFixed(2);
  total = 0;
  average = 0.0;
}
```

### 参差不齐的数组

参差不齐的数组是指数组中每一行的元素个数彼此不同。有一行可能有三个元素，另一行可能包含5个元素，有些行甚至只有一个元素。很多编程语言对这类数组表现都不是很好，而JavaScript反而表现还行。

```js
var grades = [[89, 77],[76, 82, 81],[91, 94, 89, 99]];
  var total = 0;
  var average = 0.0;
  for (var row = 0; row < grades.length; ++row) {
  for (var col = 0; col < grades[row].length; ++col) {
     total += grades[row][col];
  }
  average = total / grades[row].length;
  print("Student " + parseInt(row+1) + " average: " + average.toFixed(2));
  total = 0;
  average = 0.0;
}
```

## 对象数组

到现在为止，我们讨论的数组基本都是基本数据类型的数据，比如数字和字符串。数组还可能包含对象，数组的方法和属性对对象依然适用。

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

function displayPts(arr) {
  for (var i = 0; i < arr.length; i++) {
    console.log(arr[i].x + ', ' + arr[i].y);
  }
}

var p1 = new Point(1, 2);
var p2 = new Point(3, 5);
var p3 = new Point(2, 8);
var p4 = new Point(4, 4);
var points = [p1, p2, p3, p4];
for (var i = 0; i < points.length; i++) {
  console.log('Point ' + parseInt(i+1) + ': ' + points[i].x + ', ' + points[i].y;
}

var p5 = new Point(12, -3);
points.push(p5);
displayPts(points);
points.shift();
displayPts(points);
```

## 对象中的数组

在对象中，可以使用数组存储复杂的数据，大多情况下，很多数据被实现为一个对象，对象内部使用数组保存数据。

下面的例子用到很多书中的技术，例子中，我们创建一个对象，用于保存观测到的周最高气温。该对象有两个方法，一个方法用来增加一条新的气温记录，另外一个方法用来计算存储再对象中的平均气温：

```js
function weekTemps() {
  this.dataScore = [];
  this.add = add;
  this.average = average;
}

function add(temp) {
  this.dataScore.push(temp);
}

function average() {
  var total = 0;
  for (var i = 0; i < this.dataStore.length; i++) {
    total += this.dataScore[i];
  }
  return total / this.dataScore.length;
}

var thisWeek = new weekTemps();
thisWeek.add(52);
thisWeek.add(60);
thisWeek.add(62);
thisWeek.add(42);
thisWeek.add(22);
thisWeek.add(62);
console.log(thisWeek.average()); //
```
add方法中用到了数组的push方法，将元素添加到数组的dataStore中，为什么这个方法名要叫add而不是Push呢？这是因为在定义方法时，使用一个更直观的名字是常用的技巧，而不是所有人都只知道Push是什么意思，但是所有人知道add一个元素是什么意思。

## 练习



