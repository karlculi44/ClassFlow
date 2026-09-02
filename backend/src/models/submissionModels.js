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

export const getAdminAssignmentSubmissions = async ({
  adminId,
  classId,
  assignmentId,
}) => {
  const [rows] = await pool.query(
    `
			SELECT assignments.id AS assignment_id, assignments.title,
						 assignments.due_date, classes.name AS class_name,
						 classes.code AS class_code, users.id AS student_id,
						 users.name AS student_name, users.email AS student_email,
						 submissions.id AS submission_id, submissions.content,
						 submissions.attachment_name, submissions.attachment_url,
						 submissions.submitted_at, submissions.updated_at,
						 submissions.grade, submissions.feedback
			FROM assignments
			INNER JOIN classes
				ON classes.id = assignments.class_id AND classes.admin_id = ?
      LEFT JOIN enrollments ON enrollments.class_id = classes.id
      LEFT JOIN users ON users.id = enrollments.student_id
			LEFT JOIN submissions
				ON submissions.assignment_id = assignments.id
			 AND submissions.student_id = users.id
			WHERE assignments.id = ? AND assignments.class_id = ?
			ORDER BY users.name ASC
		`,
    [adminId, assignmentId, classId],
  );

  if (!rows.length) {
    return null;
  }

  const { assignment_id, title, due_date, class_name, class_code } = rows[0];
  return {
    assignment: {
      id: assignment_id,
      title,
      due_date,
      class_name,
      class_code,
      submitted_count: rows.filter(
        (row) => row.student_id !== null && row.submission_id !== null,
      ).length,
      total_students: rows.filter((row) => row.student_id !== null).length,
    },
    students: rows
      .filter((row) => row.student_id !== null)
      .map((row) => ({
        id: row.student_id,
        name: row.student_name,
        email: row.student_email,
        submission: row.submission_id
          ? {
              id: row.submission_id,
              content: row.content,
              attachment_name: row.attachment_name,
              attachment_url: row.attachment_url,
              submitted_at: row.submitted_at,
              updated_at: row.updated_at,
              grade: row.grade,
              feedback: row.feedback,
            }
          : null,
      })),
  };
};

export const getAdminSubmission = async ({
  adminId,
  classId,
  assignmentId,
  studentId,
}) => {
  const [rows] = await pool.query(
    `
			SELECT submissions.id, submissions.content, submissions.attachment_name,
						 submissions.attachment_url, submissions.submitted_at,
						 submissions.updated_at, submissions.grade, submissions.feedback,
						 users.id AS student_id, users.name AS student_name,
						 users.email AS student_email
			FROM submissions
			INNER JOIN assignments ON assignments.id = submissions.assignment_id
			INNER JOIN classes
				ON classes.id = assignments.class_id AND classes.admin_id = ?
			INNER JOIN users ON users.id = submissions.student_id
			WHERE assignments.id = ? AND assignments.class_id = ?
				AND submissions.student_id = ?
			LIMIT 1
		`,
    [adminId, assignmentId, classId, studentId],
  );

  return rows[0];
};

export const updateSubmissionGrade = async ({
  adminId,
  classId,
  assignmentId,
  studentId,
  grade,
  feedback,
}) => {
  const [result] = await pool.query(
    `
			UPDATE submissions
			INNER JOIN assignments ON assignments.id = submissions.assignment_id
			INNER JOIN classes
				ON classes.id = assignments.class_id AND classes.admin_id = ?
			SET submissions.grade = ?, submissions.feedback = ?
			WHERE submissions.assignment_id = ? AND assignments.class_id = ?
				AND submissions.student_id = ?
		`,
    [adminId, grade, feedback || null, assignmentId, classId, studentId],
  );

  return result.affectedRows;
};
