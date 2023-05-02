import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";
import Post from "./post.js";

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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

Post.belongsToMany(Tag, { through: "PostTags" });
Tag.belongsToMany(Post, { through: "PostTags" });

await sequelize.sync();
export default Tag;
