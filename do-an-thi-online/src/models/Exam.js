import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";

export const Exam = s2g.define(
  "Exam",
  {
    ...BaseModel,
    topic: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    examTime: {
      // type: DataTypes.DOUBLE,
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    subjectId: {
      type: DataTypes.STRING,
    },
    tagQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "inactive",
    },
  },
  {
    tableName: "Exam",
    timestamps: true,
  }
);
