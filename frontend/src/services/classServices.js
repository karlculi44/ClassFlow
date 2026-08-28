import api from "../api/axios";

export const getClasses = async () => {
  const response = await api.get("/classes");
  return response.data;
};

export const createClass = async (data) => {
  const response = await api.post("/classes/create-class", data);
  return response.data;
};
