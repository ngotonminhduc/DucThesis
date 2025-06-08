import { s2g } from "../config/database.js";
import { BaseModel } from "./Base.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
import { Role } from "./Role.js";

export const UserRole = s2g.define(
  "UserRole",
  {
    ...BaseModel,
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Role,
        key: 'id'
      }
    }
  },
  {
    tableName: "UserRole",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'roleId']
      }
    ]
  }
); 