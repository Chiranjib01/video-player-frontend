const stringToArray = (str: string) => {
  const array: string[] = [];
  str.split(",").forEach((item) => {
    array.push(item.toLocaleLowerCase());
  });
  return array;
};

export default stringToArray;
