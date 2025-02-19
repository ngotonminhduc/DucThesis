import { Sequelize } from "sequelize";
import { configdb } from "./config.js";
const { database, dialect, host, password, username } = configdb;

export const s2g = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
    paranoid: false,
  },
});


