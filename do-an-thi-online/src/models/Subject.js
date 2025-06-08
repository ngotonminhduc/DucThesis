import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";

export const Subject = s2g.define(
  "Subject",
  {
    ...BaseModel,
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    }
  },
  {
    tableName: "Subject",
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);
