## 条件类型与类型兼容性

条件类型是ts中非常强大的功能，看起来有点像 JavaScript 中的条件表达式（`条件 ? true 表达式 : false 表达式`）：

> SomeType extends OtherType ? TrueType : FalseType
>
> 当 `extends` 左边的类型可以赋值给右边的类型时（`extends`左边的类型与右边兼容时），你将获得第一个分支（“true” 分支）中的**类型**；否则你将获得后一个分支（“false” 分支）中的**类型**。

不过首先要解惑的是，为什么使用`extends`?，而不是`===`或者其他运算符。

> 这是因为在类型层面中，对于能够进行赋值操作的两个变量，我们**并不需要它们的类型完全相等，只需要具有兼容性**，而两个完全相同的类型，其 extends 自然也是成立的。

```typescript
type T = 1 extends number ? true : false;  // true
```

在实际操作中，我们经常会使用条件类型来判断一个类型和另一个类型是否兼容

```typescript
type T1 = 1 extends number ? true : false;  // true
type T2 = "1" extends number ? true : false;  // false
type T3 = string extends object ? true : false;  // false
type T4 = { a: 1 } extends object ? true : false;  // true
type T5 = { a: 1, b: 2 } extends { a: 1 } ? true : false;  // true
type T6 = { a: 1 } extends { a: 1, b: 2  } ? true : false;  // false
type T8 = string extends {} ? true : false; // true
```

大家可以下去自己慢慢测试类型兼容性。

但是，下面的代码会让你产生困惑：

```typescript
type T9 = {} extends object ? true : false; // true
type T10 = object extends {} ? true : false; // true
type T11 = {} extends Object ? true : false; // true
type T12 = Object extends {} ? true : false; // true
type T13 = Object extends object ? true : false; // true
type T14 = object extends Object ? true : false; // true
```

这三个建议大家不需要细究，知道他们有这个问题：你中有我，我中有你。这是**TS“系统设定”**的问题。

记住给大家的这个图：

> **原始类型 < 原始类型对应的装箱类型 < Object 类型**

其实还有更神奇的：

```typescript
type T15 = string extends any ? true : false; // true
type T16 = Object extends any ? true : false; // true
type T17 = Object extends unknown ? true : false; // true

type T18 = any extends Object ? 1 : 2; // 1 | 2
type T19 = any extends "Hello" ? 1 : 2; // 1 | 2

type T20 = unknown extends any ? 1 : 2; // 1
type T21 = any extends unknown ? 1 : 2; // 1
```

是不是很神奇？实际上，还是因为**TS“系统设定”**的原因，因为any其实从系统底层的意义来说，就是为了保证和js的兼容性存在的。大家不需要纠结。记住**any/unknown**是所有类型的顶层类型就行

别忘记，`never`类型是所有类型的子类型

```typescript
type T22 = never extends "Hello" ? true : false; // true
type T23 = "Hello" extends never ? true : false; // false
```

