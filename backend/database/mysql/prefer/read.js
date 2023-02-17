import mysql_pool from "../index.js";

//-----------------id---------------------
export const getDBPrefer = async (id) => {
  const [prefer] = await mysql_pool.query(
    "SELECT * FROM `prefer` WHERE `id` = ?",
    [id]
  );
  return prefer[0];
};

//-----------------params-----------------
export const getDBPreferByParams = async ({ theme, language }) => {
  const [prefer] = await mysql_pool.query(
    "SELECT * FROM `prefer` WHERE `theme` = ? AND `language` = ?",
    [theme, language]
  );
  return prefer[0];
};
