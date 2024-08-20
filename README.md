### `infer` 

通过使用`infer`关键字，还可以在**条件类型中声明泛型类型**。

```typescript
// type Flatten<T> = T extends any[] ? T[number] : T;
type Flatten<T> = T extends (infer U)[] ? U : T;
type T1 = Flatten<number[]>; // number
type T2 = Flatten<string>; // string
const arr = [
  { id: 1, name: "aaa" },
  { id: 2, name: "bbb" },
  { id: 3, name: "ccc" }
];

// 对象字面量类型 {id: number, name: string}
type T3 = Flatten<typeof arr>;
```

对比之前方括号运算符`T[number]`其实使用`infer`关键字之后，我们的类型代码更易读了。如果你不是对方括号运算符那么的熟悉，`T[number]`的写法本身就很具有迷惑性。

`infer`，意为推断，如 `infer U` 中 `U` 就表示 **待推断的类型**，你完全可以先把这里的`infer U`看做`any`，当执行时，typescript推导出具体的类型，并将类型赋值给`U`

比如，我们希望获取数组第一个元素的类型：

```typescript
type arr1 = ['a', 'b', 'c'];
type arr2 = [3, 2, 1];

type F1 = First<arr1>; // 'a'
type F2 = First<arr2>; //  3
```

我们可以通过infer进行推断，把第一个元素和其他元素分开，再连成一个数组就好。

```typescript
type First<T extends any[]> = T extends [infer F, ...infer R] ? F : never;
```

当然，其实也可以用`T[K]`，使用方括号运算符

```typescript
type First<T extends any[]> = T extends [] ? never : T[0];
```

`T[0]`其实就是获取第0个位置上元素的类型，这里判断`T`和一个空元组的兼容性，也就是T不是一个空元组，那就得到第0个位置上元素的类型。

其实还能有下面的写法：

```typescript
type First<T extends any[]> = T['length'] extends 0 ? never : T[0];
```

`T['length']`可以获取length属性的类型，其实也就是数组长度，不是0的话，得到第0个位置上元素的类型

```typescript
type ArrayLength<T extends any[]> = T['length'];

type L1 = ArrayLength<arr1>; // 3
```

继续，交换元组两个位置上的类型

```typescript
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type S1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type S2 = Swap<[1,2,3,4]>; // 不符合元组结构，直接返回原数组[1,2,3,4]
```

当然，如果你希望无论如何数组的首位都进行交换，一样简单，加上**`...`操作符**即可

```typescript
type Swap<T extends any[]> = T extends [infer A, ...infer Rest ,infer B] ? [B,...Rest, A] : T;
```

同样，函数也能进行推断

```typescript
type GetReturnType<T> = T extends (...args: any[]) => infer R 
  ? R
  : never;

// string 
type A = GetReturnType<() => string>
// void
type B = GetReturnType<(n: number) => void>
// number
type C = GetReturnType<() => number>
```

`GetReturnType`实际上是[`ReturnType<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)的具体实现