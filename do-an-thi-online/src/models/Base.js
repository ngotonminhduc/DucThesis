import { DataTypes } from "sequelize";
import { ulid } from "ulidx";

/**
 * @type {import("sequelize").ModelAttributes}
 */
export const BaseModle = {
  id: {
    type: DataTypes.STRING,
    defaultValue: ulid(), // Tự động tạo UUID v4
    primaryKey: true,
  },
  createdAt: {
    defaultValue: new Date(),
    type: DataTypes.DATE
  }
};
