import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p>Trang quản trị hệ thống</p>
    </div>
  );
};

export default AdminDashboard;