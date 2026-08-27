import "./config/env.js";
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is running!");
});

export default app;
