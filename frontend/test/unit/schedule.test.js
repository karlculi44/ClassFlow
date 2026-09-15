import { describe, expect, it } from "vitest";
import {
  formatSchedule,
  formatTime,
  isScheduleActive,
  normalizeDays,
} from "../../src/utils/schedule";

describe("schedule utilities", () => {
  it("normalizes JSON and array day values in weekday order", () => {
    expect(normalizeDays('["Friday", "Monday", "Friday"]')).toEqual([
      "Monday",
      "Friday",
    ]);
    expect(normalizeDays("not-json")).toEqual([]);
  });

  it.each([
    ["00:05", "12:05 AM"],
    ["12:30", "12:30 PM"],
    ["18:45", "6:45 PM"],
  ])("formats %s as %s", (time, expected) => {
    expect(formatTime(time)).toBe(expected);
  });

  it("reports whether a class is active at a specific time", () => {
    const classItem = {
      schedule_days: ["Monday"],
      schedule_start_time: "09:00",
      schedule_end_time: "10:00",
    };

    expect(isScheduleActive(classItem, new Date(2026, 8, 14, 9, 30))).toBe(true);
    expect(isScheduleActive(classItem, new Date(2026, 8, 14, 10, 0))).toBe(false);
    expect(isScheduleActive(classItem, new Date(2026, 8, 15, 9, 30))).toBe(false);
  });

  it("formats pending and multi-day schedules", () => {
    expect(formatSchedule({})).toBe("Schedule pending");
    expect(formatSchedule({
      schedule_days: ["Wednesday", "Monday"],
      schedule_start_time: "13:00",
      schedule_end_time: "14:30",
    })).toBe("Monday & Wednesday • 1:00 PM – 2:30 PM");
  });
});
