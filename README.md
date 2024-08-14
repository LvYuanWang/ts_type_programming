### 关联泛型

如果现在希望实现这么一个效果，在原有对象类型的属性上进行挑选，根据挑选属性的结果，形成新的类型

```typescript
type User = {
  readonly id: number,
  name: string
  tel: string
  address?: string
}

// 比如挑选name和tel属性,形成下面的类型

type UserPick = {
  name: string
  tel: string
}
```

```typescript
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}

type Admin = MyPick<User, "name"| "tel">;

const u: Admin = {
  name: "aaa",
  tel: "123456"
}
```

**关键点在于：**

1、确定需要的泛型参数个数

2、第二个泛型参数的类型应该来源于第一个参数