import pool from "../config/db.js";

export const findOAuthAccount = async (provider, providerAccountId) => {
  const [rows] = await pool.query(
    `
      SELECT
        oa.id,
        oa.user_id,
        oa.provider,
        oa.provider_account_id
      FROM oauth_accounts oa
      WHERE oa.provider = ?
        AND oa.provider_account_id = ?
    `,
    [provider, providerAccountId],
  );

  return rows[0];
};

export const createOAuthAccount = async ({
  userId,
  provider,
  providerAccountId,
}) => {
  const [result] = await pool.query(
    `
      INSERT INTO oauth_accounts (
        user_id,
        provider,
        provider_account_id
      )
      VALUES (?, ?, ?)
    `,
    [userId, provider, providerAccountId],
  );

  return result;
};
