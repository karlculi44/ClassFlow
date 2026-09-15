import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../../src/schemas/authSchema.js";
import {
  createAssignmentParamsSchema,
  createAssignmentSchema,
} from "../../src/schemas/assignmentSchema.js";
import { createClassSchema } from "../../src/schemas/classSchema.js";
import {
  gradeSubmissionSchema,
  submitAssignmentSchema,
  submitAssignmentParamsSchema,
} from "../../src/schemas/submissionSchema.js";

describe("authentication schemas", () => {
  it("normalizes valid registration data", () => {
    expect(
      registerSchema.parse({
        name: "  Ada Lovelace ",
        email: " ADA@EXAMPLE.COM ",
        password: "secret123",
      }),
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });
  });

  it("rejects short passwords and unknown registration fields", () => {
    expect(registerSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "short",
    }).success).toBe(false);
    expect(registerSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "secret123",
      role: "Admin",
    }).success).toBe(false);
  });

  it("requires matching reset passwords", () => {
    expect(resetPasswordSchema.safeParse({
      token: "token",
      password: "secret123",
      confirmPassword: "different",
    }).success).toBe(false);
  });

  it("validates login and password-reset email input", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "secret123" }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "ada@example.com" }).success).toBe(true);
  });
});

describe("class and assignment schemas", () => {
  const classData = {
    code: "CS101",
    name: "Computer Science",
    schedule_days: ["Monday", "Friday"],
    schedule_start_time: "09:00",
    schedule_end_time: "10:00",
    capacity: "30",
    status: "Active",
  };

  it("coerces a valid class capacity", () => {
    expect(createClassSchema.parse(classData).capacity).toBe(30);
  });

  it("rejects an invalid class time range and duplicate fields", () => {
    expect(createClassSchema.safeParse({
      ...classData,
      schedule_start_time: "10:00",
    }).success).toBe(false);
    expect(createClassSchema.safeParse({ ...classData, extra: true }).success).toBe(false);
  });

  it("accepts valid assignment data and positive numeric params", () => {
    expect(createAssignmentSchema.safeParse({
      title: "Quiz",
      description: "Read chapter one",
      dueDate: "2026-10-01",
    }).success).toBe(true);
    expect(createAssignmentParamsSchema.parse({ classId: "12" })).toEqual({ classId: 12 });
  });

  it("rejects impossible assignment dates and invalid params", () => {
    expect(createAssignmentSchema.safeParse({
      title: "Quiz",
      description: "Read chapter one",
      dueDate: "2026-02-30",
    }).success).toBe(false);
    expect(createAssignmentParamsSchema.safeParse({ classId: "0" }).success).toBe(false);
  });
});

describe("submission schemas", () => {
  it("normalizes grade and optional feedback", () => {
    expect(gradeSubmissionSchema.parse({ grade: " 95 ", feedback: "  Great work " })).toEqual({
      grade: 95,
      feedback: "Great work",
    });
    expect(submitAssignmentSchema.parse({}).content).toBeUndefined();
  });

  it("rejects grades outside 0-100 and invalid assignment IDs", () => {
    expect(gradeSubmissionSchema.safeParse({ grade: 101 }).success).toBe(false);
    expect(submitAssignmentParamsSchema.safeParse({ assignmentId: "-1" }).success).toBe(false);
  });
});
