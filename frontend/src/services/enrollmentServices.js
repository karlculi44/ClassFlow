import api from "../api/axios";

export const getEnrolledStudents = async (classId) => {
  const response = await api.get(`/enrollments/${classId}`);
  return response.data;
};

export const addStudents = async (classId, studentIds) => {
  const response = await api.post(`/enrollments/${classId}/students`, {
    studentIds,
  });
  return response.data;
};
