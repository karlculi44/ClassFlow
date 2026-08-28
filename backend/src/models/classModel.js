import pool from "../config/db.js";

export const findClassesByAdminId = async (adminId) => {
  const [rows] = await pool.query(
    "SELECT id, status, code, name, schedule, capacity FROM classes WHERE admin_id = ? ORDER BY name ASC",
    [adminId],
  );

  return rows;
};

export const createNewClass = async ({
  code,
  adminId,
  name,
  schedule,
  capacity,
}) => {
  const [rows] = await pool.query(
    "INSERT INTO classes (status, code, admin_id, name, schedule, capacity) VALUES ('Active', ?, ?, ?, ?, ?)",
    [code, adminId, name, schedule, capacity],
  );

  return rows[0];
};
