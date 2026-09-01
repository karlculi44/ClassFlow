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

export const getAssignmentsByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    `
      SELECT
        assignments.id,
        assignments.class_id,
        assignments.title,
        assignments.description,
        assignments.due_date,
        classes.name AS class_name,
        classes.code AS class_code
      FROM assignments
      INNER JOIN classes ON classes.id = assignments.class_id
      INNER JOIN enrollments ON enrollments.class_id = assignments.class_id
      WHERE enrollments.student_id = ?
      ORDER BY assignments.due_date ASC, classes.code ASC
    `,
    [studentId],
  );

  return rows;
};

export const getAssignmentById = async ({ classId, assignmentId }) => {
  const [rows] = await pool.query(
    `
      SELECT * FROM assignments
      WHERE id = ? AND class_id = ?
      LIMIT 1
    `,
    [assignmentId, classId],
  );

  return rows[0];
};

export const updateAssignmentById = async ({
  classId,
  assignmentId,
  title,
  description,
  dueDate,
  attachmentName,
  attachmentUrl,
}) => {
  const [result] = await pool.query(
    `
      UPDATE assignments
      SET title = ?, description = ?, due_date = ?,
          attachment_name = ?, attachment_url = ?
      WHERE id = ? AND class_id = ?
    `,
    [
      title,
      description,
      dueDate,
      attachmentName,
      attachmentUrl,
      assignmentId,
      classId,
    ],
  );

  return result.affectedRows;
};

export const deleteAssignmentById = async ({ classId, assignmentId }) => {
  const [result] = await pool.query(
    "DELETE FROM assignments WHERE id = ? AND class_id = ?",
    [assignmentId, classId],
  );

  return result.affectedRows;
};
