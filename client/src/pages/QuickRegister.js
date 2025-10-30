import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { generateId } from '../utils/mockData'; // Not used in this component

const QuickRegister = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Info
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    name: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [otpSent, setOtpSent] = useState(false); // Not used currently
  const [countdown, setCountdown] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Format phone number
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return cleaned.slice(0, 10).replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const sendOTP = async () => {
    const cleanPhone = formData.phone.replace(/\s/g, '');
    
    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('0')) {
      setError('Số điện thoại không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    
    // In thực tế sẽ gọi API gửi SMS
    console.log(`SMS OTP sent to ${cleanPhone}: ${otp}`);
    
    // setOtpSent(true); // Not used currently
    setStep(2);
    setLoading(false);
    
    // Start countdown
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show OTP in alert for demo (remove in production)
    setTimeout(() => {
      alert(`Demo: Mã OTP của bạn là ${otp}`);
    }, 500);
  };

  const verifyOTP = async () => {
    if (formData.otp !== generatedOtp) {
      setError('Mã OTP không đúng');
      return;
    }

    setError('');
    setStep(3);
  };

  const completeRegistration = async () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }

    setLoading(true);
    setError('');

    const cleanPhone = formData.phone.replace(/\s/g, '');
    const email = `${cleanPhone}@chargefinder.app`; // Auto-generate email
    
    const result = await register(
      formData.name,
      email,
      cleanPhone, // Use phone as password for quick register
      formData.role
    );

    if (result.success) {
      navigate(result.redirect || '/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const resendOTP = () => {
    if (countdown > 0) return;
    sendOTP();
  };

  return (
    <div className="quick-register-container">
      {/* Back Button */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 20 }}>
        <button 
          onClick={() => navigate(-1)}
          className="back-button-floating"
        >
          ← Quay lại
        </button>
      </div>
      
      <div className="quick-register-card">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">📱</div>
            <span>Số điện thoại</span>
          </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">🔐</div>
            <span>Xác thực</span>
          </div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">👤</div>
            <span>Thông tin</span>
          </div>
        </div>

        {/* Step 1: Phone Number */}
        {step === 1 && (
          <div className="register-step">
            <div className="step-header">
              <h2>📱 Đăng ký nhanh</h2>
              <p>Nhập số điện thoại để bắt đầu</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Số điện thoại</label>
              <div className="phone-input">
                <span className="country-code">🇻🇳 +84</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="0901 234 567"
                  maxLength={12}
                  className="phone-field"
                />
              </div>
            </div>

            <button 
              onClick={sendOTP}
              disabled={loading || formData.phone.replace(/\s/g, '').length !== 10}
              className="btn-primary-ios"
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Đang gửi...
                </>
              ) : (
                'Gửi mã xác thực'
              )}
            </button>

            <div className="alternative-login">
              <p>Hoặc</p>
              <button 
                onClick={() => navigate('/login')}
                className="btn-secondary-ios"
              >
                Đăng nhập bằng email
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="register-step">
            <div className="step-header">
              <h2>🔐 Xác thực OTP</h2>
              <p>Nhập mã 6 số đã gửi đến {formData.phone}</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Mã xác thực</label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                placeholder="123456"
                className="otp-input"
                maxLength={6}
              />
            </div>

            <button 
              onClick={verifyOTP}
              disabled={formData.otp.length !== 6}
              className="btn-primary-ios"
            >
              Xác thực
            </button>

            <div className="resend-section">
              {countdown > 0 ? (
                <p className="countdown">Gửi lại sau {countdown}s</p>
              ) : (
                <button onClick={resendOTP} className="resend-btn">
                  Gửi lại mã
                </button>
              )}
            </div>

            <button 
              onClick={() => setStep(1)}
              className="back-btn"
            >
              ← Thay đổi số điện thoại
            </button>
          </div>
        )}

        {/* Step 3: User Info */}
        {step === 3 && (
          <div className="register-step">
            <div className="step-header">
              <h2>👤 Hoàn tất đăng ký</h2>
              <p>Một vài thông tin cuối cùng</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="name-input"
              />
            </div>

            <div className="form-group">
              <label>Loại tài khoản</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'USER' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'USER' })}
                >
                  <div className="role-icon">🙋‍♂️</div>
                  <div className="role-info">
                    <strong>Người dùng</strong>
                    <span>Tìm kiếm trạm sạc</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'STATION_OWNER' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'STATION_OWNER' })}
                >
                  <div className="role-icon">🏪</div>
                  <div className="role-info">
                    <strong>Chủ trạm sạc</strong>
                    <span>Quản lý kinh doanh</span>
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={completeRegistration}
              disabled={loading || !formData.name.trim()}
              className="btn-primary-ios"
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Đang tạo tài khoản...
                </>
              ) : (
                '🎉 Hoàn tất đăng ký'
              )}
            </button>

            <div className="welcome-bonus">
              <div className="bonus-card">
                <div className="bonus-icon">🎁</div>
                <div className="bonus-text">
                  <strong>Chào mừng!</strong>
                  <span>Nhận ngay 50 điểm thưởng</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Animation */}
      <div className="bg-animation">
        <div className="floating-element" style={{ animationDelay: '0s' }}>⚡</div>
        <div className="floating-element" style={{ animationDelay: '2s' }}>🔋</div>
        <div className="floating-element" style={{ animationDelay: '4s' }}>📱</div>
        <div className="floating-element" style={{ animationDelay: '6s' }}>🚗</div>
      </div>
    </div>
  );
};

export default QuickRegister;