import api from "../api/axios";

// Student submissions
export const getStudentSubmission = async (assignmentId) => {
  const response = await api.get(`/submissions/${assignmentId}`);
  return response.data;
};

export const submitAssignment = async (assignmentId, submissionData) => {
  const response = await api.post(
    `/submissions/${assignmentId}`,
    submissionData,
  );
  return response.data;
};

export const updateSubmission = async (assignmentId, submissionData) => {
  const response = await api.put(
    `/submissions/${assignmentId}`,
    submissionData,
  );
  return response.data;
};
