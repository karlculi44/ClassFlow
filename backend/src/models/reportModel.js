import pool from "../config/db.js";

export const getAdminReportSummary = async (adminId) => {
  const [classRows] = await pool.query(
    `
      SELECT classes.id, classes.name, classes.code,
             COUNT(DISTINCT enrollments.student_id) AS student_count,
             COUNT(DISTINCT assignments.id) AS assignment_count,
             COUNT(DISTINCT submissions.id) AS submission_count,
             AVG(submissions.grade) AS average_grade
      FROM classes
      LEFT JOIN enrollments ON enrollments.class_id = classes.id
      LEFT JOIN assignments ON assignments.class_id = classes.id
      LEFT JOIN submissions
        ON submissions.assignment_id = assignments.id
       AND submissions.student_id = enrollments.student_id
      WHERE classes.admin_id = ?
      GROUP BY classes.id, classes.name, classes.code
      ORDER BY classes.name ASC
    `,
    [adminId],
  );

  const [totals] = await pool.query(
    `
      SELECT COUNT(DISTINCT classes.id) AS total_classes,
             COUNT(DISTINCT enrollments.student_id) AS total_students,
             COUNT(DISTINCT assignments.id) AS total_assignments,
             COUNT(DISTINCT submissions.id) AS total_submissions
      FROM classes
      LEFT JOIN enrollments ON enrollments.class_id = classes.id
      LEFT JOIN assignments ON assignments.class_id = classes.id
      LEFT JOIN submissions
        ON submissions.assignment_id = assignments.id
       AND submissions.student_id = enrollments.student_id
      WHERE classes.admin_id = ?
    `,
    [adminId],
  );

  return { totals: totals[0], classes: classRows };
};

export const getAdminClassReport = async (adminId, classId) => {
  const [classRows] = await pool.query(
    "SELECT id, name, code FROM classes WHERE id = ? AND admin_id = ? LIMIT 1",
    [classId, adminId],
  );

  if (!classRows[0]) {
    return null;
  }

  const [studentRows] = await pool.query(
    `
            SELECT users.id, users.name, users.last_seen_at,
              CASE WHEN users.last_seen_at IS NOT NULL
                AND users.last_seen_at >= CURRENT_TIMESTAMP - INTERVAL 2 MINUTE
              THEN 'Online' ELSE 'Offline' END AS status,
             AVG(submissions.grade) AS average_grade,
             COUNT(DISTINCT submissions.id) AS submission_count
      FROM enrollments
      INNER JOIN users ON users.id = enrollments.student_id
       AND users.role = 'Student'
      LEFT JOIN assignments ON assignments.class_id = enrollments.class_id
      LEFT JOIN submissions
        ON submissions.assignment_id = assignments.id
       AND submissions.student_id = users.id
      WHERE enrollments.class_id = ?
      GROUP BY users.id, users.name
      ORDER BY users.name ASC
    `,
    [classId],
  );

  const [assignmentRows] = await pool.query(
    `
      SELECT assignments.id, assignments.title,
             AVG(submissions.grade) AS average_grade,
             COUNT(DISTINCT submissions.id) AS submission_count
      FROM assignments
      LEFT JOIN enrollments ON enrollments.class_id = assignments.class_id
      LEFT JOIN submissions
        ON submissions.assignment_id = assignments.id
       AND submissions.student_id = enrollments.student_id
      WHERE assignments.class_id = ?
      GROUP BY assignments.id, assignments.title
      ORDER BY assignments.title ASC
    `,
    [classId],
  );

  return {
    class: classRows[0],
    students: studentRows,
    assignments: assignmentRows,
  };
};
