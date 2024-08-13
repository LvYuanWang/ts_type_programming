// type User = {
//   name: string,
//   age: number,
//   sex?: string
// }
// let obj: User = {
//   name: 'jack',
//   age: 18
// }
// obj.type = 'admin';


// type User = {
//   name: string,
//   age: number,
//   [key: string]: string | number
// }

// // 对象的键, 可以是string, number和symbol类型
// let obj: User = {
//   name: 'jack',
//   sex: '男',
//   age: 18
// }
// obj.type = 'admin';
// console.log(obj.sex);


// 索引签名类型 | 映射类型
// type anyTypeObj = {
//   [key: string]: any
// }

// let obj: anyTypeObj = {};
// obj.name = 'jack';
// obj.age = 18;


// Utility Types
// Record<Keys, Type>
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shophar" },
};

cats.boris;

const user: Record<string, any> = {
  name: 'joker',
  age: 20,
  gender: '女'
}