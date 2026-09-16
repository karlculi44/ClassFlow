import "./config/env.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import classRoutes from "./routes/classRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(apiLimiter);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

// Auth routes
app.use("/api/auth", authRoutes);

// Class routes
app.use("/api/classes", classRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/reports", reportRoutes);

// Test IP route
app.get("/api/test-ip", (req, res) => {
  res.json({
    ip: req.ip,
    forwardedFor: req.headers["x-forwarded-for"],
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("App is running!");
});

app.use(errorHandler);

export default app;
