import pool from "../config/db.js";

export const addStudentToClass = async (classId, studentId) => {
  const [rows] = await pool.query(
    "INSERT INTO enrollments (class_id, student_id) VALUES (?, ?)",
    [classId, studentId],
  );

  return rows;
};

export const addStudentsToClass = async (classId, studentIds) => {
  const placeholders = studentIds.map(() => "?").join(", ");
  const [result] = await pool.query(
    `
      INSERT IGNORE INTO enrollments (class_id, student_id)
      SELECT ?, id
      FROM users
      WHERE id IN (${placeholders}) AND role = 'Student'
    `,
    [classId, ...studentIds],
  );

  return result.affectedRows;
};

export const findStudentsByClassId = async (classId) => {
  const [rows] = await pool.query(
    `
            SELECT users.id, users.name, users.email, users.role, users.user_code,
              users.last_seen_at,
              CASE WHEN users.last_seen_at IS NOT NULL
                AND users.last_seen_at >= CURRENT_TIMESTAMP - INTERVAL 2 MINUTE
              THEN 'Online' ELSE 'Offline' END AS status
      FROM enrollments
      INNER JOIN users ON users.id = enrollments.student_id
      WHERE enrollments.class_id = ? AND users.role = 'Student'
      ORDER BY users.name ASC
    `,
    [classId],
  );

  return rows;
};

export const findClassesByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    `
            SELECT classes.id, classes.status, classes.code, classes.name,
              classes.schedule, classes.capacity,
              admins.name AS instructor_name,
              admins.last_seen_at AS instructor_last_seen_at,
              CASE WHEN admins.last_seen_at IS NOT NULL
                    AND admins.last_seen_at >= CURRENT_TIMESTAMP - INTERVAL 2 MINUTE
                  THEN 'Online' ELSE 'Offline' END AS instructor_status
      FROM enrollments
      INNER JOIN classes ON classes.id = enrollments.class_id
            INNER JOIN users AS admins ON admins.id = classes.admin_id
      WHERE enrollments.student_id = ?
      ORDER BY classes.name ASC
    `,
    [studentId],
  );

  return rows;
};

export const findAdminStudents = async (adminId) => {
  const [rows] = await pool.query(
    `
            SELECT users.id, users.name, users.email, users.role, users.user_code,
              users.last_seen_at,
              CASE WHEN users.last_seen_at IS NOT NULL
                AND users.last_seen_at >= CURRENT_TIMESTAMP - INTERVAL 2 MINUTE
              THEN 'Online' ELSE 'Offline' END AS status,
             COUNT(DISTINCT classes.id) AS class_count,
             GROUP_CONCAT(DISTINCT classes.name ORDER BY classes.name SEPARATOR ', ') AS class_names
      FROM enrollments
      INNER JOIN users ON users.id = enrollments.student_id
      INNER JOIN classes ON classes.id = enrollments.class_id
        AND classes.admin_id = ?
      WHERE users.role = 'Student'
      GROUP BY users.id, users.name, users.email, users.role, users.user_code,
           users.last_seen_at
      ORDER BY users.name ASC
    `,
    [adminId],
  );

  return rows;
};

export const findAdminStudentDetails = async (adminId, studentId) => {
  const [rows] = await pool.query(
    `
            SELECT users.id AS student_id, users.name AS student_name,
              users.user_code AS student_code,
             users.last_seen_at AS student_last_seen_at,
             CASE WHEN users.last_seen_at IS NOT NULL
                    AND users.last_seen_at >= CURRENT_TIMESTAMP - INTERVAL 2 MINUTE
                  THEN 'Online' ELSE 'Offline' END AS student_status,
             users.email AS student_email, users.role,
             classes.id AS class_id, classes.name AS class_name,
             classes.code AS class_code, classes.schedule, classes.status AS class_status,
             assignments.id AS assignment_id, assignments.title AS assignment_title,
             assignments.due_date, submissions.submitted_at,
             submissions.grade, submissions.id AS submission_id
      FROM users
      INNER JOIN enrollments ON enrollments.student_id = users.id
      INNER JOIN classes ON classes.id = enrollments.class_id
        AND classes.admin_id = ?
      LEFT JOIN assignments ON assignments.class_id = classes.id
      LEFT JOIN submissions ON submissions.assignment_id = assignments.id
        AND submissions.student_id = users.id
      WHERE users.id = ? AND users.role = 'Student'
      ORDER BY classes.name ASC, assignments.due_date ASC
    `,
    [adminId, studentId],
  );

  if (!rows.length) {
    return null;
  }

  const first = rows[0];
  const classes = new Map();
  const assignments = [];

  rows.forEach((row) => {
    if (!classes.has(row.class_id)) {
      classes.set(row.class_id, {
        id: row.class_id,
        name: row.class_name,
        code: row.class_code,
        schedule: row.schedule,
        status: row.class_status,
      });
    }
    if (row.assignment_id) {
      assignments.push({
        id: row.assignment_id,
        title: row.assignment_title,
        class_id: row.class_id,
        class_name: row.class_name,
        due_date: row.due_date,
        submitted_at: row.submitted_at,
        submission_id: row.submission_id,
        grade: row.grade,
      });
    }
  });

  return {
    student: {
      id: first.student_id,
      name: first.student_name,
      user_code: first.student_code,
      last_seen_at: first.student_last_seen_at,
      status: first.student_status,
      email: first.student_email,
      role: first.role,
    },
    classes: [...classes.values()],
    assignments,
  };
};
