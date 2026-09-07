import { z } from "zod";

const positiveId = z.coerce.number().int().positive().safe();
const numericGrade = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      return trimmedValue ? trimmedValue : undefined;
    }

    return typeof value === "number" ? value : undefined;
  },
  z.coerce
    .number()
    .finite("Grade must be a valid number")
    .min(0, "Grade must be a number between 0 and 100.")
    .max(100, "Grade must be a number between 0 and 100."),
);

export const gradeSubmissionSchema = z
  .object({
    grade: numericGrade,
    feedback: z
      .string()
      .trim()
      .max(5000, "Feedback must be 5000 characters or fewer")
      .optional()
      .default(""),
  })
  .strict();

export const gradeSubmissionParamsSchema = z
  .object({
    classId: positiveId,
    assignmentId: positiveId,
    studentId: positiveId,
  })
  .strict();

export const submitAssignmentSchema = z
  .object({
    content: z
      .string()
      .trim()
      .max(20000, "Submission content must be 20000 characters or fewer")
      .optional(),
  })
  .strict();

export const submitAssignmentParamsSchema = z
  .object({
    assignmentId: positiveId,
  })
  .strict();
