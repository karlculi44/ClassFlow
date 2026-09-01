import pool from "../config/db.js";

export const createNewAssignment = async ({
  classId,
  title,
  description,
  dueDate,
}) => {
  const [result] = await pool.query(
    `
      INSERT INTO assignments (
        class_id,
        title,
        description,
        due_date
      )
      VALUES (?, ?, ?, ?)
    `,
    [classId, title, description, dueDate],
  );

  return result;
};

export const getAssignmentByClassId = async (classId) => {
  const [rows] = await pool.query(
    `
      SELECT * FROM assignments
      WHERE class_id = ?
    `,
    [classId],
  );
  return rows;
};
