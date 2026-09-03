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
      SELECT users.id, users.name, users.email, users.role
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
             classes.schedule, classes.capacity
      FROM enrollments
      INNER JOIN classes ON classes.id = enrollments.class_id
      WHERE enrollments.student_id = ?
      ORDER BY classes.name ASC
    `,
    [studentId],
  );

  return rows;
};
