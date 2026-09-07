import pool from "../config/db.js";

export const createPasswordResetToken = async ({
  userId,
  tokenHash,
  expiresAt,
}) => {
  await pool.query(
    "DELETE FROM password_reset_tokens WHERE user_id = ? AND (used_at IS NOT NULL OR expires_at <= CURRENT_TIMESTAMP)",
    [userId],
  );
  await pool.query(
    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [userId, tokenHash, expiresAt],
  );
};

export const consumePasswordResetToken = async ({
  tokenHash,
  hashedPassword,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      `
        SELECT id, user_id
        FROM password_reset_tokens
        WHERE token_hash = ?
          AND used_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        FOR UPDATE
      `,
      [tokenHash],
    );

    const resetToken = rows[0];
    if (!resetToken) {
      await connection.rollback();
      return null;
    }

    await connection.query(
      "UPDATE users SET password = ?, refresh_token = NULL WHERE id = ?",
      [hashedPassword, resetToken.user_id],
    );
    await connection.query(
      "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
      [resetToken.id],
    );
    await connection.commit();
    return resetToken.user_id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
