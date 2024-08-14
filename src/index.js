function myPartial(type) {
  // todo list...
  const newType = getOtherOptional(type);

  return newType;
}

const type = { xxxxx: xxx };
const newType = myPartial(type);

// type MyPartial<Type> = {
//   // todo ...
//   [key in keyof Type]+?: Type[key];
// }

// type PartialUser = MyPartial<User>;