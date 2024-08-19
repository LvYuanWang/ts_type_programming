### 分布(分发)式条件特性

条件类型在结合**联合类型+泛型**使用时，会触发分布式条件特性

| 分布式条件类型                                  | 等价于                                                       |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `string extends T ? A : B`                      | `string extends T ? A : B`                                   |
| `(string | number) extends T ? A : B`           | `(string extends T ? A : B) | (number extends T ? A : B)`    |
| `(string | number | boolean) extends T ? A : B` | `(string extends T ? A : B) | (number extends T ? A : B) | (boolean extends T ? A : B)` |

上节课不是写过这样的类型工具吗

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"abc">; // true
type D = IsString<123>; // false
```

如果我们传入的`T`是一个联合类型，那么就会触发分布式特性

```typescript
type IsString<T> = T extends string ? 1 : 2;
type E = IsString<"a" | true | 1>; // 1 | 2
```

我们可以写的再灵活一些。比如我们定义下面的类型：

```typescript
type MyInclude<T, U> = T extends U ? T : never;
```

我们可以这样使用：

```typescript
type A = "a" | "b" | "c";
type B = "a" | "b";
type C = MyInclude<A, B>; // a | b
```

其实`MyInclude`干了类似于下面的事情：

```typescript
type C = MyInclude<"a", "a" | "b">
  | MyInclude<"b", "a" | "b">
  | MyInclude<"c", "a" | "b">; 
```

我们可以替换为具体的定义来理解一下：

```typescript
type C = ("a" extends "a" | "b" ? "a" : never)
	| ("b" extends "a" | "b" ? "b" : never)
	| ("c" extends "a" | "b" ? "c" : never)
```

这样其实得到结果：

```typescript
type C = "a" | "b" | never
```

最后根据never的特性，直接省略掉，得到最后的结果

```typescript
type C = "a" | "b"
```



上面`MyInclude`这个代码例子其实完全可以反过来，又形成另外一个类型：

```typescript
type MyExclude<T, U> = T extends U ? never : T;

type A = "a" | "b" | "c";
type B = "a" | "b";
type C = MyExclude<A, B>; // c
```

大家可以按照上面的步骤，自行分析一下

`MyInclude`实际上是[Extract<Type, Union>](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)工具类型的实现

`MyExclude`实际上是[Exclude<UnionType, ExcludedMembers>](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)工具类型的实现

根据[Exclude<UnionType, ExcludedMembers>](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)和[Pick<Type, Keys>](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)工具还能实现和[Pick<Type, Keys>](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)工具相反的效果

```typescript
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>> 
```

```typescript
type Foo = {
	name: string
	age: number
}

type Bar = MyOmit<Foo, 'age'> //{ name: string }
```

MyOmit的实现，其实就是[Omit<Type, Keys>](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)工具类型的实现

这几个工具，我们可以做个案例来练习一下，比如有如下对象字面量类型：

```typescript
type User = {
  id: number
  name: string
  age: number
  tel: string
  address: string
}
```

现在希望实现一个工具类型，将选择键名设置为可选，比如，如果设置age，tel和address，那么经过工具类型转换之后，上面的类型别名就会变为：

```typescript
type User = {
  id: number
  name: string
  age?: number
  tel?: string
  address?: string
}
```

```typescript
// type RequiredPick = Omit<User, "age"|"tel"|"address"> 
// type PartialPick = Partial<Pick<User, "age" | "tel" | "address">>

// type OptionalPick = RequiredPick & PartialPick
// let user: OptionalPick = {
//   id: 1,
//   name: "John",
// }

type OptionalPick<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>; 

let user: OptionalPick<User, "address" | "age" | "tel"> = {
  id: 1,
  name: "John",
}
```



最后，**触发分布式条件类型需要注意两点：**

1、类型参数需要通过泛型参数的方式传入，也就是下面这种直接写死的是不行的

```typescript
// 始终都是"no"
type A = string | number | boolean extends string | number ? "yes" : "no";  
```

2、类型参数需要是一个联合类型，并且条件中的泛型参数不能被包裹，比较下面两个结果的区别

```typescript
type B<T> = T extends any ? T[] : never;
type C<T> = [T] extends any ? T[] : never;

type D = B<string | number>;  // string[] | number[]
type E = C<string | number>;  // (string | number)[]Ò
```
