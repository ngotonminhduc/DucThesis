import express from "express";
import cookie from 'cookie'
import { decodeToken } from "../utils/jwt.js";
import { configJwt } from "../config/config.js";
/** @type {express.RequestHandler} */
export const verifyTokenMiddleware = (req, res, next) => {
  const h = req.headers;
  const c = cookie.parse(h.cookie || "");
  const authCookieKey = configJwt['authCookiePrefix'];
  let data;
  if (authCookieKey in c) {
    data = decodeToken(c[authCookieKey]);
  }

  const a = h.authorization;
  const authHeaderPrefix = configJwt['authHeaderPrefix'];
  if (a && a.startsWith(authHeaderPrefix)) {
    data = decodeToken(a.replace(authHeaderPrefix, ""));
  }

  if (!data) {
    throw new Error("Invalid token");
  }
  req["user"] = {
    id: data.id,
    email: data.email,
  };
  next();
};
