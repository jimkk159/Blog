import { DataTypes } from "sequelize";
import User from "./user.js";
import Category from "./category.js";
import sequelize from "../config/db-init.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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

Category.hasMany(Post);
Post.belongsTo(Category);
User.hasMany(Post, { foreignKey: "AuthorId" });
Post.belongsTo(User, { foreignKey: "AuthorId", as: "Author" });

await Post.sync();
export default Post;
