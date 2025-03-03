import { User } from "../models/User.js";

/**
 * @param {import('express').Request} req
 * @returns
 */
export const getAuthUser = (req) => {
  const id = req["user"]?.id;
  const data = req["user"]?.data;
  if (!id) {
    return;
  }
  if (data) {
    return data;
  }
  return User.findOne({ where: { id } }).then((r) => r?.toJSON());
};
