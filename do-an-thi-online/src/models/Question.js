import { ulid } from "ulidx";
import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes, Sequelize } from "sequelize";
import { QuesType } from "../utils/type.js";

export const Question = s2g.define(
  "Question",
  {
    ...BaseModel,
    examId: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: QuesType.MultipleChoice,
    },
    subjectQuestionId: {
      type: DataTypes.STRING,
    },
    idx: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Question",
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);
