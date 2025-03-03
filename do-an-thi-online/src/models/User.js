import { s2g } from "../config/database.js";
import { BaseModle } from "./Base.js";
import { DataTypes } from "sequelize";

export const User = s2g.define('User',{
  ...BaseModle,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},{
  tableName: "User",
  timestamps: true, // Nếu không có, Sequelize sẽ không tạo cột createdAt, updatedAt
});