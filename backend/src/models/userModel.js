import pool from "../config/db.js";

const rolePrefixes = { Student: "STU", Admin: "ADM" };

const generateUserCode = async (connection, role) => {
  const prefix = rolePrefixes[role];
  if (!prefix) {
    throw new Error(`Unsupported user role: ${role}`);
  }

  const lockName = `classflow:user-code:${prefix}`;
  const [lockRows] = await connection.query(
    "SELECT GET_LOCK(?, 10) AS acquired",
    [lockName],
  );
  if (lockRows[0]?.acquired !== 1) {
    throw new Error("Unable to reserve a user code.");
  }

  try {
    const [rows] = await connection.query(
      `
        SELECT COALESCE(MAX(CAST(SUBSTRING(user_code, 4) AS UNSIGNED)), 0) AS last_number
        FROM users
        WHERE user_code REGEXP ?
      `,
      [`^${prefix}[0-9]{6}$`],
    );
    return `${prefix}${String(Number(rows[0].last_number) + 1).padStart(6, "0")}`;
  } catch (error) {
    await connection.query("SELECT RELEASE_LOCK(?)", [lockName]);
    throw error;
  }
};

export const createUser = async ({
  name,
  email,
  hashedPassword,
  role = "Student",
}) => {
  const connection = await pool.getConnection();
  const lockName = `classflow:user-code:${rolePrefixes[role]}`;
  let lockHeld = false;
  try {
    const userCode = await generateUserCode(connection, role);
    lockHeld = true;
    const [result] = await connection.query(
      "INSERT INTO users (name, email, password, role, user_code) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, userCode],
    );
    return result;
  } finally {
    if (lockHeld) {
      await connection.query("SELECT RELEASE_LOCK(?)", [lockName]);
    }
    connection.release();
  }
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
    "SELECT id, name, email, password as hashedPassword, role, user_code, created_at FROM users WHERE email = ?",
    [email],
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, user_code, created_at FROM users WHERE id = ?",
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
    "SELECT id, name, email, role, user_code FROM users WHERE role = 'Student' ORDER BY name ASC",
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
