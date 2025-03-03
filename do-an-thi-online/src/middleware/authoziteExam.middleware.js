
import express from "express";
import { User } from "../models/User.js";

/** @type {express.RequestHandler} */ 
export const authoziteExamMiddleware = async (req, res, next) => {
  const id = req["user"]?.id
  if (!id) {
    throw new Error("Unauthozite")
  }

  const existUser = await User.findOne({where: {id}}).then(r => r?.toJSON())

  if (!existUser) {
    throw new Error("User doses not exist")
  }

  if (existUser.isAdmin) {
    next()
    return
  }
  throw new Error("Do not permission!")
};