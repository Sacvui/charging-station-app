import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage, generateId } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy user từ localStorage
    const savedUser = getFromLocalStorage('currentUser');
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Lấy danh sách users từ localStorage
      const users = getFromLocalStorage('users', []);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { 
          success: false, 
          message: 'Email hoặc mật khẩu không đúng' 
        };
      }
      
      // Lưu user hiện tại
      saveToLocalStorage('currentUser', user);
      setUser(user);
      
      return { success: true, redirect: '/' }; // Redirect to home to see nearby stations
    } catch (error) {
      return { 
        success: false, 
        message: 'Đăng nhập thất bại' 
      };
    }
  };

  const register = async (name, email, password, role) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Lấy danh sách users từ localStorage
      const users = getFromLocalStorage('users', []);
      
      // Kiểm tra email đã tồn tại
      if (users.find(u => u.email === email)) {
        return { 
          success: false, 
          message: 'Email đã được sử dụng' 
        };
      }
      
      // Tạo user mới
      const newUser = {
        id: generateId(),
        name,
        email,
        password, // Trong thực tế nên hash password
        role: role?.toUpperCase() || 'USER',
        points: 50, // Tặng 50 điểm khi đăng ký
        phone: '',
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      // Lưu vào danh sách users
      users.push(newUser);
      saveToLocalStorage('users', users);
      
      // Lưu user hiện tại
      saveToLocalStorage('currentUser', newUser);
      setUser(newUser);
      
      return { success: true, redirect: '/' }; // Redirect to home to see nearby stations
    } catch (error) {
      return { 
        success: false, 
        message: 'Đăng ký thất bại' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    // Cập nhật user hiện tại
    saveToLocalStorage('currentUser', updatedUser);
    setUser(updatedUser);
    
    // Cập nhật trong danh sách users
    const users = getFromLocalStorage('users', []);
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveToLocalStorage('users', users);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};