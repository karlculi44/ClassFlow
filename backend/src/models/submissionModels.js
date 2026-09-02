import pool from "../config/db.js";

export const createSubmission = async ({
  assignmentId,
  studentId,
  content,
  attachmentName,
  attachmentUrl,
}) => {
  const [eligibleRows] = await pool.query(
    `
			SELECT assignments.id
			FROM assignments
			INNER JOIN enrollments ON enrollments.class_id = assignments.class_id
			WHERE assignments.id = ? AND enrollments.student_id = ?
			LIMIT 1
		`,
    [assignmentId, studentId],
  );

  if (!eligibleRows[0]) {
    return null;
  }

  await pool.query(
    `
			INSERT INTO submissions (
				assignment_id,
				student_id,
				content,
				attachment_name,
				attachment_url
			)
			VALUES (?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				content = VALUES(content),
				attachment_name = COALESCE(VALUES(attachment_name), attachment_name),
				attachment_url = COALESCE(VALUES(attachment_url), attachment_url),
				updated_at = CURRENT_TIMESTAMP
		`,
    [assignmentId, studentId, content || null, attachmentName, attachmentUrl],
  );

  const [rows] = await pool.query(
    `
			SELECT id, assignment_id, student_id, content, attachment_name,
						 attachment_url, submitted_at, updated_at
			FROM submissions
			WHERE assignment_id = ? AND student_id = ?
			LIMIT 1
		`,
    [assignmentId, studentId],
  );

  return rows[0];
};
