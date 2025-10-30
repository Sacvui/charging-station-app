import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData.name, formData.email, formData.password, formData.role);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem', minHeight: '100vh' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Quay lại
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="form-container">
          <h2>🎯 Tham gia cộng đồng</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu mạnh"
              required
            />
          </div>
          
          <div className="form-group">
            <label>🎭 Loại tài khoản</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">🙋‍♂️ Người dùng (Tìm trạm sạc)</option>
              <option value="station_owner">🏪 Chủ trạm sạc (Kinh doanh)</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
            {loading ? '⏳ Đang tạo tài khoản...' : '🚀 Tạo tài khoản'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Đăng nhập ngay</Link>
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <p style={{ fontSize: '0.85rem', color: '#059669', margin: 0, fontWeight: '500' }}>
            🎁 Tặng ngay 50 điểm thưởng khi đăng ký thành công!
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Register;