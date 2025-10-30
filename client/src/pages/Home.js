import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Chào mừng đến với Ứng dụng Trạm Sạc Pin</h1>
      <p>Tìm kiếm và kết nối với các trạm sạc pin xe máy gần bạn</p>
      
      <div style={{ margin: '2rem 0' }}>
        <Link to="/map" className="btn-primary" style={{ margin: '0 1rem' }}>
          Xem bản đồ trạm sạc
        </Link>
        {!user && (
          <Link to="/register" className="btn-secondary" style={{ margin: '0 1rem' }}>
            Đăng ký ngay
          </Link>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
        <h2>Tính năng chính:</h2>
        <ul>
          <li>🗺️ Tìm trạm sạc gần nhất trên bản đồ</li>
          <li>⭐ Xem đánh giá và thông tin chi tiết</li>
          <li>📱 Tạo trạm sạc mới và nhận điểm thưởng</li>
          <li>💰 Xem bảng giá và khuyến mãi</li>
          <li>📸 Upload hình ảnh xác minh</li>
        </ul>

        <h2>Hệ thống điểm thưởng:</h2>
        <ul>
          <li>+100 điểm khi tạo trạm sạc mới</li>
          <li>+200 điểm khi trạm được xác minh</li>
          <li>+10 điểm khi đánh giá trạm</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;