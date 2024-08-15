// 关联泛型
type User = {
  readonly id: number,
  name: string,
  tel: string,
  address?: string
}

// 比如挑选 name 和 tel 属性, 形成下面的类型

type UserPick = {
  name: string,
  tel: string
}

// function myPick(obj, key) {
//   // todo ...
//   return {}
// }

type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
}
let pick: Pick<User, "name" | "address">;

let u: MyPick<User, "name" | "tel"> = {
  name: 'Jack',
  tel: '1544466'
}


type PickUser = MyPick<User, "id" | "name" | "address">;

let u2: PickUser = {
  id: 3,
  name: 'Joker',
  // address: '南通'
}
// u2.id = 4;  // 无法为只读属性赋值