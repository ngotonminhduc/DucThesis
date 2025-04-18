import { User } from "../models/User.js";

/**
 * @param {import('express').Request} req
 * @returns
 */
export const getAuthUser = (req) => req["user"];
