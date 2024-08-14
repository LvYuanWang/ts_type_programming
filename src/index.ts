type User = {
  readonly id: number;
  name: string;
  tel: string;
  address?: string;
}

type Animal = {
  name: string,
  age: number,
  type: 'cat' | 'dog';
  color: string
}

// keyof 主要用于获取对象中所有属性的键组成的联合类型
type UserKeys = keyof User & {};  // "id" | "name" | "tel" | "address"

type CopyUser = {
  // in 用于遍历每个联合类型
  // 再通过 方括号运算符 得到每个 键 对应的值
  [key in keyof User]: User[key]
}

// 结合 泛型 一起使用, 使它更灵活不再只是 User 对象, 通过传入的 T 来进行 in 和 keyof、方括号 一系列的操作
type Copy<T> = {
  // 需要注意的是: keyof T 得到的是 string、number、symbol, 后续如果只需要 string 则要在后面加上 & string
  [key in keyof T]: T[key]
}

const user: Copy<User> = {
  id: 7,
  name: 'Joker',
  tel: '137776555',
  // address: '南京'
}

const cat: Copy<Animal> = {
  name: '巴嘎',
  age: 9,
  type: 'cat',
  color: 'black'
}



// 加入属性修饰符: 只读
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
}
// const obj: Readonly<User>

// 加入属性修饰符: 可选
type MyPartial<T> = {
  [key in keyof T]?: T[key]
}
// const obj2: Partial<User>

const user2: MyReadonly<User> = {
  id: 7,
  name: 'Jack',
  tel: '12345556',
  address: "海南"
}
// user2.name = 'Joker'; // 无法为只读属性重新赋值
// user2.address = "江南"; // 无法为只读属性重新赋值

const user3: MyPartial<User> = {
  name: 'Anna',
  address: '湖南'
}

// 加入属性操作符: -
type MyRequired<T> = {
  // 有 readonly修饰符 则去掉readonly 没有则不变
  // 有 ? 可选修饰符 则去掉可选修饰符 没有则不变
  -readonly [key in keyof T]-?: T[key]
}

const user4: MyRequired<User> = {
  id: 9,
  name: 'Joker',
  tel: '18888888',
  address: '上海'
}
user4.id = 1;


type MyRecord<Key extends keyof any, Value> = {
  [k in Key]: Value;
}
let obj3: Record<string, number> = {}