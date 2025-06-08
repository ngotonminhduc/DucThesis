import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";

export const Role = s2g.define(
  "Role",
  {
    ...BaseModel,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Role",
    timestamps: true,
  }
); 