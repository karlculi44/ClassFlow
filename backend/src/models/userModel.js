import pool from "../config/db.js";

export const createUser = async ({ name, email, hashedPassword, role }) => {
  const [rows] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
  );
  return rows;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, role FROM users WHERE email = ?",
    [email],
  );
  return rows[0];
};
