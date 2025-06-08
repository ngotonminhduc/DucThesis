import express from "express";

/**
 * Middleware kiểm tra quyền dựa trên vai trò
 * @param {string|string[]} roleNames - Tên vai trò hoặc mảng tên vai trò được phép truy cập
 * @returns {express.RequestHandler}
 */
export const authorizeRole = (roleNames) => {
  return async (req, res, next) => {
    const user = req["user"];
    if (!user) {
      throw new Error("Người dùng chưa đăng nhập");
    }


    const err = () => {
      return new Error("Người dùng không có quyền truy cập tính năng này");
    };

    if (!user.roles || user.roles.length === 0) {
      throw err();
    }
    const validRoles = user.roles.some(r => roleNames.includes(r.name))
    if (!validRoles) {
      throw err();
    }
    // Thêm thông tin về roles của user vào request để sử dụng sau này nếu cần
    req.userRoles = user.roles;
    next();
  };
};
