import { z } from "zod";

const isValidDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const createAssignmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or fewer"),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(10000, "Description must be 10000 characters or fewer"),
    dueDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must use YYYY-MM-DD format")
      .refine(isValidDate, "Due date must be a valid calendar date"),
  })
  .strict();

export const createAssignmentParamsSchema = z
  .object({
    classId: z.coerce.number().int().positive().safe(),
  })
  .strict();
