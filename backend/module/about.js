import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";

const About = sequelize.define(
  "About",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
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
About.sync();
export default About;
