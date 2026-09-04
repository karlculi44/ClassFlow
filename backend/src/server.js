import app from "./app.js";
import pool, { ensurePresenceColumn } from "./config/db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.getConnection();
    await ensurePresenceColumn();
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
