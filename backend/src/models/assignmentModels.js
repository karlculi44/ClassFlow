import pool from "../config/db.js";

export const createNewAssignment = async ({
  classId,
  title,
  description,
  dueDate,
  attachmentName = null,
  attachmentUrl = null,
}) => {
  const [result] = await pool.query(
    `
      INSERT INTO assignments (
        class_id,
        title,
        description,
        due_date,
        attachment_name,
        attachment_url
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [classId, title, description, dueDate, attachmentName, attachmentUrl],
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
