import api from "../api/axios";

export const getReportSummary = async () => {
  const response = await api.get("/reports");
  return response.data;
};

export const getClassReport = async (classId) => {
  const response = await api.get(`/reports/${classId}`);
  return response.data;
};
