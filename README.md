## 条件类型与泛型

条件类型当然可以和泛型结合，然后组合出很多类型编程相关的处理。

我们可以定义一个泛型类型`IsString`，根据`T`的类型，判断返回的具体类型是`true`还是`false`:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"abc">; // true
type D = IsString<123>; // false

```

再来有下面的题目：

实现一个 `IF` 类型，它接收一个条件类型 `C` ，一个判断为真时的返回类型 `T` ，判断为假时的返回类型 `F`。 `C` 只能是 `true` 或者 `false`， `T` 和 `F` 可以是任意类型。

```typescript
type A = If<true, 'a', 'b'>;  // 'a'
type B = If<false, 'a', 'b'>; // 'b'
```

这就非常的简单了：

```typescript
type If<C extends boolean, T, F> = C extends true ? T : F;
```



> 若位于 `extends` **右侧的类型**包含位于 `extends` **左侧的类型**(即**狭窄类型 extends 宽泛类型**)时，结果为 true，反之为 false。
>
> 这对于基础类型和字面量类型来说大家很容易分辨。如果是对象呢？
>
> **当 `extends` 作用于对象时，若在对象中指定的 key 越多，则其类型定义的范围越狭窄**，对象字面量的兼容性问题是我们一直提及的，希望大家注意。

上面这句话，其实我们之前在受限的泛型中已经感受过了

```typescript
type ObjLength = {
  length: number
}

function getObjLength<T extends ObjLength>(obj: T) { 
  return obj;
}
getObjLength("Hello World");
getObjLength([1, 2, 3]);
getObjLength({ id: 1, length: 2 });
```

函数中传入的泛型T只要拥有`length: number`属性，就兼容。在条件类型中同样适用

```typescript
type Result = { a: string, b: boolean } extends { a: string } ? true : false // true
```

`extends`左边的对象字面量类型`{ a: string, b: boolean }`拥有两个属性，右边的对象字面量类型`{ a: string }` 只有一个属性，左边有更多的属性，并且和右边有一样的属性`{ a: string }` 。那么我们就可以说对象字面量类型`{ a: string, b: boolean }`和`{ a: string }` 类型兼容，因此上面的`Result`的类型为`true`

上面的代码中不是写过这样的代码吗？

```typescript
type Message<T extends { message: unknown }> = T['message']

const person = {
  id:1,
  message:"hello"
}

type PersonMessage = Message<typeof person>
```

如果没有message类型现在这里的代码typescript会提示报错，我们也能通过判断让其获取其他类型

```typescript
type Message<T> = T extends { message: unknown } ? T['message'] : never

const person = {
  id:1,
  // message:"hello"
}

type PersonMessage = Message<typeof person>  // never
```

比如还能根据方括号运算符的特点，直接提取数组的类型

```typescript
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number[]>; // number

const arr = [
  { id: 1, name: "aaa" },
  { id: 2, name: "bbb" },
  { id: 3, name: "ccc" }
];

// 对象字面量类型 {id: number, name: string}
type A = Flatten<typeof arr>; 
```

来写一个现在看起来稍微离谱的写法：

```typescript
type GetType<T> = T extends string ? "string"
  : T extends number ? "number"
  : T extends bigint ? "bigint"
  : T extends boolean ? "boolean"
  : T extends symbol ? "symbol"
  : T extends undefined ? "undefined"
  : T extends null ? "null"
  : T extends any[] ? "array"
  : T extends Function ? "function"
  : "object"
  
type T0 = GetType<string> // "string"
type T1 = GetType<123n> // "bigint"
type T2 = GetType<true> // "boolean"
type T3 = GetType<() => void> // "function"
type T4 = GetType<[]> // "array"
type T5 = GetType<{}> // "object"
type T6 = GetType<null> // "null"
```

再来上点难度：**实现泛型工具Merge**

将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。

```typescript
type foo = {
  name: string;
  age: string;
};

type bar = {
  age: number;
  sex: string;
};

type Result = Merge<foo, bar>;
//type Result = {
//  name: string;
//  age: number;
//  sex: string;
//}
```

```typescript
type Merge<F, S> = {
  // 遍历所有的 key,联合类型默认会去重
  [P in keyof F | keyof S]: P extends keyof S // 如果P包含在keyof S中
    ? // 直接取后者的值的类型，保证后者类型覆盖前者
      S[P]
    : // 如果是前者的属性
      P extends keyof F
    ? // 返回前者的类型
      F[P]
    : // 不会走到这一流程
      never;
};
```
