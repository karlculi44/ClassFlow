import api from "../api/axios";

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const createAdmin = async (data) => {
  const response = await api.post("/auth/admins", data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password, confirmPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
    confirmPassword,
  });
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const googleLogin = async (credential) => {
  const response = await api.post("/auth/google-login", {
    credential,
  });

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/auth/profile", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.patch("/auth/profile/password", data);
  return response.data;
};

export const refresh = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};
