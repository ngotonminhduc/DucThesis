import dotenv from "dotenv";
import { envToBoolean } from "../utils/env.js";
dotenv.config();

export const configdb = {
    use_env_variable: "postgres://postgres:100845@localhost:5432/postgres",
    // use_env_variable: "postgres://user:password@localhost:5432/mydatabase",
    dbSyncForce: envToBoolean('DB_SYNC_FORCE'),
    dbSyncAlter: envToBoolean('DB_SYNC_ALTER'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '100845',
    database: process.env.DATABASE || 'demodb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
  }

export const configJwt = {
  jwtSecret: process.env.JWT_SECRET,
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  authCookiePrefix: 'authCookie',
  authHeaderPrefix: 'Bearer ',
}
