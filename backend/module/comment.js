import { DataTypes } from "sequelize";

import User from "./user.js";
import Post from "./post.js";
import sequelize from "../config/db-init.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["createdAt"],
      },
    },
  }
);

Post.hasMany(Comment);
Comment.belongsTo(Post);
User.hasMany(Comment, { foreignKey: "AuthorId" });
Comment.belongsTo(User, { foreignKey: "AuthorId", as: "Author" });

await Comment.sync();
export default Comment;

