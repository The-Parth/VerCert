import React, { useState, useEffect } from 'react';
import API from './api';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const loginWithPasskey = async (email, assertion) => {
    // Just handle the Verification of the assertion
    try {
      const res = await API.post('/webauth/verify-login', {
        username: email,
        assertion,
      });
      // console.log(res.data);
      if (res.data.success) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const register = async (fullName, email, password, role) => {
    try {
      const res = await API.post('/auth/register', {
        fullName,
        email,
        password,
        role,
      });
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };
  const logout = async () => {
    await API.get('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginWithPasskey, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
