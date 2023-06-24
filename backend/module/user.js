import validator from "validator";
import { DataTypes } from "sequelize";

import sequelize from "../config/db-init.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    avatar: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ["user", "root"],
      defaultValue: "user",
    },
    isEmailValidated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    updatePasswordAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: [
          "email",
          "role",
          "createdAt",
          "updatedAt",
          "isEmailValidated",
          "updatePasswordAt",
        ],
      },
    },
  }
);

const processAvatar = (input) => {
  if (
    !!(input && (input.startsWith("https://") || input.startsWith("http://")))
  )
    return input;
  return "https://jimkk159-blog-img.s3.ap-northeast-1.amazonaws.com/" + input;
};

User.addHook("afterFind", "processAvatar", (result) => {
  if (Array.isArray(result)) {
    result.forEach((user) => {
      if (user && user.avatar) user.avatar = processAvatar(user.avatar);
    });
  } else {
    if (result && result.avatar) result.avatar = processAvatar(result.avatar);
  }
});

await User.sync();
export default User;
