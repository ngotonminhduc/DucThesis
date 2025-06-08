import { DataTypes } from "sequelize";
import { ulid } from "ulidx";

/**
 * @type {import("sequelize").ModelAttributes}
 */
export const BaseModel = {
  id: {
    type: DataTypes.STRING,
    defaultValue: () => ulid(), 
    primaryKey: true,
  },
};
