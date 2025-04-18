import { s2g } from "../config/database.js";
import { BaseModle } from "./Base.js";
import { DataTypes } from "sequelize";

export const Exam = s2g.define(
  "Exam",
  {
    ...BaseModle,
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
