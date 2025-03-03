import { Sequelize } from "sequelize";
import { configdb } from "./config.js";
const { database, dialect, host, password, username } = configdb;

export const s2g = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false,
  timezone: "+07:00", // Múi giờ Việt Nam (UTC+7)

  define: {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false, // Nếu không muốn cập nhật `updatedAt`
    createdAt: true,  // Chỉ sử dụng `createdAt`
    paranoid: false,
  },
});

