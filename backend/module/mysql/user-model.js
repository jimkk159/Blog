import pool from "./index.js";
import queryPool from "./pool.js";
import queryConnection from "./connection.js";
import {
  id_,
  auth_,
  user_,
  user_name_,
  email_,
  avatar_,
  user_id_,
  provider_,
  password_,
  role_,
} from "../../utils/table.js";

//-----------------User---------------------
export const createOneUser = async ({
  name,
  email,
  avatar,
  provider,
  password,
  role,
}) => {
  let insertId;
  //Transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const cols = [user_name_, email_, avatar_];
    const vals = [name, email, avatar];
    if (role) cols.push(role_);
    if (role) vals.push(role);
    insertId = await queryConnection.createOne(connection, user_, cols, vals);
    await queryConnection.createOne(
      connection,
      auth_,
      [user_id_, provider_, password_],
      [insertId, provider, password]
    );

    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }
  return queryPool.getOne(user_, [id_], [insertId]);
};

export default { createOneUser };
