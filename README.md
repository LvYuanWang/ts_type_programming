## 索引签名(映射)类型

```typescript
type User = {
  name: string
  age?: number
  sex?: string
}
```

前面的代码中，我们可以通过修饰符`?`限定有哪些属性值，但是最多也就是name，age和sex这三个属性，无非也就是age和sex这两个属性写与不写的问题了。

如果希望在Typescript中也能动态的添加属性，还是不行，这个时候我们可以借助**索引签名类型（Index Signatures）**

```typescript
type User = {
  [key: string]: string
}
const user: User = {
  name: 'hayes',
  sex: '男'
}
```

> `[key:T]:U`这种写法称为索引签名，相当于通过这种简单的方式告诉Typescript，指定的对象可能有更多的键。基本的意思是：“在这个对象中，类型为T的键，对应的值为U类型”

在这个例子中我们声明的键的类型为 string（`[key: string]`），这也意味着在实现这个类型结构的变量中**只能声明字符串类型的键**

但由于 JavaScript 中，对于 `user[prop]` 形式的访问会将**数字索引访问转换为字符串索引访问**，也就是说， `user[123]` 和 `user['123']` 的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此：

```javascript
const user: User = {
  name: 'hayes',
  sex: '男',
  123: '123',
  [Symbol('a')]: 'symbol'
}
```

索引签名类型也可以和具体的键值对类型声明并存，但是需要注意，**具体的键值类型也需要符合索引签名类型的声明**：

```typescript
type User = {
  [key: string]: string
  name: string
  // age:number //error
}
```

如果希望这里的age不报错，上面的索引签名类型**可以使用联合类型**

```typescript
type User = {
  [key: string]: string | number | symbol | undefined
  name: string
  age:number 
}
```

> 索引签名类型最常见场景是在重构 JavaScript 代码的时候或者创建类型声明的时候，为内部属性较多的对象声明一个 any 的索引签名类型，以此来暂时支持**对类型未明确属性的访问**

```typescript
type AnyTypeHere = {
  [key: string]: any;
}
```

而且，之前我们必须声明属性明确的对象字面量类型，这对于有些时候声明一个空的对象就不太友好，但是又不能直接声明对象为obj，那么这里的索引签名类型就非常合适这个场景了。

```typescript
type AnyTypeHere = {
  [key: string]: any;
}

let obj: AnyTypeHere = {
  name: "jack",
  age: 13
}
```

其实，Typescript也专门提供了一个类似的工具类型[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)，方便这种情况我们的使用