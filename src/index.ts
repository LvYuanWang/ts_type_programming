type U = 'a' | 'b' | 'c';
type Foo = {
  [key in U]: string;
}
// 相当于
// type Foo = {
//   a: string;
//   b: string;
//   c: string;
// }

let foo: Foo = {
  a: 'a',
  b: 'b',
  c: 'c'
}

type Person = {
  name: string;
  age: number;
}

type PersonKeys = keyof Person & {};  // "name" | "age"

type Person2 = {
  [key in PersonKeys]: Person[key];
}

type User = {
  readonly id: number;
  name: string;
  tel: string;
  address?: string;
}

type UserKeys = keyof User & {};  // "id" | "name" | "tel" | "address"

// 我们发现前面 User 对象中 readonly修饰符 记忆 可读属性 没有了
type CopyUser = {
  [key in UserKeys]: User[key];
}

let u1: CopyUser = {
  id: 3,
  name: 'Anna',
  tel: '12233445566',
  address: '上海'
}
u1.id = 2;

// 解决办法直接使用 in keyof User 的方法
type CopyUser2 = {
  [key in keyof User]: User[key];
}

let u2: CopyUser2 = {
  id: 4,
  name: 'Jack',
  tel: '133333444'
}
// u2.id = 5;  // 无法赋值给只读属性

// 使用 泛型 再次优化、升级
// 限制传入的 T 只能是 对象类型
type Copy<T extends object> = {
  [key in keyof T]: T[key];
}

let u3: Copy<User> = {
  id: 5,
  name: 'Joker',
  tel: '1555566666'
}
// u3.id = 6;  // 无法赋值给只读属性

// type AnimalKeys = keyof Animal;
// const animalKeys: Copy<AnimalKeys> = {} // 类型“string”不满足约束“object”: 不能将类型“string”分配给类型“object”

type Animal = {
  name: string,
  age: number,
  color: string,
  type: 'cat' | 'dog'
}
const dog: Copy<Animal> = {
  name: '小白',
  age: 4,
  color: 'white',
  type: "dog"
}

// keyof T 键名的类型可以得到一个联合类型 string | number | symbol
type A = keyof any; // string | number | symbol
// 后面的映射类型, 可能会联合模板字符串一起操作, 可能会要求 keyof any 得到的必须是 string 类型
type B = keyof any & string;  // string