import { ulid } from "ulidx";
import { s2g } from "../config/database.js";
import { BaseModle } from "./Base.js";
import { DataTypes, Sequelize } from "sequelize";

export const Answer = s2g.define(
  "Answer",
  {
    ...BaseModle,
    examId: {
      type: DataTypes.STRING,
    },
    questionId: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    idx: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Answer",
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);
