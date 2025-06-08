import express from "express";
import cookie from "cookie";
import { decodeToken } from "../utils/jwt.js";
import { configJwt } from "../config/config.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
/** @type {express.RequestHandler} */
export const verifyTokenMiddleware = async (req, res, next) => {
  const h = req.headers;
  const c = cookie.parse(h.cookie || "");
  const authCookieKey = configJwt["authCookiePrefix"];
  let data;
  if (authCookieKey in c) {
    data = decodeToken(c[authCookieKey]);
  }

  const a = h.authorization;
  const authHeaderPrefix = configJwt["authHeaderPrefix"];
  if (a && a.startsWith(authHeaderPrefix)) {
    data = decodeToken(a.replace(authHeaderPrefix, ""));
  }
  const err = () => new Error("Xác thực thất bại");

  if (!data) {
    throw err();
  }
  //check user
  const user = await User.findOne({
    where: { id: data.id },
    include: {
      model: Role,
      as: "roles",
      through: {
        attributes: [],
      },
    },
  }).then((r) => r?.toJSON());
  if (!user) {
    throw err();
  }
  req["user"] = user;
  next();
};
