const mod = 7;

const bgColors = [
  "bg-purple-600",
  "bg-pink-600",
  "bg-orange-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-600",
  "bg-indigo-600",
];

export const getCourseBgColor = (courseName: string) => {
  const num = courseName
    .split("")
    .map((char) => char.charCodeAt(0))
    .reduce((acc, curr) => acc + curr, 0);

  return bgColors[num % mod];
};
