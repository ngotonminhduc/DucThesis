import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";
import { QuesType } from "../utils/type.js";

export const SubjectQuestion = s2g.define(
  "SubjectQuestion",
  {
    ...BaseModel,
    subjectId: {
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
    idx: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "SubjectQuestion",
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);
