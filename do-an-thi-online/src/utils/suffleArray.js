/**
 * shuffleArray: Trộn ngẫu nhiên một mảng theo thuật toán Fisher–Yates
 * @param {Array<number>} arr - Mảng các số nguyên tượng trưng cho đề
 * @returns {Array<number>} - Mảng đã được trộn (in-place)
 */
export const shuffleArray = (arr) => {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};
