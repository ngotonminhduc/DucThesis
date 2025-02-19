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
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
//   {
//     id: {
//       // type: DataTypes.INTEGER,
//       // autoIncrement: true,
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID v4
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: "User",
//     timestamps: true, // Nếu không có, Sequelize sẽ không tạo cột createdAt, updatedAt
//   }
// );

// export default User;
