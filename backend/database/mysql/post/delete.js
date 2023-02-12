import mysql_pool from "../index.js";

//-----------------Post---------------------
export const deleteDBPost = async (uid) => {
  const [result] = await mysql_pool.query("DELETE FROM `post` WHERE `id`= ?;", [
    uid,
  ]);
  return result;
};
