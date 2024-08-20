// 通过使用 infer 关键字，还可以在 条件类型中声明泛型类型
// type Flatten<T> = T extends any[] ? T[number] : T;
// 使用 infer 优化
type Flatten<T> = T extends (infer U)[] ? U : T;  // 如果传入的 T 为 string[] 则 U 为 string

type T1 = Flatten<number[]>;  // number
type T2 = Flatten<string[]>;  // string
type T3 = Flatten<[true, "two", 3, 4n]>;  // true, "two", 3, 4n

const arr = [
  { id: 1, name: "aaa" },
  { id: 2, name: "bbb" },
  { id: 3, name: "ccc" }
]

type T4 = Flatten<typeof arr>;
type T5 = Flatten<"hello">; // "hello"


// 需求: 要求写一个泛型工具 传入的必须是数组, 如果数组为空则输出 never, 不然则输出数组的第一个内容
// type First<T extends any[]> = T extends [] ? never : T[0];
// type First<T extends any[]> = T["length"] extends 0 ? never : T[0];
type First<T extends any[]> = T extends [infer A, ...infer B] ? A : never;
// 获取 数组最后一个内容
type Last<T extends any[]> = T extends [...infer F, infer L] ? L : never;

type Arr1 = ["a", "b", "c"];
type Arr2 = [1, 2, 3];

type F1 = First<Arr1>;  // "a"
type F2 = First<Arr2>;  // 1
type F3 = First<[]>;  // never

type F4 = Last<Arr1>; // "c"
type F5 = Last<Arr2>; // 3

// 通过 infer 实现元组两个位置上的类型交换
type Swap<T extends any[]> = T extends [infer A, ...infer R, infer B] ? [B, ...R, A] : never;

type S1 = Swap<[1, 2]>; // [2, 1];
type S2 = Swap<[true, "two", 3, 4n]>; // [4n, "two", 3, true]

// 传入一个函数, 获取函数的返回类型
type GetReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

type A = GetReturnType<() => string>; // string
type B = GetReturnType<(n: number, b: string) => void>; // void

// 传入一个函数, 获取函数的所有参数
type GetParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

type P1 = GetParameters<(n: number, b: string) => bigint>;  // [n: number, b: string]
type P2 = GetParameters<(name: string, age: number) => object>;  // [name: string, age: number]
type P3 = GetParameters<() => string>;  // []