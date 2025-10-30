import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      // Có thể gọi API để lấy thông tin user
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/auth/register`, { name, email, password, role });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};