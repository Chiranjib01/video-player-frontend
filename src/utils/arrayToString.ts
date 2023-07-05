const arrayToString = (array: string[]) => {
  let str = "";
  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      str += array[i];
    } else {
      str += `,${array[i]}`;
    }
  }
  return str;
};

export default arrayToString;
