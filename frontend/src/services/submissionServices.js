import api from "../api/axios";

export const submitAssignment = async (assignmentId, submissionData) => {
  const response = await api.post(
    `/submissions/${assignmentId}`,
    submissionData,
  );
  return response.data;
};
