## 递归复用

现在有这么一个需求，需要将字符串字面量类型中的每个值类型取出，组成联合类型，类型于：

```typescript
type A = "12345"
转变为
type B = "1" | "2" | "3" | "4" | "5" 
```

如果字符串字符串长度不变，那我们可以直接使用`infer`进行类型推断

```typescript
type A = "12345"

type StringToUnion<S extends string> =
  S extends `${infer One}${infer Two}${infer Three}${infer Four}${infer Five}`
  ? One | Two | Three | Four | Five
  : never;

type B = StringToUnion<A>
```

但是这仅仅才5个字符串，如果字符串较多的话，不是要`infer`推断一堆类型，比如来个九字真言，难道要`infer9`次？

```typescript
type A = "临兵斗者皆阵列前行"
```

这个时候我们就可以使用递归复用：**当处理数量较多的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件**

```typescript
type NineMantra = "临兵斗者皆阵列前行"

type StringToUnion<S extends string> =
  S extends `${infer One}${infer Rest}`
  ? One | StringToUnion<Rest>
  : never;

type NineMantraUnion = StringToUnion<NineMantra>
```

和字符串字面量类型很类似的，如果一个数组要做一些类似的类型处理，那一样可以递归，比如，我们要把数组中的元素类型倒序

```typescript
type ReverseArr<T extends any[]> = 
  T extends [infer One, infer Two, infer Three, infer Four, infer Five]
  ? [Five, Four, Three, Two, One]
  : never;

type Reversed = ReverseArr<[1, 2, 3, 4, 5]> // [5, 4, 3, 2, 1]
```

同样，我们使用递归复用：

```typescript
type ReverseArr<T extends any[]> = 
  T extends [infer One, ...infer Rest]
  ? [...ReverseArr<Rest>, One]
  : T; // 注意结束之后返回的是数组

type Reversed = ReverseArr<[1, 2, 3, 4, 5]> // [5, 4, 3, 2, 1]
```

再来一个，比如，我们现在通过编写一个类型工具，获取一个字符串字面量类型的长度

```typescript
type S = LengthOfString<"12345">; // 5
```

我们可以思考，之前我们讲过数组类型是不是可以获取长度，通过T['length']，那我们能不能把字符串类型转成数组类型呢？完全可以，通过infer推断和递归复用：

```typescript
type LengthOfString<
  S extends string,
  T extends string[] = []
> = S extends `${infer F}${infer R}`
  ? LengthOfString<R, [...T, F]>
  : T['length'];

type S = LengthOfString<"12345">;
```

通过递归复用，还能实现对索引映射类型的深递归，比如。我们希望将一个层级较深的对象类型全部属性转为`readonly`只读

```typescript
type User = {
  id: number,
  name: string,
  address: {
    province: string,
    city: {
      name: string
      street: string
    }
  }
}
```

如果我们使用之前写的MyReadonly处理,仅仅只会把第一个层级的属性转变为`readonly`

```typescript
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
}

type ReadonlyUser = MyReadonly<User>
```

这里我们简单使用递归就能实现想要的效果

```typescript
type DeepReadonly<T extends Record<string, any>> =
  {
    readonly [K in keyof T]: T[K] extends Record<string, any> ? DeepReadonly<T[K]> : T[K]
  }

type ReadonlyUser = DeepReadonly<User>
```

不过这样不好看到最后转换的效果，因为TS为了保证性能，并不会做深层的计算。

有一个比较实用的类型体操技能，就是在比较复杂的，特别是需要递归计算的类型体操计算外，包裹一层代码：

```typescript
T extends any ?
具体类型体操代码 
: never
```

这样我们就可以看到最后计算完成的效果，比如把上面的代码换成:

```typescript
type DeepReadonly<T extends Record<string, any>> =
  T extends any ?
  {
    readonly [K in keyof T]: T[K] extends Record<string, any> ? DeepReadonly<T[K]> : T[K]
  }
  : never

type ReadonlyUser = DeepReadonly<User> //现在可以看到全部计算完成的类型效果
```

