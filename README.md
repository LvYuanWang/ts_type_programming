## 模板字符串类型

TS 字符串模板类型的写法跟 JS 模板字符串非常类似

```typescript
type World = 'world';
type Greeting = `hello ${World}`;
```

除了前面的 `type` 跟 `JS` 不一样之外，后面就是一模一样了，通过 `${}` 包裹，里面可以直接传入类型变量，使用变量的模板字符串可以实现你意想不到的效果。

```typescript
type Direction = "left" | "right" | "top" | "bottom";
type BoxName = "padding" | "margin" | "border";
type BoxModel = `${BoxName}-${Direction}`;
```

使用模板字符串，联合类型会被挨个组合到模板中，最后轻松的生成一个包含各种组合的联合类型

使用对象也能处理一些更多的内容：

```typescript
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
};

type PersonKeys = keyof typeof person;

type EventPersonChange = `${PersonKeys}Changed`;

// 泛型处理
// keyof T 默认会认为对象的键有string|number|symbol
// keyof T & string 相当于 (string|number|symbol) & string ---> string
type EventObjectChange<T> = `${keyof T & string}Changed`;

type P = EventObjectChange<typeof person>;
                                                    
```

加入映射类型：

```typescript
type A = {
  foo: number;
  bar: number;
};

type B = {
  [K in keyof A as `${K}ID`]: number;
};

// 等同于
// type B = {
//   fooID: number;
//   barID: number;
// }  
```

但是如果想做的通用一点，也就是和泛型结合，会遇到问题：

```typescript
// 结合泛型使用，由于keyof T得到的是一个联合类型，不能直接用于模板字符串拼接
// 需要使用 交叉类型 &，去掉其他类型，只保留字符串类型
type AddID<T> = {
  [K in keyof T as `${K & string}ID`]: number;
};

type D = AddID<A>;
```



Typescript官方也提供了很多内置的字符串工具[Intrinsic String Manipulation Types](https://www.typescriptlang.org/docs/handbook/utility-types.html#intrinsic-string-manipulation-types)，根据名字大概也能猜测出意思

```typescript
type World = 'world';
type Greeting = `hello ${World}`;

type UpperCaseGreeting = Uppercase<Greeting>; // `HELLO ${Uppercase<World>}`;
// type Greeting = "HELLO WORLD"

type LowerCaseGreeting = Lowercase<Greeting>;
// type LowerCaseGreeting = "hello world"

type CapitalizeGreeting = Capitalize<LowerCaseGreeting>;
// type CapitalizeGreeting = "Hello world"

type UnUpperCaseGreeting = Uncapitalize<UpperCaseGreeting>;
// type CapitalizeGreeting = "hELLO WORLD"
```

这还仅仅是字符串模板的初级使用，结合这泛型编程，可以玩出很多花样

比如提供一个对象字面量类型，通过字符串模板直接得到Getter和Setter类型

```typescript
type User = { name: string; age: number; address: string };

type AddGetter<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
}

type AddSetter<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (arg: T[K]) => void;
}

type UserGetter = AddGetter<User>;
type UserSetter = AddSetter<User>;
```

还可以处理的更通用一些：

```typescript
type ObjectWithGetterSetter<T extends object> = T & AddGetter<T> & AddSetter<T>;

type UserWithGetterSetter = ObjectWithGetterSetter<User>;

let p: UserWithGetterSetter = {
  name: "jack",
  age: 20,
  address: "北京",
  getName() {
    return this.name;
  },
  getAge() {
    return this.age;
  },
  getAddress() {
    return this.address;
  },
  setName(name: string) {
    this.name = name;
  },
  setAge(age: number) {
    this.age = age;
  },
  setAddress(address: string) {
    this.address = address;
  }
}
```
