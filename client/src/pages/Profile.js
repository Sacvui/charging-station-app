import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Vui lòng đăng nhập</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Profile của tôi</h2>
      <div className="station-card">
        <p><strong>Tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Loại tài khoản:</strong> {user.role}</p>
        <p><strong>Điểm thưởng:</strong> {user.points || 0} điểm</p>
      </div>
    </div>
  );
};

export default Profile;