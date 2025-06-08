import { Role, User, UserRole } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Kiểm tra xem user có role được chỉ định không
 * @param {string} userId - ID của user cần kiểm tra
 * @param {string|string[]} roleNames - Tên role hoặc mảng tên role cần kiểm tra
 * @returns {Promise<boolean>} - Trả về true nếu user có ít nhất 1 role được chỉ định
 */
export const checkUserRole = async (userId, roleNames) => {
  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: Role,
        as: "roles",
        where: {
          name: Array.isArray(roleNames) ? { [Op.in]: roleNames } : roleNames,
        },
      },
    ],
  }).then((r) => r?.toJSON());
  return !!user;
};

/**
 * Kiểm tra xem user có role admin không
 * @param {string} userId - ID của user cần kiểm tra
 * @returns {Promise<boolean>} - Trả về true nếu user có role admin
 */
export const checkUserAdmin = async (userId) => {
  return await checkUserRole(userId, "ADMIN");
};
