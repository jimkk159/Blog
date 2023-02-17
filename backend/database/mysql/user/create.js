import mysql_pool from "../index.js";
import { getDBUser } from "./read.js";

//-----------------User---------------------
export const createDBUser = async ({
  name,
  email,
  avatar,
  password,
  preferId
}) => {

  let result;
  [result] = await mysql_pool.query(
    "INSERT INTO `user`(`name`, `email`, `avatar`, `password`, `prefer_id`) VALUES (?, ?, ?, ?, ?)",
    [name, email, avatar, password, preferId]
  );

  return getDBUser(result.insertId);
};
