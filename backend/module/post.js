import User from "./user.js";
import validator from "validator";
import { DataTypes } from "sequelize";
import Category from "./category.js";
import sequelize from "../config/db-init.js";
import * as errorTable from "../utils/error/error-table.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    previewImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previewSummary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      validate: {
        validateSummary(value) {
          if (!validator.isLength(value, { max: 500 })) {
            throw errorTable.summaryValidateFailError();
          }
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["createdAt"],
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
