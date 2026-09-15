import { beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import verifyToken from "../../src/middleware/verifyToken.js";
import authorize from "../../src/middleware/authorize.js";
import validate, { validateParams } from "../../src/middleware/validate.js";
import errorHandler from "../../src/middleware/errorHandler.js";
import asyncHandler from "../../src/utils/asyncHandler.js";
import { z } from "zod";

vi.mock("jsonwebtoken", () => ({
  default: { verify: vi.fn() },
}));

const poolQuery = vi.hoisted(() =>
  vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
);
vi.mock("../../src/config/db.js", () => ({
  default: { query: poolQuery },
}));

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

describe("validate middleware", () => {
  const schema = z.object({ count: z.coerce.number().int().positive() });

  it("replaces the request body with parsed data and continues", () => {
    const request = { body: { count: "3" } };
    const next = vi.fn();

    validate(schema)(request, createResponse(), next);

    expect(request.body).toEqual({ count: 3 });
    expect(next).toHaveBeenCalledOnce();
  });

  it("returns validation issues without continuing", () => {
    const response = createResponse();
    const next = vi.fn();

    validate(schema)({ body: { count: "0" } }, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ errors: expect.any(Array) });
    expect(next).not.toHaveBeenCalled();
  });

  it("validates and replaces route parameters", () => {
    const request = { params: { id: "7" } };
    const next = vi.fn();

    validateParams(z.object({ id: z.coerce.number().positive() }))(
      request,
      createResponse(),
      next,
    );

    expect(request.params).toEqual({ id: 7 });
    expect(next).toHaveBeenCalledOnce();
  });
});

describe("authorization middleware", () => {
  it("continues for an allowed role", () => {
    const next = vi.fn();

    authorize("Admin")({ user: { role: "Admin" } }, {}, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("throws a forbidden application error for missing or disallowed roles", () => {
    expect(() =>
      authorize("Admin")({ user: { role: "Student" } }, {}, vi.fn()),
    ).toThrow("You do not have access this resource.");
    expect(() => authorize("Admin")({}, {}, vi.fn())).toThrow(
      "You do not have access this resource.",
    );
  });
});

describe("verifyToken middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    poolQuery.mockResolvedValue([{ affectedRows: 1 }]);
  });

  it("rejects a request without an access cookie", async () => {
    const response = createResponse();

    await verifyToken({ cookies: {} }, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided.",
    });
  });

  it("rejects an invalid token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("expired");
    });
    const response = createResponse();

    await verifyToken(
      { cookies: { accessToken: "bad-token" } },
      response,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "Invalid or expired token.",
    });
  });

  it("attaches a valid user and continues even when presence update fails", async () => {
    const request = { cookies: { accessToken: "valid-token" } };
    const next = vi.fn();
    jwt.verify.mockReturnValue({ id: 4, role: "Student" });
    poolQuery.mockRejectedValueOnce(new Error("database unavailable"));

    await verifyToken(request, createResponse(), next);

    expect(request.user).toEqual({ id: 4, role: "Student" });
    expect(next).toHaveBeenCalledOnce();
  });
});

describe("asyncHandler", () => {
  it("forwards rejected promises to next", async () => {
    const error = new Error("failure");
    const next = vi.fn();
    const handler = asyncHandler(async () => {
      throw error;
    });

    handler({}, {}, next);
    await vi.waitFor(() => expect(next).toHaveBeenCalledWith(error));
  });
});

describe("errorHandler", () => {
  it("uses an application status and message", () => {
    const response = createResponse();

    errorHandler(
      { statusCode: 422, message: "Invalid data" },
      {},
      response,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({ message: "Invalid data" });
  });

  it("does not expose unexpected internal error details", () => {
    const response = createResponse();

    errorHandler(new Error("database password leaked"), {}, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
