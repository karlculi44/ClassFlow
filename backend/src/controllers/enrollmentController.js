import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  addStudentsToClass,
  addStudentToClass,
  findStudentsByClassId,
  findClassesByStudentId,
} from "../models/enrollmentModel.js";

export const addStudents = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { studentIds } = req.body;

  if (
    !classId ||
    !Array.isArray(studentIds) ||
    studentIds.length === 0 ||
    studentIds.some((studentId) => !studentId)
  ) {
    throw new AppError(
      "Class ID and at least one student ID are required",
      400,
    );
  }

  const addedStudents = await addStudentsToClass(classId, [
    ...new Set(studentIds),
  ]);

  return res.status(201).json({
    message: "Students added successfully",
    addedStudents,
  });
});

export const getEnrolledStudents = asyncHandler(async (req, res) => {
  const students = await findStudentsByClassId(req.params.classId);

  return res.status(200).json({
    message: "Enrolled students retrieved successfully",
    students,
  });
});

export const getStudentClasses = asyncHandler(async (req, res) => {
  const classes = await findClassesByStudentId(req.user.id);

  return res.status(200).json({
    message: "Student classes retrieved successfully",
    classes,
  });
});

export const addStudent = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;
  const { studentId } = req.body;

  if (!classId || !studentId) {
    throw new AppError("Class ID and Student ID are required", 400);
  }

  const addedStudent = await addStudentToClass(classId, studentId);

  if (!addedStudent) {
    throw new AppError("Failed to add student to class", 500);
  }

  res.status(201).json({ message: "Student added successfully" });
});
