// 条件类型结合泛型使用
// type IsString<T> = T extends string ? true : false;
// type A = IsString<string>; // true
// type B = IsString<number>; // false
// type C = IsString<"Hello">; // true
// type D = IsString<3>; // false

// 实现一个IF类型工具, 接受条件, 如果条件为真（条件只能是true或者false类型）
// 就返回类型T， 否则就返回类型F
type IF<C extends boolean, T, F> = C extends true ? T : F;
type A = IF<true, "a", "b">;  // a
type B = IF<false, "a", "b">; // b
type C = IF<true, number, string>;  // number


// type Result = { a: string, b: number } extends { a: string } ? true : false; // true
type ObjLength = {
  length: number
}
// 获取传入对象的长度, 传入的对象参数必须包含length属性
function getObjLen<T extends ObjLength>(obj: T) {
  // todo ...
  return obj.length;
}

getObjLen("Hello World");
// getObjLen(123); // 类型“number”的参数不能赋给类型“ObjLength”的参数
getObjLen([1, 2, 3]);
getObjLen({ a: "hello world", length: 3 });


// type Message<T extends { message: unknown }> = T['message'];
// 如果传入的对象中有message则返回message的值如果没有则返回never
type Message<T> = T extends { message: unknown } ? T['message'] : never;

let person = {
  id: 1,
  message: 'hello'
}

type t = Message<{}>; // never
type PersonMessage = Message<typeof person>;  // string


// 写一个类型工具, 提取具体的类型
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string>; // string
type Num = Flatten<number[]>; // number
type Tup = Flatten<[1, true, undefined]>; // true | 1 | undefined

const arr = [
  { id: 1, name: 'Joker' },
  { id: 2, name: 'Anna' },
  { id: 3, name: 'Hark' }
]
type Arr = Flatten<typeof arr>; // { id: number, name: string }


// 条件类型的嵌套 
type GetType<T> = T extends string ? "string"
  : T extends number ? "number"
  : T extends bigint ? "bigint"
  : T extends boolean ? "boolean"
  : T extends symbol ? "symbol"
  : T extends null ? "null"
  : T extends undefined ? "undefined"
  : T extends any[] ? "array"
  : T extends Function ? "function"
  : "object"

type T0 = GetType<'Hello'>; // string
type T1 = GetType<123n>;  // bigint
type T2 = GetType<true>;  // boolean
type T3 = GetType<null>;  // null
type T4 = GetType<() => void>;  // function
type T5 = GetType<[1, 'a', 11n, true]>;  // array
type T6 = GetType<{}>;  // object

// 实现类型工具 Merge
// 将两个类型合并为一个类型, 第二个类型的键会覆盖第一个类型的键
type Foo = {
  name: string,
  age: string
}

type Bar = {
  age: number,
  sex: string
}

// 联合类型会自动的去除重复
// type A = 1 | 2 | 3 | 3 | 2 | 2 | 1 | 4; // 1 | 2 | 3 | 4
type Merge<T, U> = {
  // keyof T 表示类型 T 的所有键的联合类型, keyof U 表示类型 U 的所有键的联合类型
  // 遍历所有的key, 联合类型会自动的去除重复
  [key in keyof T | keyof U]
  // 这是一个条件类型，检查 key 是否是 U 的键, 如果 key 是 U 的键，则返回 U[key] 的类型
  : key extends keyof U ? U[key]
  // 这是一个条件类型，检查 key 是否是 T 的键, 如果 key 是 T 的键，则返回 T[key] 的类型
  : key extends keyof T ? T[key]
  // 如果 key 既不是 U 的键, 也不是 T 的键, 则类型为 never
  : never
}
type Result = Merge<Foo, Bar>;  // { name: string, age: number, sex: string }