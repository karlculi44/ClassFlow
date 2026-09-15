import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const jwtVerify = vi.hoisted(() => vi.fn());
const poolQuery = vi.hoisted(() => vi.fn().mockResolvedValue([{ affectedRows: 1 }]));
vi.mock("jsonwebtoken", () => ({
  default: { verify: jwtVerify },
}));
vi.mock("../../src/config/db.js", () => ({
  default: { query: poolQuery },
}));

const { default: app } = await import("../../src/app.js");

describe("authenticated route authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    poolQuery.mockResolvedValue([{ affectedRows: 1 }]);
  });

  it("allows an admin to access the admin welcome route", async () => {
    jwtVerify.mockReturnValue({ id: 1, role: "Admin" });

    const response = await request(app)
      .get("/api/auth/admin")
      .set("Cookie", "accessToken=admin-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Welcome, Admin!" });
  });

  it("denies a student access to the admin welcome route", async () => {
    jwtVerify.mockReturnValue({ id: 2, role: "Student" });

    const response = await request(app)
      .get("/api/auth/admin")
      .set("Cookie", "accessToken=student-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "You do not have access this resource.",
    });
  });

  it("continues when the presence update cannot reach the database", async () => {
    jwtVerify.mockReturnValue({ id: 1, role: "Admin" });
    poolQuery.mockRejectedValueOnce(new Error("database unavailable"));

    const response = await request(app)
      .get("/api/auth/admin")
      .set("Cookie", "accessToken=admin-token");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Welcome, Admin!");
  });
});
