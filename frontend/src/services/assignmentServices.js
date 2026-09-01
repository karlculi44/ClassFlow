import api from "../api/axios";

export const getAssignments = async (classId) => {
  const response = await api.get(`/assignments/${classId}`);
  return response.data;
};
export const createAssignment = async (assignmentData) => {
  const response = await api.post("/create-assignment", assignmentData);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await api.put(`/update-assignment/${id}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/delete-assignment/${id}`);
  return response.data;
};
