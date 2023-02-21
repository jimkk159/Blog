import mysql from "mysql2";

const mysql_pool = mysql
  .createPool({
    connectionLimit: 20,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export default mysql_pool;
//reference: https://stackoverflow.com/questions/70240102/multiple-transactions-in-mysql-for-node
//reference: https://stackoverflow.com/questions/4073923/select-last-row-in-mysql
//reference: https://stackoverflow.com/questions/33957252/node-js-mysql-query-where-id-array
