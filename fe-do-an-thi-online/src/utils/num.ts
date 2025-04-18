export const roundToOneDecimal = (num: number) => {
  if (Number.isInteger(num)) {
    return num;
  }
  return Math.round(num * 10) / 10;
};
