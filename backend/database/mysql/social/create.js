import mysql_pool from "../index.js";
import { getDBSocial } from "./read.js";

//-----------------User---------------------
export const createDBSocial = async ({ uid, provider, subject }) => {
  let result;
  [result] = await mysql_pool.query(
    "INSERT INTO `user`(`user_id`, `provider`, `subject`) VALUES (?, ?, ?)",
    [uid, provider, subject]
  );

  return getDBSocial(result.insertId);
};
