import { s2g } from "../config/database.js";
import { StatusTest } from "../utils/type.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";

export const Test = s2g.define(
  "Test",
  {
    ...BaseModel,
    examId: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
      defaultValue: "",
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
      defaultValue: StatusTest.Normal,
    },
    // map  câu hỏi đúng để tính điểm
    correctAnswersMap: {
      type: DataTypes.JSON,
    },
    correctAnswersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // map lại những câu trả lời của user
    answersMap: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finalAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Test",
    timestamps: true,
  }
);
