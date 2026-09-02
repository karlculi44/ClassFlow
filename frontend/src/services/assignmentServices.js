import api from "../api/axios";

// Student assignments
export const getAssignments = async () => {
  const response = await api.get("/assignments/student");
  return response.data;
};

export const getAssignmentDetails = async (classId, assignmentId) => {
  const response = await api.get(
    `/assignments/student/${classId}/${assignmentId}`,
  );
  return response.data;
};

// Admin assignments
export const getAdminAssignments = async (classId) => {
  const response = await api.get(`/assignments/${classId}`);
  return response.data;
};

export const getAdminAssignmentDetails = async (classId, assignmentId) => {
  const response = await api.get(`/assignments/${classId}/${assignmentId}`);
  return response.data;
};

export const createAssignment = async (classId, assignmentData) => {
  const response = await api.post(
    `/assignments/create-assignment/${classId}`,
    assignmentData,
  );
  return response.data;
};

export const updateAssignment = async (
  classId,
  assignmentId,
  assignmentData,
) => {
  const response = await api.put(
    `/assignments/${classId}/${assignmentId}`,
    assignmentData,
  );
  return response.data;
};

export const deleteAssignment = async (classId, assignmentId) => {
  const response = await api.delete(`/assignments/${classId}/${assignmentId}`);
  return response.data;
};
