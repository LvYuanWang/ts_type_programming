## 分发逆变推断

根据函数的型变，可以做出一些比较复杂的类型体操变化

实现高级工具类型函数：联合类型转为交叉类型

```typescript
type I = UnionToIntersection<{ id: 1 } | { name: "jack" } | { sex: "男" }>; 
// { id: 1 } & { name: "jack" } & { sex: "男" }
```

在所有类型转换中，联合转交叉可以说是比较有难度的了

核心在于其他类型都有比较简单的遍历方法，比如元组的 `T extends [infer F, ...infer R]`，对象的 `[P in keyof T]: T[P]`，还有字符串的遍历套路，在这些类型中，转交叉其实非常简单。这里以元组为例：

```typescript
type TupleToIntersection<T extends any[]> =
  // 递归复用遍历
  T extends [infer F, ...infer R]
    ? // 元素交叉即可
      F & TupleToIntersection<R>
    : unknown;  // any & unknown = any 所以当 T 为空时，返回 unknown不影响结果

// MyType = {id: 1} & {name: 'jack'}
type MyType = TupleToIntersection<[{ id: 1 }, { name: 'jack' }]>;
```

但是对联合类型就麻烦了，因为我们无法把联合类型一个一个拉出来进行遍历，联合类型只有分布式(分发)特性。但是分发特性也是从一个联合类型返回一个新的联合类型，并不能转成交叉类型。

那么这个题，可以通过利用联合类型的`分布式特性` + `逆变特性` + `infer类型推断`实现这个效果

```typescript
type UnionToIntersection<U> =
  // 利用分发特性生成 
  // (arg: { id: 1 }) => any | 
  // (arg: { name: "jack" }) => any | 
  // (arg: { sex: "男" }) => any
  (U extends any ? (arg: U) => any : never) extends (arg: infer P) => any
    ? P // 利用逆变特性，P = { id: 1 } & { name: "jack" } & { sex: "男" }
    : never;
```

函数参数逆变的特性不知道大家有没有忘记：

```typescript
type C = { id: 1, name: "jack", sex: "男" } extends { id: 1 } ? 1 : 2; // 1

type D = ((arg: { id: 1 } ) => any) extends 
	((arg: { id: 1, name: "jack", sex: "男" }) => any) 
	? 1 : 2;  //1
```



