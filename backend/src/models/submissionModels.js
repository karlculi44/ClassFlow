import pool from "../config/db.js";

export const getSubmissionByAssignmentAndStudent = async ({
  assignmentId,
  studentId,
}) => {
  const [rows] = await pool.query(
    `
			SELECT submissions.id, submissions.assignment_id, submissions.student_id,
						 submissions.content, submissions.attachment_name,
						 submissions.attachment_url, submissions.submitted_at,
						 submissions.updated_at
			FROM submissions
			INNER JOIN assignments ON assignments.id = submissions.assignment_id
			INNER JOIN enrollments ON enrollments.class_id = assignments.class_id
			WHERE submissions.assignment_id = ? AND submissions.student_id = ?
				AND enrollments.student_id = ?
			LIMIT 1
		`,
    [assignmentId, studentId, studentId],
  );

  return rows[0];
};

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

export const updateSubmission = async ({
  assignmentId,
  studentId,
  content,
  attachmentName,
  attachmentUrl,
}) => {
  const [result] = await pool.query(
    `
			UPDATE submissions
			SET content = ?,
					attachment_name = COALESCE(?, attachment_name),
					attachment_url = COALESCE(?, attachment_url),
					updated_at = CURRENT_TIMESTAMP
			WHERE assignment_id = ? AND student_id = ?
		`,
    [content || null, attachmentName, attachmentUrl, assignmentId, studentId],
  );

  if (!result.affectedRows) {
    return null;
  }

  return getSubmissionByAssignmentAndStudent({ assignmentId, studentId });
};
