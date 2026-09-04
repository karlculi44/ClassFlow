import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    try {
      await pool.query(
        `
          UPDATE users
          SET last_seen_at = CURRENT_TIMESTAMP
          WHERE id = ?
            AND (
              last_seen_at IS NULL OR
              last_seen_at < CURRENT_TIMESTAMP - INTERVAL 1 MINUTE
            )
        `,
        [decoded.id],
      );
    } catch (presenceError) {
      console.error("Unable to update user presence:", presenceError);
    }

    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

export default verifyToken;
