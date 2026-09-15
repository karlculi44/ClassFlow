import { beforeEach, describe, expect, it, vi } from "vitest";

const pool = vi.hoisted(() => ({
  query: vi.fn(),
  getConnection: vi.fn(),
}));
vi.mock("../../src/config/db.js", () => ({ default: pool }));

import {
  createSubmission,
  getAdminAssignmentSubmissions,
} from "../../src/models/submissionModels.js";
import { consumePasswordResetToken } from "../../src/models/passwordResetModel.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("submission model", () => {
  it("does not create a submission for a student who is not enrolled", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const result = await createSubmission({
      assignmentId: 9,
      studentId: 4,
      content: "Answer",
      attachmentName: null,
      attachmentUrl: null,
    });

    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledOnce();
  });

  it("creates or updates an eligible submission and returns the saved record", async () => {
    const savedSubmission = {
      id: 3,
      assignment_id: 9,
      student_id: 4,
      content: "Updated answer",
      grade: null,
    };
    pool.query
      .mockResolvedValueOnce([[{ id: 9 }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[savedSubmission]]);

    const result = await createSubmission({
      assignmentId: 9,
      studentId: 4,
      content: "Updated answer",
      attachmentName: null,
      attachmentUrl: null,
    });

    expect(result).toEqual(savedSubmission);
    expect(pool.query).toHaveBeenCalledTimes(3);
    expect(pool.query.mock.calls[1][1]).toEqual([
      9,
      4,
      "Updated answer",
      null,
      null,
    ]);
  });

  it("maps admin submission rows into assignment and student summaries", async () => {
    pool.query.mockResolvedValueOnce([[{
      assignment_id: 9,
      title: "Quiz",
      due_date: "2026-10-01",
      class_name: "Math",
      class_code: "M101",
      student_id: 4,
      student_name: "Ada",
      student_email: "ada@example.com",
      student_code: "STU000001",
      last_seen_at: null,
      status: "Offline",
      submission_id: 3,
      content: "Answer",
      attachment_name: null,
      attachment_url: null,
      submitted_at: "2026-09-15T10:00:00Z",
      updated_at: null,
      grade: 95,
      feedback: "Excellent",
    }, {
      assignment_id: 9,
      title: "Quiz",
      due_date: "2026-10-01",
      class_name: "Math",
      class_code: "M101",
      student_id: 5,
      student_name: "Grace",
      student_email: "grace@example.com",
      student_code: "STU000002",
      last_seen_at: null,
      status: "Offline",
      submission_id: null,
      content: null,
      attachment_name: null,
      attachment_url: null,
      submitted_at: null,
      updated_at: null,
      grade: null,
      feedback: null,
    }]]);

    const result = await getAdminAssignmentSubmissions({
      adminId: 1,
      classId: 2,
      assignmentId: 9,
    });

    expect(result.assignment).toMatchObject({
      id: 9,
      title: "Quiz",
      submitted_count: 1,
      total_students: 2,
    });
    expect(result.students[0].submission).toMatchObject({
      id: 3,
      grade: 95,
      feedback: "Excellent",
    });
    expect(result.students[1].submission).toBeNull();
  });

  it("returns null when an assignment has no matching rows", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    await expect(getAdminAssignmentSubmissions({
      adminId: 1,
      classId: 2,
      assignmentId: 99,
    })).resolves.toBeNull();
  });
});

describe("password reset model", () => {
  it("rolls back and returns null for an invalid reset token", async () => {
    const connection = {
      beginTransaction: vi.fn(),
      query: vi.fn().mockResolvedValueOnce([[]]),
      rollback: vi.fn(),
      commit: vi.fn(),
      release: vi.fn(),
    };
    pool.getConnection.mockResolvedValueOnce(connection);

    await expect(consumePasswordResetToken({
      tokenHash: "missing",
      hashedPassword: "hashed",
    })).resolves.toBeNull();

    expect(connection.beginTransaction).toHaveBeenCalledOnce();
    expect(connection.rollback).toHaveBeenCalledOnce();
    expect(connection.commit).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalledOnce();
  });

  it("updates the password, marks the token used, and commits", async () => {
    const connection = {
      beginTransaction: vi.fn(),
      query: vi.fn()
        .mockResolvedValueOnce([[{ id: 8, user_id: 4 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([{ affectedRows: 1 }]),
      rollback: vi.fn(),
      commit: vi.fn(),
      release: vi.fn(),
    };
    pool.getConnection.mockResolvedValueOnce(connection);

    await expect(consumePasswordResetToken({
      tokenHash: "valid",
      hashedPassword: "new-hash",
    })).resolves.toBe(4);

    expect(connection.commit).toHaveBeenCalledOnce();
    expect(connection.rollback).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalledOnce();
    expect(connection.query).toHaveBeenCalledTimes(3);
  });
});
