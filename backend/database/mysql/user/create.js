import mysql_pool from "../index.js";
import { getDBUser } from "./read.js";

//-----------------User---------------------
export const createDBUserLocal = async ({
  name,
  email,
  avatar,
  password,
  preferId,
}) => {
  let result;
  const connection = await mysql_pool.getConnection();
  try {
    await connection.beginTransaction();
    [result] = await mysql_pool.query(
      "INSERT INTO `user`(`name`, `email`, `avatar`, `prefer_id`) VALUES (?, ?, ?, ?)",
      [name, email, avatar, preferId]
    );
    const result2 = await mysql_pool.query(
      "INSERT INTO `secrect`(`user_id`, `provider`, `secrect`) VALUES (?, ?, ?)",
      [result.insertId, "local", password]
    );
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
  }

  return getDBUser(result.insertId);
};

export const createDBUserSocial = async ({
  name,
  email,
  avatar,
  provider,
  sercrect,
  preferId,
}) => {
  let result;
  const connection = await mysql_pool.getConnection();
  try {
    await connection.beginTransaction();
    [result] = await mysql_pool.query(
      "INSERT INTO `user`(`name`, `email`, `avatar`) VALUES (?, ?, ?)",
      [name, email, avatar]
    );
    await mysql_pool.query(
      "INSERT INTO `secrect`(`user_id`, `provider`, `secrect`) VALUES (?, ?, ?)",
      [result.insertId, provider, sercrect]
    );
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
  }

  return getDBUser(result.insertId);
};
