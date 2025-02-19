  import jwt from "jsonwebtoken";
  import { configJwt } from "../config/config.js";
  const { exp, jwtSecret } = configJwt;
  export const encodeToken = (payload) => {
    try {
      return jwt.sign(
        {
          ...payload,
          iat: exp,
        },
        jwtSecret
      );
    } catch (err) {
      console.log("encodeToken: ",err);
      return;
    }
  };

  export const decodeToken = (token) => {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (err) {
      console.log(err);
      return;
    }
  };
