import React, { useState, useEffect } from "react";
import API from "./api";
import { AuthContext } from "./AuthContext"; // ✅ Import only the context

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post("/login", { email, password });
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const res = await API.post("/register", { fullName, email, password });
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const logout = async () => {
    await API.get("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
