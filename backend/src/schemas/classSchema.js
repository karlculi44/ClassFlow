import { z } from "zod";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createClassSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Class code is required")
      .max(50, "Class code must be 50 characters or fewer"),
    name: z
      .string()
      .trim()
      .min(1, "Class name is required")
      .max(100, "Class name must be 100 characters or fewer"),
    schedule_days: z
      .array(z.enum(weekdays))
      .min(1, "Select at least one day for the class schedule.")
      .max(7, "A class schedule cannot contain more than seven days.")
      .transform((days) => [...new Set(days)]),
    schedule_start_time: z
      .string()
      .trim()
      .regex(timePattern, "Start time must use HH:MM format"),
    schedule_end_time: z
      .string()
      .trim()
      .regex(timePattern, "End time must use HH:MM format"),
    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .positive("Capacity must be greater than zero")
      .max(100000, "Capacity must be 100000 or fewer"),
    status: z.enum(["Active", "Inactive"]),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.schedule_start_time >= value.schedule_end_time) {
      context.addIssue({
        code: "custom",
        path: ["schedule_end_time"],
        message: "Schedule start time must be earlier than end time.",
      });
    }
  });
