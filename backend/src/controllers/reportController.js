import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  getAdminReportSummary,
  getAdminClassReport,
} from "../models/reportModel.js";

export const getReportSummary = asyncHandler(async (req, res) => {
  const report = await getAdminReportSummary(req.user.id);

  return res.status(200).json({
    message: "Report summary retrieved successfully.",
    ...report,
  });
});

export const getClassReport = asyncHandler(async (req, res) => {
  const report = await getAdminClassReport(req.user.id, req.params.classId);

  if (!report) {
    throw new AppError("Class not found in your classes.", 404);
  }

  return res.status(200).json({
    message: "Class report retrieved successfully.",
    ...report,
  });
});
