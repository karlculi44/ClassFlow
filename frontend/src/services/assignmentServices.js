import api from "../api/axios";

export const getAssignments = async (classId) => {
  const response = await api.get(`/assignments/${classId}`);
  return response.data;
};
export const createAssignment = async (classId, assignmentData) => {
  const response = await api.post(
    `/assignments/create-assignment/${classId}`,
    assignmentData,
  );
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await api.put(
    `/assignments/update-assignment/${id}`,
    assignmentData,
  );
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/delete-assignment/${id}`);
  return response.data;
};
