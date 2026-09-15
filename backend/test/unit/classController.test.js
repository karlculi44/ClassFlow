import { beforeEach, describe, expect, it, vi } from "vitest";

const model = vi.hoisted(() => ({
  createNewClass: vi.fn(),
  findClassesByAdminId: vi.fn(),
  updateClassById: vi.fn(),
  deleteClassById: vi.fn(),
}));
const users = vi.hoisted(() => ({ findUserById: vi.fn() }));
vi.mock("../../src/models/classModel.js", () => model);
vi.mock("../../src/models/userModel.js", () => users);

import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../../src/controllers/classController.js";

const invoke = (handler, request) => new Promise((resolve, reject) => {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn((body) => resolve({ status: response.status.mock.calls.at(-1)?.[0], body })),
  };
  handler(request, response, (error) => (error ? reject(error) : resolve()));
});

const validBody = {
  code: "CS101",
  name: "Computer Science",
  schedule_days: ["Monday"],
  schedule_start_time: "09:00",
  schedule_end_time: "10:00",
  capacity: 30,
  status: "Active",
};

beforeEach(() => {
  vi.clearAllMocks();
  users.findUserById.mockResolvedValue({ id: 7 });
  model.createNewClass.mockResolvedValue({ id: 12, ...validBody });
  model.updateClassById.mockResolvedValue(1);
  model.deleteClassById.mockResolvedValue(1);
});

describe("class controller", () => {
  it("returns classes belonging to the authenticated admin", async () => {
    model.findClassesByAdminId.mockResolvedValueOnce([{ id: 12, name: "Math" }]);

    const result = await invoke(getClasses, { user: { id: 7 } });

    expect(result).toEqual({
      status: 200,
      body: {
        message: "Classes retrieved successfully!",
        classes: [{ id: 12, name: "Math" }],
      },
    });
    expect(model.findClassesByAdminId).toHaveBeenCalledWith(7);
  });

  it("creates a class with normalized schedule data", async () => {
    const result = await invoke(createClass, { user: { id: 7 }, body: validBody });

    expect(result.status).toBe(201);
    expect(model.createNewClass).toHaveBeenCalledWith({
      code: "CS101",
      adminId: 7,
      name: "Computer Science",
      schedule_days: ["Monday"],
      schedule_start_time: "09:00",
      schedule_end_time: "10:00",
      capacity: 30,
      status: "Active",
    });
  });

  it("rejects a missing admin and invalid schedule before writing", async () => {
    users.findUserById.mockResolvedValueOnce(null);
    await expect(invoke(createClass, { user: { id: 7 }, body: validBody }))
      .rejects.toMatchObject({ statusCode: 404 });
    expect(model.createNewClass).not.toHaveBeenCalled();

    users.findUserById.mockResolvedValueOnce({ id: 7 });
    await expect(invoke(updateClass, {
      user: { id: 7 },
      params: { id: 12 },
      body: { ...validBody, schedule_start_time: "11:00" },
    })).rejects.toMatchObject({ statusCode: 400 });
    expect(model.updateClassById).not.toHaveBeenCalled();
  });

  it("returns not found when an admin cannot update the class", async () => {
    model.updateClassById.mockResolvedValueOnce(0);

    await expect(invoke(updateClass, {
      user: { id: 7 },
      params: { id: 12 },
      body: validBody,
    })).rejects.toMatchObject({ statusCode: 404 });
  });

  it("deletes a class for the authenticated admin", async () => {
    const result = await invoke(deleteClass, {
      user: { id: 7 },
      params: { id: 12 },
    });

    expect(result.body).toEqual({ message: "Class deleted successfully!" });
    expect(model.deleteClassById).toHaveBeenCalledWith({ classId: 12, adminId: 7 });
  });
});
