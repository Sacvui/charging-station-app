import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(result.redirect || '/');
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
          <h2>🔐 Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
            {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
            🎁 Đăng ký ngay để nhận 50 điểm thưởng
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;