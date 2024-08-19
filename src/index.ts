// 条件类型在结合 联合类型+泛型 使用时，会触发分布式条件特性
type IsString<T> = T extends string ? 1 : 2;

type A = IsString<string>;  // 1
type B = IsString<number>;  // 2
type C = IsString<"hello">; // 1
type D = IsString<123>;  // 2

// 触发分布式条件特性
// 先将 "a" 与 string 比较得到 1
// 再将 true 与 string 比较得到 2
// 最后将 1 与 string 比较得到 2
// 所以结果为 1 | 2 | 2, 但是由于联合类型会自动去除重复, 则最终结果为 1 | 2
type E = IsString<"a" | true | 1>;  // 1 | 2


// 包含工具: 将 T 与 U 对比,如果 U 里面有包含 T 的则输出 T 否则输出 never
type MyInclude<T, U> = T extends U ? T : never;
// 去除工具: 将 T 与 U 对比,如果 U 里面有包含 T 的则输出 never 否则输出 T
type MyExclude<T, U> = T extends U ? never : T;

type F = MyInclude<string, object>; // never
type G = MyInclude<"Hello", Object>; // "Hello"
// 触发分布式条件特性
// 先将 "Hello" 与 string 对比得到 "Hello"
// 再将 "World" 与 string 对比得到 "World"
// 最后将 123n 与 string 对比得到 never, 因为 never 类型等于没有
// 则最后结果为 "Hello" | "World"
type H = MyInclude<"Hello" | "World" | 123n, string>; // "Hello" | "World"

type I = "a" | "b" | "c";
type J = "a" | "b";

// 注意需要满足三个条件才会触发分布式特征
// 1.条件类型
// 2.联合类型
// 3.泛型
type K = "a" | "b" | "c" extends "a" | "b" ? 1 : 2; // 2

/*
包含工具: MyInclude<T, U>
对于 I 中的每一个成员：
  "a" 是 J 的成员，所以保留 "a"。
  "b" 是 J 的成员，所以保留 "b"。
  "c" 不是 J 的成员，所以舍弃 "c"。
type K = MyInclude<"a",  "a" | "b">; => "a"
  | MyInclude<"b", "a" | "b">; => "b"
  | MyInclude<"c", "a" | "b">; => never
*/
type L = MyInclude<I, J>; // "a" | "b"

/*
去除工具: MyExclude<T, U>
对于 I 中的每一个成员：
  "a" 是 J 的成员，所以去除 "a"。
  "b" 是 J 的成员，所以去除 "b"。
  "c" 不是 J 的成员，所以保留 "c"。
type K = MyInclude<"a",  "a" | "b">; => never
  | MyInclude<"b", "a" | "b">; => never
  | MyInclude<"c", "a" | "b">; => "c"
*/
type M = MyExclude<I, J>; // "c"


interface Todo {
  title: string,
  description: string,
  completed: true
}

// 手写官方的 Pick 工具类型
type MyPick<T, U extends keyof T> = {
  [key in U]: T[key];
}

type TodoPreview = MyPick<Todo, "title" | "completed">; // { title: string, completed: true }

// 相反 写出一个与 Pick 工具类型 MyOmit 除了传入的值不保留, 其他都保留
// 泛型里面其实也可以使用泛型, 多层泛型
type MyOmit<T, U extends keyof any> = MyPick<T, MyExclude<keyof T, U>>;

type TodoPreview2 = MyOmit<Todo, "title" | "completed">;  // { description: string }


// 编写一个类型工具, 把部分键名设置为可选 ?
type User = {
  id: number,
  name: string,
  age: number,
  tel: string,
  address: string
}

type MyPartial<T> = {
  [key in keyof T]?: T[key] | undefined;
}

// 结合官方的工具泛型: Omit, Pick, Partial
// 伪代码建立思路
// function OptionalPick(T, U) {
//   MyOmit(T, U) & MyPartial(MyPick(T, U));
// }

// type RequiredPick = MyOmit<User, "age" | "tel" | "address">;  // { id: number, name: string }
// type PartialPick = MyPartial<MyPick<User, "age" | "tel" | "address">>;  // { age?: number | undefined, tel?: string | undefined, address?: string | undefined }
// type OptionalPick = RequiredPick & PartialPick;

// 结合上面的思路, 写出这个 OptionalPick 泛型工具
type OptionalPick<T, U extends keyof T> = MyOmit<T, U> & MyPartial<MyPick<T, U>>;

// type User2 = OptionalPick<User, "age" | "tel" | "address">;
/*
type User2 = {
  id: number,
  name: string,
  age?: number,
  tel?: string,
  address?: string
}
*/

const u: OptionalPick<User, "age" | "address"> = {
  id: 1,
  name: "Joker",
  tel: '13455555'
}


// 分布式特性还需要注意一个小问题: 泛型参数不能被包裹
type ABB<T> = T extends any ? T[] : never;
type ACC<T> = [T] extends any ? T[] : never;

type N = ABB<string | number | bigint>; // string[] | number[] | bigint[]
type O = ACC<string | number | bigint>; // (string | number | bigint)[]