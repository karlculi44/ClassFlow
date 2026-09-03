import api from "../api/axios";

//Student Endpoints
export const getStudentEnrollments = async () => {
  const response = await api.get("/enrollments/student");
  return response.data;
};

//Admin Enpoints
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
