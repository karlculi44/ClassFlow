import pool from "../config/db.js";

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
