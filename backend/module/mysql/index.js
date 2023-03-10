import mysql from "mysql2";
import catchAsync from "../../utils/catch-async.js";

const pool = mysql
  .createPool({
    connectionLimit: 20,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const checkDB = catchAsync(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    if (connection.state === "disconnected")
      console.log(
        `Connect database fail. Check that its running and that your configuration is correct`
      );
    else console.log("Connect database successfully");
    connection.release();
  } catch (err) {
    if (connection) connection.release();
    console.warn(`Connect database fail...\n${err}`);
  }
});
checkDB();
export default pool;
//reference: https://stackoverflow.com/questions/70240102/multiple-transactions-in-mysql-for-node
//reference: https://stackoverflow.com/questions/4073923/select-last-row-in-mysql
//reference: https://stackoverflow.com/questions/33957252/node-js-mysql-query-where-id-array
