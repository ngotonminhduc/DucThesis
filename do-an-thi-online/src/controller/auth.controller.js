import express from "express";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { User } from "../models/User.js";
import { encodeToken } from "../utils/jwt.js";

/** @type {express.RequestHandler} */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new Error("Tham số không hợp lệ");
  }
  const user = await User.findOne({ where: { email } }).then((r) =>
    r?.toJSON()
  );
  const error = () => new Error("Tài khoản hoặc mật khẩu không đúng");
  if (!user) {
    throw error();
  }
  const validPassword = comparePassword(password, user.password);
  if (!validPassword) {
    throw error();
  }
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = encodeToken(payload);
  res.status(200).json({
    data: {
      token,
    },
  });
};

/** @type {express.RequestHandler} */
export const register = async (req, res) => {
  /** @type {{name: string, email: string, password: string}} */
  const { name, email, password } = req.body;
  //validation
  if (!name && !email && !password) {
    throw new Error("Tham số không hợp lệ");
  }

  const existUser = await User.findOne({ where: { email } }).then((r) =>
    r?.toJSON()
  );

  if (existUser) {
    throw new Error("Tài khoản đã tồn tại");
  }
  const hashedPassword = hashPassword(password);
  const { password: hp, ...user } = await User.create({
    name,
    email,
    password: hashedPassword,
  }).then((r) => r.toJSON());

  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = encodeToken(payload);

  res.status(200).json({
    success: true,
    data: {
      token,
    },
  });
};

/** @type {express.RequestHandler} */
export const me = async (req, res) => {
  const userData = req["user"];
  const u = await User.findOne({ where: { id: userData.id } }).then((r) =>
    r?.toJSON()
  );
  if (!u) {
    throw new Error("Tài khoản không hợp lệ");
  }
  const { password, ...user } = u;
  res.status(200).json({
    success: true,
    data: user,
  });
};
