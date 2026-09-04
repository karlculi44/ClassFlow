import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const ensurePresenceColumn = async () => {
  const [columns] = await pool.query(
    `
      SELECT COUNT(*) AS column_count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'last_seen_at'
    `,
  );

  if (columns[0].column_count === 0) {
    await pool.query("ALTER TABLE users ADD COLUMN last_seen_at DATETIME NULL");
  }
};

export default pool;
