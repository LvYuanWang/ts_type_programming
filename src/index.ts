type User = {
  id: number,
  name: string,
  sex: '男' | '女'
}

// 小技巧: 通过 & {} 可以看到keyof组成的联合类型
type UserKeyof = keyof User & {}; // "id" | "name" | "sex"

let a: UserKeyof = 'name';  // "id" | "name" | "sex"

const person = {
  name: 'Joker',
  age: 20,
  sex: '男'
}

// 可以和 typeof 联合使用, 获取一个对象的键的联合类型
type PersonKeys = keyof typeof person;  // "name" | "sex" | "age"

// 可以和方括号运算符联合使用, 获取对象类型值的类型
type Person = {
  name: string,
  age: number,
  isAdult: boolean
}

type PersonValueType = Person[keyof Person];  // string | number | boolean

// 重载 createElement

// function createElement(tagName: 'div'): HTMLDivElement;
// function createElement(tagName: 'span'): HTMLSpanElement;
// function createElement(tagName: string): HTMLElement {
//   return document.createElement(tagName);
// }

// 但是这样写太麻烦了, 我们可以通过 keyof 来简化, 使用 TS 写好的HTMLElementTagNameMap类型
type TagName = keyof HTMLElementTagNameMap & {};

function createElement<T extends TagName>(tagName: T): HTMLElementTagNameMap[T] {
  return document.createElement(tagName);
}

// createElement('layer');  // 报错, 因为layer不是合法的标签名, 类型"layer"的参数不能赋给类型"keyof HTMLElementTagNameMap"的参数
const div = createElement('div');  // HTMLDivElement
const span = createElement('span');  // HTMLSpanElement
const canvas = createElement('canvas');  // HTMLCanvasElement