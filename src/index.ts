type User = {
  readonly id: number,
  name: string,
  tel: string,
  address?: string,
  gender: boolean
}

// type ValueType = User['id' | 'name']; // string | number
type ValueType = User[keyof User]

// 泛型
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
}

// 数组
const arr = ['admin', 'user', 'client'] as const;
const arr2 = [1, true, 'admin'];

// type ArrType = typeof arr[number];  // "admin" | "user" | "client"
// type Arr2Type = typeof arr2[number];  // string | number | boolean
// type FirstArrType = typeof arr2[0]; // string | number | boolean
// type LastArrType = typeof arr[2]; // "client"

// 获取元组类型的泛型工具
type ArrType<T extends readonly any[]> = T[number];
// type A = ArrType<["admin", "user", "client"]>  // "admin" | "user" | "client"
type A = ArrType<typeof arr2> // string | number | boolean

// 获取数组长度 length
type Len = typeof arr['length'];  // 3
type LenType = typeof arr2['length']; // number

// 获取数组长度的泛型工具
type ArrLen<T extends readonly any[]> = T['length'];
// 直接写一个数组就会认为这个数组是元组
type B = ArrLen<[1, 2, 3, 4, 5, 6]>;  // 6

// 泛型 + 扩展运算符 ... + 方括号运算符 []
// 注意: 扩展运算符只能用于数组
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type Result = Concat<[1, true], ["admin", null]>; // [1, true, "admin", null]