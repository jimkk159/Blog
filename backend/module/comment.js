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
      type: DataTypes.TEXT,
      allowNull: false,
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

Post.hasMany(Comment, {
  foreignKey: {
    allowNull: false,
    notNull: true,
  },
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: {
    allowNull: false,
    notNull: true,
  },
  onDelete: "CASCADE",
});
User.hasMany(Comment, { foreignKey: "AuthorId" });
Comment.belongsTo(User, { foreignKey: "AuthorId", as: "Author" });

await Comment.sync();
export default Comment;
