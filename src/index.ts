type World = "world";
type Greeting = `hello ${World}`;

// 使用官方提供的字符串类型泛型工具
// 将传入的字符串转大写
type UppercaseGreeting = Uppercase<Greeting>; // "HELLO WORLD";
type UppercaseGreeting2 = `hello ${Uppercase<World>}`; // "hello WORLD"
// 将传入的字符串转小写
type LowercaseGreeting = Lowercase<UppercaseGreeting>;  // "hello world";
// 将传入的字符串首字母转大写
type CapitalizeGreeting = `${Capitalize<"hello">} ${Capitalize<World>}`;  // "Hello World"
// 将传入的字符串首字母转小写
type UncapitalizeGreeting = Uncapitalize<CapitalizeGreeting>; // "hello World"


// 模板字符串类型和联合类型一起使用, 有交叉相乘的效果
type Direction = "left" | "right" | "top" | "bottom";
type BoxName = "padding" | "border" | "margin";
type BoxModule = `${BoxName}-${Direction}`; // "padding-left" | "padding-right" | "padding-top" | "padding-bottom" | "border-left" | "border-right" | "border-top" | "border-bottom" | "margin-left" | "margin-right" | "margin-top" | "margin-bottom"
type MarginDirection = `margin-${Direction}`; // "margin-left" | "margin-right" | "margin-top" | "margin-bottom"


const person = {
  firstName: "Joan",
  lastName: "Doe",
  age: 30
}

// typeof:
// 1. 获取变量或表达式的类型：用于获取一个变量或表达式的类型，并将其用作类型注解
// 2. 类型保护：在运行时检查变量的类型
// type personType = typeof person; // { firstName: string, lastName: string, age: number }
type PersonKeys = keyof typeof person;  // "firstName" | "lastName" | "age"
type EventPersonChange = `${PersonKeys}Changed`;  // "firstNameChanged" | "lastNameChanged" | "ageChanged"

type EventObjectChange<T> = `${keyof T & string}Change`;
type P = EventObjectChange<typeof person>;

// 结合 as 关键字, 实现键名重映射
type A = {
  foo: number,
  bar: number
}

type C = {
  name: string,
  age: number,
  sex: boolean
}

type B = {
  [key in keyof A as `${key}ID`]: A[key]
}

// type E = keyof any; // string | number | symbol
// type E = keyof any & string;  // string

type AddID<T> = {
  [key in keyof T as `${key & string}ID`]: T[key];
}
type D = AddID<C>;  // { nameID: string, ageID: number, sexID: boolean }


// 造一个对象的属性访问器
type User = {
  name: string,
  age: number,
  address: string,
  // getName: () => string,
  // setName: (ags: string) => void
}

type AddGetter<T> = {
  [key in keyof T as `get${Capitalize<key & string>}`]: () => T[key]
}

type AddSetter<T> = {
  // 如果有些地方有时候不要Setter则可以加 +? 随时可写可不写
  [key in keyof T as `set${Capitalize<key & string>}`]+?: (ags: T[key]) => void
}

type UserGetter = AddGetter<User>;
type UserSetter = AddSetter<User>;

// 将 AddGetter及AddSetter 结合
type ObjectWithGetterSetter<T extends object> = T & AddGetter<T> & AddSetter<T>;

const p: ObjectWithGetterSetter<User> = {
  name: "Jack",
  age: 19,
  address: "南京",
  getName() {
    return this.name;
  },
  getAge() {
    return this.age;
  },
  getAddress() {
    return this.address;
  },
  setAge(age) {
    console.log()
  }
}