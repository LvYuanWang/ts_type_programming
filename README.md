### 映射类型的属性过滤

上面我们通过`Pick` + `Exclude`实现了`Omit`类型工具，那我们能不能完全自己实现，不借助已有的类型工具呢？也可以，不过我们需要掌握一个技巧：通过`as + never`实现属性过滤的效果

```typescript
type User = {
  readonly id: number,
  name: string
  tel: string
  address?: string
}

type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

type A = MyOmit<User, "tel" | "address">; //  {readonly id: number; name: string}
```

在例子中，映射 `K in keyof T` 获取类型 T 的每一个属性以后，后面紧跟着`as`其实是可以为键重新映射命名的

不过现在，它的键名重映射 `as P extends K ? never : P`，使用了条件运算符，又会触发分布式处理

> "id" ---> "tel" | "address" ? never : "id"
>
> "name" ---> "tel" | "address" ? never : "name"
>
> "tel" ---> "tel" | "address" ? never : "tel"
>
> "address" ---> "tel" | "address" ? never : "address"
>
> "id" |  "name" | never | never ---> "id" |  "name" 

我们还能再升级一下，比如：只保留User值类型是string类型的，生成新的类型

```typescript
type PickStringValueType<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
type FilteredUser = PickStringValueType<User> //{name:string, tel:string}
```

当然，你想反过来，去掉值类型是string类型的，将`K`和`never`换个位置就行了

其实上面做的更加普遍性一些，就完全可以写成一个类型工具：

```typescript
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

type B = PickByType<User, number> // { readonly id: number }
```
