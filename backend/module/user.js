import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    avatar: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ["user", "root"],
      defaultValue: "user",
    },
    isEmailValidated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    updatePasswordAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: [
          "email",
          "role",
          "createdAt",
          "updatedAt",
          "isEmailValidated",
          "updatePasswordAt",
        ],
      },
    },
  }
);

await User.sync();
export default User;
