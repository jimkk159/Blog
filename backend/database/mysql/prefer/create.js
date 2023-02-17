import mysql_pool from "../index.js";
import { getDBPrefer } from "../../mysql/prefer/read.js";

export const createDBPrefer = async ({ theme, language }) => {
  const [prefer] = await mysql_pool.query(
    "INSERT INTO `prefer`(`theme`, `language`) VALUES (?, ?)",
    [theme, language]
  );

  return getDBPrefer(prefer.insertId);
};
