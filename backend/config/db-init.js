import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

// Connecting to a database
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    dialectOptions: {
      connectionLimit: 20,
    },
    logging: false,
  }
);

// Testing the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connect successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
//reference: https://stackoverflow.com/questions/70240102/multiple-transactions-in-mysql-for-node
//reference: https://stackoverflow.com/questions/4073923/select-last-row-in-mysql
//reference: https://stackoverflow.com/questions/33957252/node-js-mysql-query-where-id-array
