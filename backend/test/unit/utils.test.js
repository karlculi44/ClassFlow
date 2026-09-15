import { describe, expect, it } from "vitest";
import AppError from "../../src/utils/AppError.js";
import hashToken from "../../src/utils/hashToken.js";
import { normalizeSchedule } from "../../src/utils/schedule.js";

describe("hashToken", () => {
  it("returns a deterministic SHA-256 hexadecimal digest", () => {
    expect(hashToken("refresh-token")).toBe(
      "0eb17643d4e9261163783a420859c92c7d212fa9624106a12b510afbec266120",
    );
  });

  it("produces different digests for different input", () => {
    expect(hashToken("token-a")).not.toBe(hashToken("token-b"));
  });
});

describe("AppError", () => {
  it("preserves the message and status code", () => {
    const error = new AppError("Not found", 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
  });
});

describe("normalizeSchedule", () => {
  const validSchedule = {
    schedule_days: ["Wednesday", "Monday", "Wednesday"],
    schedule_start_time: "09:00",
    schedule_end_time: "10:30",
  };

  it("deduplicates and orders valid weekdays", () => {
    expect(normalizeSchedule(validSchedule)).toEqual({
      schedule_days: ["Monday", "Wednesday"],
      schedule_start_time: "09:00",
      schedule_end_time: "10:30",
    });
  });

  it.each([
    ["empty days", { ...validSchedule, schedule_days: [] }],
    ["unknown day", { ...validSchedule, schedule_days: ["Funday"] }],
    ["missing start time", { ...validSchedule, schedule_start_time: "" }],
    ["missing end time", { ...validSchedule, schedule_end_time: "" }],
    ["non-chronological times", { ...validSchedule, schedule_start_time: "11:00" }],
  ])("rejects %s", (_, schedule) => {
    expect(() => normalizeSchedule(schedule)).toThrow();
  });
});
