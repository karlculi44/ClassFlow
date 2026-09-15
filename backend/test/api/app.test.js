import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Express application", () => {
  it("responds to the root health route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("App is running!");
  });

  it("rejects malformed registration input before reaching the controller", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "A", email: "not-an-email", password: "short" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(expect.any(Array));
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("rejects protected resources without authentication", async () => {
    const response = await request(app).get("/api/classes");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Access denied. No token provided.",
    });
  });

  it("rejects student submission access without authentication", async () => {
    const response = await request(app).get("/api/submissions/12");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access denied. No token provided.");
  });

  it("does not expose unexpected internal errors", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
  });
});
