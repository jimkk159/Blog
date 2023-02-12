import mysql_pool from "../index.js";
import { getDBUser } from "./read.js";

//-----------------User---------------------
export const createDBUser = async ({ name, email, avatar, password }) => {
  const [result] = await mysql_pool.query(
    "INSERT INTO `user`(`name`, `email`, `avatar`, `password`) VALUES (?, ?, ?, ?)",
    [name, email, avatar, password]
  );
  return getDBUser(result.insertId);
};
