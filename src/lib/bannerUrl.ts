const basePath = "/img/banners/";
const bannersAmount = 6;

export const getBannerUrl = (id: string | number) => {
  let i: number;
  if (typeof id === "string") {
    i = genNumberFromString(id);
  } else {
    i = id;
  }
  const path = `${basePath}${i % bannersAmount}.webp`;
  return path;
};

const genNumberFromString = (str: string) => {
  let num = 0;
  str = str.replace("-", "");
  for (let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i);
  }
  return num;
};
