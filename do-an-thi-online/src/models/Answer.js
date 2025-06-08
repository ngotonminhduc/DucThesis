import { ulid } from "ulidx";
import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes, Sequelize } from "sequelize";

export const Answer = s2g.define(
  "Answer",
  {
    ...BaseModel,
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
    subjectAnswerId: {
      type: DataTypes.STRING,
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
