import "./config/env.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import classRoutes from "./routes/classRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);

// Class routes
app.use("/api/classes", classRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("App is running!");
});

app.use(errorHandler);

export default app;
