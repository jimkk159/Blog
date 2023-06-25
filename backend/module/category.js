import { DataTypes } from "sequelize";
import sequelize from "../config/db-init.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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

Category.hasMany(Category, { foreignKey: "ParentId", as: "Child" });
Category.belongsTo(Category, { foreignKey: "ParentId", as: "Parent" });

await Category.sync();

export default Category;
