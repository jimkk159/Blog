import mysql_pool from "../index.js";

//-----------------id---------------------
export const getDBSocial = async (id) => {
  const [socialUser] = await mysql_pool.query(
    "SELECT * FROM `secrect` WHERE id = ?",
    [id]
  );
  return socialUser[0];
};

export const getDBLocal = async (uid) => {
  const [localUser] = await mysql_pool.query(
    "SELECT * FROM `secrect` WHERE provider = ? AND user_id = ?",
    ["local", uid]
  );
  return localUser[0];
};

//----------------------------------------
export const getDBSocialByParams = async (provider, secrect) => {
  const [socialUser] = await mysql_pool.query(
    "SELECT * FROM `secrect` WHERE provider = ? AND secrect = ?",
    [provider, secrect]
  );
  return socialUser[0];
};
