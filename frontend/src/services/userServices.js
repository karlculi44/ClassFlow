import api from "../api/axios";

export const getStudents = async () => {
  const response = await api.get("/auth/students");
  return response.data;
};
