import express from "express";

/** @type {express.RequestHandler} */
export const authorizeSystemMiddleware = async (req, res, next) => {
  const user = req["user"];
  const err = () =>
    new Error("Người dùng không có quyền truy cập tính năng này");
  if (!user || !user.isAdmin) {
    throw err();
  }
  next();
};
