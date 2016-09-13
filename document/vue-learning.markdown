# Vue
- reactive data binding
- composable view components
-  focused on views only
- powering sophisticated SPA

## Reactive Data Binding

- sync data extramely simple

1. View bind to Data

embraces the concept of data-driven view: use **special** syntax in our normal HTML templates to "bind" the DOM to the underlying data. once the bindings are created, the DOM will then to be kept in sync with the data.

![data binding](https://vuejs.org/images/mvvm.png)

simplest example:
```html
<div id="example-1">
  Hello {{ name }}!
  </div>
```

```js
var data = {
  name: 'Vue.js'
  };
  
var VM = new Vue({
  el: '#example-1',
  data: data
  });
  ```
 > Hello Vue.js 

This looks simple,but the dirty work has been handed by vue!!!
Difference with render HTML template OR even render HTML as string directly in JS

- No more DOM manipulating
- No more redundancy (This is fuck stupit things once you get another project)

As above:

 enhanced HTML template with bindings: declarative mapping of the underlying data state, which is in turn just plain JavaScript objects. That means our view is entirely **data-driven**.
 
2. Data bind to View 

```html
<div id = "example-2">
<p v-if="greeting">Hello</p>
</div>
```

```js
var exmapleVM2 = new Vue({
  el: '#exmaple-2',
  data: {
    greeting: true
    }
})
```

3.More

Powerfull transition system that can automatically apply transition when elements are inserted/removed by Vue.

## Component System

using CS, we can build large-scale application easily. and it's a abstraction that allow us to build the large-scale applications composed of small, self-containerd, and often reusable components. below, That a component tree:

![component tree](https://vuejs.org/images/components.png)

Code  as imaging:

```html
<div id="larget-app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
  </div>
```
## Vue Instance

### Constructor

With Vue constructor, we can create a *root Vue Instance* easily:

```js
var vm = new Vue( {
  //options
});
```
Once you instantiate a Vue Instance,you need to pass a options object contains **data, template, element to mount, methods, lifecycle, lifecycle callbacks and more**. The Vue constructor can be extended to create reusable **component constructors** with pre-defined options:

```js
var Mycomponent = Vue.extend( {
  //extension options
});
// all instances of 'Mycomponents' are created with the pre-defined extension options
var myComponentInstance = Myconponent( );
```

### Properties and Methods

Each Vue instance proxies all the properties fond in **data** object:

```js
var data = {a: 1};
var vm = new Vue({
  data: data
  });
  vm.a === data.a;
```
In addition, Vue instance expose a number of usefull instance properties and methods with prefixed **$** to diff from proxied data properties.

```js
var data = {a:1};
var vm = new Vue( {
  el: "#example",
  data: data
  });
vm.$data === data; //true
vm.$el = document.getElementById('exmaple'); //true
vm.$watch('a', function(newVal, oldVal) {
  //this callback will be called when vm.a changes
  });
  ```
### Instance Lifecycle

Each Vue instance goes through a series of initialization steps when it's created, for example:
- set up data observation
- compile the template
- create the necessary data binding
- ...

Along, it will also invoke some lifecycle hooks(译：生命周期事件), whick give us the opportunity to excute custom logic. For example, the **created** hook is called after the instance is created:

```js
var vm = new Vue( {
  data: {
    a: 1
    },
    created: function() {
      console.log('a is: ' + this.a);
      }
 })
 ```
There are also other hooks which will be called at different stages of the instance's lifecycle, for example, **compiled, ready, destroyed**.But where is the controllers? In vue there are no controllers!! Your cunstom logic for a component would be split among these hooks.

### Lifecycle Diagram

![lifecycle diagram](https://vuejs.org/images/lifecycle.png)




  

  



 
 
- 