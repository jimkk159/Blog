import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";

const About = sequelize.define(
  "About",
  {},
  {
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
  }
);
// Tag.sync();
export default About;
