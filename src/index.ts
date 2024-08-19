type User = {
  readonly id: number,
  name: string,
  tel: string,
  address?: string
}

type A<T> = {
  [key in keyof T as "aaa"]: T[key];
}

type B = A<User>; // { readonly aaa: string | number | undefined }

// 将之前的 MyOmit 进行优化及更改
// 之前写的 Omit 工具
// type MyOmit<T, U> = Pick<T, Exclude<keyof T, U>>;

// 使用 映射类型 as 关键字+分布式条件特性 进行修改
type MyOmit<T, U> = {
  [key in keyof T as key extends U ? never : key]: T[key];
}

type OmitUser = MyOmit<User, "tel" | "address">; // { readonly id: number, name: string }
/*
key in keyof T ==> "id" | "name" | "tel" | "address"

// 触发分布式条件特性
key extends "tel" | "address" ? never : key
"id" -> "tel" | "address" ? never : "id" ==> "id"
"name" -> "tel" | "address" ? never : "name" ==> "name"
"tel" -> "tel" | "address" ? never : "tel" ==> never
"address" -> "tel" | "address" ? never : "address" ==> never

最终结果: "id" | "name" | never | never   ==>   "id" | "name"
*/

// 将这个类型反过来任然和 MyPick 一样
type MyPick<T, U extends keyof T> = {
  [key in keyof T as key extends U ? key : never]: T[key];
}

type PickUser = MyPick<User, "tel" | "address">;  // { tel: string ,address?: string | undefined }


// 如果想只保留 User 对象中 值的类型为 string 的
type PickStringValueType<T> = {
  [key in keyof T as T[key] extends string ? key : never]: T[key];
}

type FilterStringUser = PickStringValueType<User>;  // { name: string, tel: string }

// 稍微改改 直接让它变成通用的
type PickByType<T, U> = {
  [key in keyof T as T[key] extends U ? key : never]: T[key];
}

type PickByTypeUser = PickByType<User, number>; // { readonly id: number }