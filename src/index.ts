type A = "12345"; // 将它变成: "1" | "2" | "3" | "4" | "5"

type StringToUnion<S extends string>
  = S extends `${infer One}${infer Two}${infer Three}${infer Four}${infer Five}`
  ? One | Two | Three | Four | Five
  : never;

// 虽然可以实现,但是这种方法 很麻烦
type B = StringToUnion<A>;  // "1" | "2" | "3" | "4" | "5"

type NineMantra = "临兵斗者皆阵列前行";

// 使用 递归 解决, 在泛型中也能使用递归
type NewStringToUnion<S extends string> = S extends `${infer One}${infer Rest}`
  ? One | NewStringToUnion<Rest>
  : never;

type C = NewStringToUnion<NineMantra>;  // "临" | "兵" | "斗" | "者" | "皆" | "阵" | "列" | "前" | "行"


// 将数组中的每个元素类型进行翻转

type D = [1, 2, 3, 4, 5, 6, 7];

type ReverseArr<T extends any[]> = T extends [infer One, ...infer Rest] ? [...ReverseArr<Rest>, One] : T;

type E = ReverseArr<D>; // [7, 6, 5, 4, 3, 2, 1]


// 编写类型工具, 获取一个字符串字面量类型的长度
type LengthOfString<S extends string, T extends string[] = []> = S extends `${infer O}${infer R}`
  ? LengthOfString<R, [...T, O]>
  : T["length"];

type F = LengthOfString<"12345678">;  // 8


// 编写一个类型工具, 实现映射类型的深层的 readonly
type User = {
  id: number,
  name: string,
  address: {
    province: string,
    city: {
      cityName: string,
      street: string
    }
  }
}

// type ReadonlyUser = Readonly<User>; // 使用官方给的泛型工具只能对外层的对象添加 readonly 对深层的不起作用

// 测试Record<string, any>
// type test = number extends Record<string, any> ? true : false;  // false
// type test2 = { province: string } extends Record<string, any> ? true : false;  // true

type DeepReadonly<T extends Record<string, any>> = {
  readonly [key in keyof T]: T[key] extends Record<string, any> ? DeepReadonly<T[key]> : T[key];
}

type ReadonlyUser = DeepReadonly<User>;

let deepReadonlyUser: DeepReadonly<User> = {
  id: 4,
  name: 'Joker',
  address: {
    province: "湖南省",
    city: {
      cityName: "永州",
      street: "阳光大道"
    }
  }
}
// deepReadonlyUser.name = "Jack"; // 无法为只读属性赋值
// deepReadonlyUser.address.province = "广东省"; // 无法为只读属性赋值