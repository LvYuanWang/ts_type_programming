## `keyof`

`keyof` 操作符。它可以将对象中的所有键转换为对应字面量类型，然后再组合成联合类型。

```typescript
type User = {
  id: number
  name: string
  age: number
}

type UserKeys = keyof User // keyof User = 'id' | 'name' | 'age'
```

在 VS Code 中悬浮鼠标只能看到 `keyof User`，看不到其中的实际值，你可以这么做

```typescript
type UserKeys = keyof User & {} // "id" | "name" | "age"
```

甚至我们可以结合这`typeof`，直接从一个对象上，获取这个对象键的所有联合类型

```typescript
const user = {
  id: 1,
  name: 'hayes',
  age: 19
}
type UserKeys = keyof typeof user // "id" | "name" | "age"
```

也可以和方括号运算符结合

```typescript
type Person = {
  age: number;
  name: string;
  sex: boolean;
};

// number|string|boolean
type A = Person[keyof Person];
```

结合着泛型，方括号运算符以及extends受限的泛型，可以直接重写之前我们在重载中写过的代码：

```typescript
type TagName = keyof HTMLElementTagNameMap;

function createElement<T extends TagName>(tag: T): HTMLElementTagNameMap[T] { 
  return document.createElement(tag);
}

const a = createElement("a"); // ok
```
