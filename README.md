## 方括号运算符常见操作

### 获取值的类型

```typescript
type User = {
  readonly id: number,
  name: string
  tel: string
  address?: string
}

// type ValueType = User['id' | 'name'];
type ValueType = User[keyof User];

// 泛型
type MyReadonly<T> = {
  +readonly [key in keyof T]: T[key]
}
```

数组一样可以处理

```typescript
const arr = ["admin", "user", "client"];
type ArrType = typeof arr[number]; // string
```

将上面的数组通过`as const`转为只读元组类型之后，得到的是具体字面量类型的联合

```typescript
const arr = ["admin", "user", "client"] as const;
type ArrType = typeof arr[number]; // "admin" | "user" | "client"
```

当然，我们也能写成泛型工具

```typescript
type ArrType<T extends readonly any[]> = T[number];
type A = ArrType<["admin", "user", "client"]>;
```

### 获取数组的长度

可以通过`['length']`获取元组类型的具体长度number字面量类型，注意如果仅仅是数组，只能获取number类型

```typescript
const arr = ["admin", "user", "client"] as const;
type Len = typeof arr['length'] 
let n:Len = 3
```

同样也能写成泛型工具：

```typescript
type ArrLen<T extends readonly any[]> = T['length'];
type B = ArrLen<[1, 2, 3, 4, 5, 6]>; //6
```

### 结合泛型使用扩展运算符

比如现在希望写一个泛型工具，实现两个元组类型的拼接

```typescript
type Result = Concat<[1,2],[3,4]>; //[1,2,3,4]
```

咋一看没啥思路，但是其实ts和js一样，支持`... Spread扩展运算符`

```typescript
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type C = Concat<[1, 2, 3, 4], ["a", "b", "c"]>;
```

