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

export const findUserForLogin = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, password as hashedPassword, role FROM users WHERE email = ?",
    [email],
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const saveRefreshToken = async (userId, refreshToken) => {
  const [rows] = await pool.query(
    "UPDATE users SET refresh_token = ? WHERE id = ?",
    [refreshToken, userId],
  );
  return rows;
};

export const deleteRefreshToken = async (userId) => {
  const [rows] = await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE id = ?",
    [userId],
  );
  return rows;
};
