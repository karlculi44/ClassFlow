import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import authRoutes from "../../src/routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("authentication route rate limiting", () => {
  it("limits authentication attempts after ten requests", async () => {
    const responses = [];

    for (let attempt = 0; attempt < 11; attempt += 1) {
      responses.push(
        await request(app).post("/api/auth/google-login").send({}),
      );
    }

    expect(responses.slice(0, 10).every(({ status }) => status === 400)).toBe(
      true,
    );
    expect(responses[10].status).toBe(429);
    expect(responses[10].body).toEqual({
      message: "Too many authentication attempts. Please try again later.",
    });
  });

  it("limits password reset attempts after five requests", async () => {
    const responses = [];

    for (let attempt = 0; attempt < 6; attempt += 1) {
      responses.push(
        await request(app).post("/api/auth/forgot-password").send({}),
      );
    }

    expect(responses.slice(0, 5).every(({ status }) => status === 400)).toBe(
      true,
    );
    expect(responses[5].status).toBe(429);
    expect(responses[5].body).toEqual({
      message: "Too many password reset attempts. Please try again later.",
    });
  });
});
