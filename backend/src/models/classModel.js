import pool from "../config/db.js";

export const findClassesByAdminId = async (adminId) => {
  const [rows] = await pool.query(
    `
      SELECT classes.id, classes.status, classes.code, classes.name,
             classes.schedule_days, classes.schedule_start_time,
             classes.schedule_end_time, classes.capacity,
             COUNT(DISTINCT users.id) AS student_count
      FROM classes
      LEFT JOIN enrollments ON enrollments.class_id = classes.id
      LEFT JOIN users ON users.id = enrollments.student_id
                     AND users.role = 'Student'
      WHERE classes.admin_id = ?
      GROUP BY classes.id, classes.status, classes.code, classes.name,
               classes.schedule_days, classes.schedule_start_time,
               classes.schedule_end_time, classes.capacity
      ORDER BY classes.name ASC
    `,
    [adminId],
  );

  return rows;
};

export const updateClassById = async ({
  classId,
  adminId,
  code,
  name,
  schedule_days,
  schedule_start_time,
  schedule_end_time,
  capacity,
  status,
}) => {
  const [result] = await pool.query(
    "UPDATE classes SET code = ?, name = ?, schedule_days = ?, schedule_start_time = ?, schedule_end_time = ?, capacity = ?, status = ? WHERE id = ? AND admin_id = ?",
    [
      code,
      name,
      JSON.stringify(schedule_days),
      schedule_start_time,
      schedule_end_time,
      capacity,
      status,
      classId,
      adminId,
    ],
  );

  return result.affectedRows;
};

export const createNewClass = async ({
  code,
  adminId,
  name,
  schedule_days,
  schedule_start_time,
  schedule_end_time,
  capacity,
  status = "Active",
}) => {
  const [rows] = await pool.query(
    "INSERT INTO classes (status, code, admin_id, name, schedule_days, schedule_start_time, schedule_end_time, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      status,
      code,
      adminId,
      name,
      JSON.stringify(schedule_days),
      schedule_start_time,
      schedule_end_time,
      capacity,
    ],
  );

  return rows[0];
};

export const deleteClassById = async ({ classId, adminId }) => {
  const [result] = await pool.query(
    "DELETE FROM classes WHERE id = ? AND admin_id = ?",
    [classId, adminId],
  );

  return result.affectedRows;
};
