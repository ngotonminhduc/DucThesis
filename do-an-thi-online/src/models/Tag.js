import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";

export const Tag = s2g.define(
  "Tag",
  {
    ...BaseModel,
    examId: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    mixQuestions: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
  },
  {
    tableName: "Tag",
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);
