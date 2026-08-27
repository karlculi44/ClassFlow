import "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("App is running!");
});

export default app;
