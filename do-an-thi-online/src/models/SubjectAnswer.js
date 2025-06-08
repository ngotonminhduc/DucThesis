import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";
import { QuesType } from "../utils/type.js";

export const SubjectAnswer = s2g.define(
  "SubjectAnswer",
  {
    ...BaseModel,
    subjectId: {
      type: DataTypes.STRING,
    },
    subjectQuestionId: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    idx: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "SubjectAnswer",
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);
