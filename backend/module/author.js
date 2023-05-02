import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";

const Author = sequelize.define(
  "Author",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    desciption: {
      type: DataTypes.STRING,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
  }
);
// Tag.sync();
export default Author;
