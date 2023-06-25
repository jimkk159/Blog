import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";
import User from "./user.js";

const Auth = sequelize.define(
  "Auth",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    provider: {
      type: DataTypes.ENUM,
      values: ["local", "google"],
      defaultValue: "local",
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: { type: DataTypes.TEXT, defaultValue: "", allowNull: false },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["UserId", "provider"],
      },
    ],
  }
);

User.hasMany(Auth, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Auth.belongsTo(User);

await Auth.sync();
export default Auth;
