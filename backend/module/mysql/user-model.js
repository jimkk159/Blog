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
} from "../../utils/table.js";

//-----------------User---------------------
export const createOneUser = async ({
  name,
  email,
  avatar,
  provider,
  password,
}) => {
  let insertId;
  //Transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    insertId = await queryConnection.createOne(
      connection,
      user_,
      [user_name_, email_, avatar_],
      [name, email, avatar]
    );
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
  return queryPool.getOne(user_, id_, insertId);
};

export default { createOneUser };
