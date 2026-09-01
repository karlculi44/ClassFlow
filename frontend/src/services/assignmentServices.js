import api from "../api/axios";

export const getAssignments = async (classId) => {
  const response = await api.get(`/assignments/${classId}`);
  return response.data;
};

export const getAssignmentDetails = async (classId, assignmentId) => {
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
