import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("JSON request body limit", () => {
  it("rejects request bodies larger than 1 MB", async () => {
    const oversizedBody = JSON.stringify({
      payload: "x".repeat(1024 * 1024),
    });

    const response = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(oversizedBody);

    expect(response.status).toBe(413);
    expect(response.body).toEqual({
      message: "request entity too large",
    });
  });
});
