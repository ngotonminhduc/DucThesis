import express from "express";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { User, Role, UserRole } from "../models/index.js";
import { encodeToken } from "../utils/jwt.js";
import { google } from "googleapis";
import { googleClient } from "../config/config.js";
import { RoleName } from "../utils/type.js";

/** @type {express.RequestHandler} */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new Error("Tham số không hợp lệ");
  }
  const user = await User.findOne({ where: { email, type: "internal" } }).then(
    (r) => r?.toJSON()
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

/**
 *
 * @param {string} userId
 */
const addRole = async (userId) => {
  const role = await Role.findOne({ where: { name: RoleName.USER } }).then(
    (r) => r?.toJSON()
  );
  if (!role) {
    throw new Error("Cannot find required roles. Please seed roles first.");
  }

  await UserRole.create({
    userId,
    roleId: role.id,
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
  await addRole(user.id);
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
  const u = await User.findOne({
    where: { id: userData.id },
    include: [
      {
        model: Role,
        as: "roles",
        through: {
          attributes: [],
        },
      },
    ],
  }).then((r) => r?.toJSON());
  if (!u) {
    throw new Error("Tài khoản không hợp lệ");
  }
  const { password, ...user } = u;

  res.status(200).json({
    success: true,
    data: {
      ...user,
    },
  });
};

/** Google login */
export const getGoogleUser = async (accessToken) => {
  try {
    const auth = new google.auth.OAuth2(
      googleClient.googleClientId,
      googleClient.googleClientSecret
    );
    auth.setCredentials({
      access_token: accessToken,
    });
    const g = await google.oauth2("v2").userinfo.get({
      auth,
    });
    return {
      email: g.data.email,
      name: g.data.name,
      avatarUrl: g.data.picture,
    };
  } catch (err) {
    console.error(err);
  }
  return;
};

/** @type {express.RequestHandler} */
export const loginWithSocial = async (req, res) => {
  const { accessToken, type } = req.body;
  if (!accessToken || !type) {
    throw new Error("Invalid params");
  }
  if (type === "google") {
    const info = await getGoogleUser(accessToken);
    if (!info) {
      throw new Error("Invalid google login");
    }
    let user = await User.findOne({
      where: {
        email: info.email,
      },
    }).then((r) => r?.toJSON());

    const generateToken = (userId, userEmail) => {
      const payload = {
        id: userId,
        email: userEmail,
      };
      return encodeToken(payload);
    };

    if (!user) {
      user = await User.create({
        name: info.name,
        email: info.email,
        type: "external",
      }).then((r) => r?.toJSON());

      await addRole(user.id);
    }
    const token = generateToken(user.id, user.email);
    res.status(200).json({
      data: {
        token,
      },
    });
    return;
  }
  throw new Error("Invalid type");
};
