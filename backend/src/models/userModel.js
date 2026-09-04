import pool from "../config/db.js";

export const createUser = async ({ name, email, hashedPassword }) => {
  const [rows] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, "Student"],
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
    "SELECT id, name, email, password as hashedPassword, role, created_at FROM users WHERE email = ?",
    [email],
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const findUserWithPasswordById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, password as hashedPassword FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const updateUserProfile = async ({ id, name, email }) => {
  const [rows] = await pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
  );
  return rows;
};

export const updateUserPassword = async (id, hashedPassword) => {
  const [rows] = await pool.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, id],
  );
  return rows;
};

export const findStudents = async () => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE role = 'Student' ORDER BY name ASC",
  );
  return rows;
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

export const findRefreshTokenByUserId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT refresh_token FROM users WHERE id = ?",
    [userId],
  );
  return rows[0].refresh_token;
};
