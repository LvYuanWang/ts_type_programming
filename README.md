## `in` 运算符遍历

前面讲了in运算符在Typescript可以用来检查属性，在控制流中实现对类型的守卫。

除了类型守卫的作用，`in` 运算符还能遍历联合类型的每一个成员类型

```typescript
type U = 'a'|'b'|'c';

type Foo = {
  [key in U]: string;
};
// 等同于
// type Foo = {
//   a: string,
//   b: string,
//   c: string
// };
```

上面的讲解`keyof`的时候，不是用到了这样的写法

```typescript
type A = keyof Person;
```

那完全可以把`keyof`放入到索引中使用

```typescript
type User = {
  readonly id: number,
  name: string
  tel: string
  address?: string
}

type CopyUser = {
  [key in keyof User]: User[key]
}

const u: CopyUser = {
  id: 1,
  name: "aaa",
  tel: "123456",
  address: "beijing"
}
```

现在固定了`keyof User`，那么我们可以使用泛型，增加一般性

```typescript
type Copy<T> = {
  [key in keyof T]: T[key]
};

const u: Copy<User> = {
  id: 1,
  name: "aaa",
  tel: "123456",
  address: "beijing"
}

type Animal = {
  name: string,
  age: number,
  color: string,
  type: string
}

const dog: Copy<Animal> = {
  name: "jack",
  age: 3,
  color: "black",
  type: "dog"
}
```

> **注意：** **`keyof T`** 这两个的结合得到的是一个联合类型`string | number | symbol`，因为`T`是泛型，并不知道`T`类型的每个键到底是什么类型，可以看一下`keyof any`的结果
>
> 当然`[key in keyof T]`现在这样写没有什么问题，但是如果后面要和as，和模板字符串类型连用的话，要注意类型的转换，最好直接让键就是`string`类型
>
> `[key in keyof T & string]`
