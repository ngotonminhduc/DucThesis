import { ulid } from "ulidx";
import { s2g } from "../config/database.js";
import { BaseModle } from "./Base.js";
import { DataTypes, Sequelize } from "sequelize";

export const Question = s2g.define('Question',{
  ...BaseModle,
  examId: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},
{
  tableName: "Question",
  timestamps: true, // Tự động thêm createdAt, updatedAt
});
