import { createContext, useState, useEffect, useCallback } from "react";
import {
  login as loginUser,
  logout as logoutUser,
  getMe,
} from "../services/authServices";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data) => {
    await loginUser(data);
    const userData = await getMe();
    setUser(userData.user);
    return userData.user;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
