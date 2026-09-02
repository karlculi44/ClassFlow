import api from "../api/axios";

export const getAdminSubmissions = async (classId, assignmentId) => {
  const response = await api.get(
    `/submissions/admin/${classId}/${assignmentId}`,
  );
  return response.data;
};

export const getAdminStudentSubmission = async (
  classId,
  assignmentId,
  studentId,
) => {
  const response = await api.get(
    `/submissions/admin/${classId}/${assignmentId}/${studentId}`,
  );
  return response.data;
};

export const gradeSubmission = async (
  classId,
  assignmentId,
  studentId,
  gradeData,
) => {
  const response = await api.put(
    `/submissions/admin/${classId}/${assignmentId}/${studentId}`,
    gradeData,
  );
  return response.data;
};

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
