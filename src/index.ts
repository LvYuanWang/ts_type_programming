type T1 = 1 extends number ? true : false; // true
type T2 = "1" extends number ? true : false; // false
type T3 = string extends object ? true : false; // false
type T4 = string extends Object ? true : false; // true
type T5 = { age: 18 } extends object ? true : false; // true
type T6 = { a: 1, b: 2 } extends { a: 1 } ? true : false; // true: { a: 1, b: 2 } 是 { a: 1 } 的子类型
type T7 = { a: 1 } extends { a: 1, b: 2 } ? true : false; // false: { a: 1 } 不是 { a: 1, b: 2 } 的子类型
type T8 = string extends {} ? true : false; // true: 空对象是所有类型的子类型

type T9 = {} extends object ? true : false; // true: 空对象是所有类型的子类型
type T10 = object extends {} ? true : false; // true
type T11 = {} extends Object ? true : false; // true
type T12 = Object extends {} ? true : false; // true
type T13 = Object extends object ? true : false; // true
type T14 = object extends Object ? true : false; // true
// 总结: {} 是所有类型的子类型，Object 是所有对象类型的子类型，object 是所有非原始类型的子类型

// 只需要记住一点：extends 是判断左边的类型是否是右边类型的子类型
// 原始类型的字面量类型 < 原始类型 < 原始类型对应的装箱类型 < Object

type T15 = string extends any ? true : false; // true
type T16 = Object extends any ? true : false; // true
type T17 = Object extends unknown ? true : false; // true

type T18 = any extends Object ? 1 : 2; // 1 | 2
type T19 = any extends "Hello" ? 1 : 2; // 1 | 2
// 总结: any 类型在条件类型中会导致 TypeScript 返回两个可能的结果，因为 any 可以表示任何类型

// unknown 是 any 的子类型吗？是的，unknown 是 any 的子类型，因为 any 可以表示任何类型，包括 unknown
type T20 = unknown extends any ? 1 : 2; // 1
// any 是 unknown 的子类型吗？是的，any 也是 unknown 的子类型，因为 unknown 可以表示任何类型，包括 any
type T21 = any extends unknown ? 1 : 2; // 1
// 总结: unknown 是 any 的子类型，any 也是 unknown 的子类型

type T22 = never extends "Hello" ? true : false; // true
type T23 = never extends unknown ? true : false; // true
type T24 = "Hello" extends never ? true : false; // false
// 总结: never 是任何类型的子类型，但是任何类型都不是 never 的子类型