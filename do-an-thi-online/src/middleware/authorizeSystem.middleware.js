import express from "express";
import { User } from "../models/User.js";

/** @type {express.RequestHandler} */
export const authorizeSystemMiddleware = async (req, res, next) => {
  const id = req["user"]?.id;
  if (!id) {
    throw new Error("Unauthozite");
  }

  const u = await User.findOne({ where: { id } }).then((r) => r?.toJSON());

  if (!u) {
    throw new Error("User doses not exist");
  }

  if (!u.isAdmin) {
    throw new Error("User doese not have permission");
  }

  if (u.isAdmin) {
    req["user"]["data"] = existUser;
    next();
    return;
  }
};
