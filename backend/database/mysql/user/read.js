import mysql_pool from "../index.js";

//-----------------id---------------------
export const getDBUser = async (uid) => {
  const [user] = await mysql_pool.query("SELECT * FROM `user` WHERE id = ?", [
    uid,
  ]);
  return user[0];
};

export const getDBUsers = async () => {
  const [users] = await mysql_pool.query("SELECT * FROM `user`");
  return users;
};

export const getDBUsersIn = async (uidArray) => {
  const [users] = await mysql_pool.query(
    "SELECT * FROM `user` WHERE `id` IN (?)",
    [uidArray]
  );
  return users;
};

//-----------------email---------------------
export const getDBUserByEmail = async (email) => {
  const [users] = await mysql_pool.query(
    "SELECT * FROM `user` WHERE `email`=?",
    [email]
  );
  return users[0];
};