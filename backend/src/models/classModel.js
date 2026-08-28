import pool from "../config/db.js";

export const findClassesByAdminId = async (adminId) => {
  const [rows] = await pool.query(
    "SELECT id, status, code, name, schedule, capacity FROM classes WHERE admin_id = ? ORDER BY name ASC",
    [adminId],
  );

  return rows;
};

export const updateClassById = async ({
  classId,
  adminId,
  code,
  name,
  schedule,
  capacity,
  status,
}) => {
  const [result] = await pool.query(
    "UPDATE classes SET code = ?, name = ?, schedule = ?, capacity = ?, status = ? WHERE id = ? AND admin_id = ?",
    [code, name, schedule, capacity, status, classId, adminId],
  );

  return result.affectedRows;
};

export const createNewClass = async ({
  code,
  adminId,
  name,
  schedule,
  capacity,
  status = "Active",
}) => {
  const [rows] = await pool.query(
    "INSERT INTO classes (status, code, admin_id, name, schedule, capacity) VALUES (?, ?, ?, ?, ?, ?)",
    [status, code, adminId, name, schedule, capacity],
  );

  return rows[0];
};
