import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";

export const User = s2g.define(
  "User",
  {
    ...BaseModel,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "internal",
    },
  },
  {
    tableName: "User",
    timestamps: true, // Nếu không có, Sequelize sẽ không tạo cột createdAt, updatedAt
  }
);
