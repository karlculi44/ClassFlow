import "./config/env.js";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("App is running!");
});

export default app;
