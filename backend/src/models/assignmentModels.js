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
        classes.code AS class_code,
        submissions.id AS submission_id,
        submissions.grade AS grade
      FROM assignments
      INNER JOIN classes ON classes.id = assignments.class_id
      INNER JOIN enrollments ON enrollments.class_id = assignments.class_id
      LEFT JOIN submissions
        ON submissions.assignment_id = assignments.id
       AND submissions.student_id = enrollments.student_id
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

export const getStudentAssignmentById = async ({
  studentId,
  classId,
  assignmentId,
}) => {
  const [rows] = await pool.query(
    `
      SELECT assignments.*, submissions.id AS submission_id,
             submissions.content AS submission_content,
             submissions.attachment_name AS submission_attachment_name,
             submissions.attachment_url AS submission_attachment_url,
             submissions.submitted_at AS submission_submitted_at,
             submissions.updated_at AS submission_updated_at,
             submissions.grade AS submission_grade,
             submissions.feedback AS submission_feedback
      FROM assignments
      INNER JOIN enrollments ON enrollments.class_id = assignments.class_id
      LEFT JOIN submissions
        ON submissions.assignment_id = assignments.id
       AND submissions.student_id = enrollments.student_id
      WHERE assignments.id = ?
        AND assignments.class_id = ?
        AND enrollments.student_id = ?
      LIMIT 1
    `,
    [assignmentId, classId, studentId],
  );

  const assignment = rows[0];
  if (!assignment) {
    return null;
  }

  const submission = assignment.submission_id
    ? {
        id: assignment.submission_id,
        content: assignment.submission_content,
        attachment_name: assignment.submission_attachment_name,
        attachment_url: assignment.submission_attachment_url,
        submitted_at: assignment.submission_submitted_at,
        updated_at: assignment.submission_updated_at,
        grade: assignment.submission_grade,
        feedback: assignment.submission_feedback,
      }
    : null;

  delete assignment.submission_id;
  delete assignment.submission_content;
  delete assignment.submission_attachment_name;
  delete assignment.submission_attachment_url;
  delete assignment.submission_submitted_at;
  delete assignment.submission_updated_at;
  delete assignment.submission_grade;
  delete assignment.submission_feedback;

  return { ...assignment, submission };
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
