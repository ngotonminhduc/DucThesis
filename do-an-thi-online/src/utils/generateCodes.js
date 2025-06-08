/**
 * Hàm generateCodes:
 * @param {number} n - Số lượng mã đề cần tạo
 * @returns {string[]} - Mảng các chuỗi mã đề zero-padded
 */
export const generateCodes = (n) => {
  if (typeof n !== "number" || n <= 0) {
    throw new Error("Tham số phải là số nguyên dương");
  }

  const digits = n.toString().length;
  const width = Math.max(3, digits);

  return Array.from({ length: n }, (_, i) => {
    return String(i + 1).padStart(width, "0");
  });
};
