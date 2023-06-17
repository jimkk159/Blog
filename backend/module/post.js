import User from "./user.js";
import validator from "validator";
import { Sequelize, DataTypes } from "sequelize";
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
    summary: {
      type: DataTypes.TEXT,
      validate: {
        validateSummary(value) {
          if (!validator.isLength(value, { max: 500 })) {
            throw errorTable.summaryValidateFailError();
          }
        },
      },
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
    editedAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
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
