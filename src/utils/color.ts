import { RandomSeed, create } from "random-seed";
const colors = [
  "#A9A9A9",  "#A9A9A9",  "#DCDCDC",  "#CD5C5C",  "#F08080",  "#D3D3D3",
  "#D3D3D3",  "#FF0000",  "#BC8F8F",  "#C0C0C0",  "#FFFAFA",  "#FFFFFF",
  "#F5F5F5",  "#FFE4E1",  "#FA8072",  "#FF6347",  "#E9967A",  "#FF7F50",
  "#FF4500",  "#FFA07A",  "#D2691E",  "#FFF5EE",  "#FFDAB9",  "#F4A460",
  "#FAF0E6",  "#CD853F",  "#FFE4C4",  "#FF8C00",  "#FAEBD7",  "#DEB887",
  "#D2B48C",  "#FFEBCD",  "#FFDEAD",  "#FFEFD5",  "#FFE4B5",  "#FDF5E6",
  "#FFA500",  "#F5DEB3",  "#FFFAF0",  "#B8860B",  "#DAA520",  "#FFF8DC",
  "#FFD700",  "#F0E68C",  "#FFFACD",  "#EEE8AA",  "#BDB76B",  "#F5F5DC",
  "#FFFFF0",  "#FAFAD2",  "#FFFFE0",  "#808000",  "#FFFF00",  "#6B8E23",
  "#9ACD32",  "#ADFF2F",  "#7FFF00",  "#7CFC00",  "#8FBC8F",  "#228B22",
  "#F0FFF0",  "#90EE90",  "#00FF00",  "#32CD32",  "#98FB98",  "#2E8B57",
  "#3CB371",  "#F5FFFA",  "#00FF7F",  "#00FA9A",  "#7FFFD4",  "#66CDAA",
  "#40E0D0",  "#20B2AA",  "#48D1CC",  "#00FFFF",  "#F0FFFF",  "#00FFFF",
  "#008B8B",  "#E0FFFF",  "#AFEEEE",  "#00CED1",  "#5F9EA0",  "#B0E0E6",
  "#00BFFF",  "#ADD8E6",  "#87CEEB",  "#87CEFA",  "#4682B4",  "#F0F8FF",
  "#1E90FF",  "#B0C4DE",  "#6495ED",  "#F8F8FF",  "#E6E6FA",  "#7B68EE",
  "#9370DB",  "#BA55D3",  "#FF00FF",  "#FF00FF",  "#DDA0DD",  "#D8BFD8",
  "#EE82EE",  "#DA70D6",  "#FF1493",  "#FF69B4",  "#FFF0F5",  "#DB7093",
  "#FFC0CB",  "#FFB6C1",
];

export const getRandColor = (random?: RandomSeed) => {
  if (random) {
    return colors[random.intBetween(0, colors.length - 1)];
  } else {
    const random = create("seed");
    return colors[random.intBetween(0, colors.length - 1)];
  }
};

export const getColorTriad = (color: string) => {
  const index = colors.indexOf(color);
  if (index === -1) {
    return [];
  }
  const triad = [colors[index], colors[index + 1], colors[index + 2]];
  return triad;
};

export const getComplement = (color: string) => {
  const index = colors.indexOf(color);
  if (index === -1) {
    throw new Error("Color not found");
  }
  return colors[index + 3];
};
