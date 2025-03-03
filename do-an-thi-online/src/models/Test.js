import { s2g } from "../config/database.js";
import { StatusTest } from "../utils/type.js";
import { BaseModle } from "./Base.js";
import { DataTypes } from "sequelize";

export const Test = s2g.define(
  "Test",
  {
    ...BaseModle,
    examId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
    },
    //score là số thực
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    //Dùng string tránh rắc rối
    status: {
      type: DataTypes.STRING,
      defaultValue: StatusTest.TakingATest,
    },
    correctAnswersMap: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "Test",
    timestamps: true,
  }
);
