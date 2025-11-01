import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTransition } from '../hooks/usePageTransition';

const Onboarding = () => {
  const [currentTime, setCurrentTime] = useState('');
  const { isTransitioning, navigateWithTransition } = usePageTransition();

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="onboarding-app-container">
      {/* Status Bar */}
      <div className="onboarding-status-bar">
        <span className="onboarding-time">{currentTime}</span>
        <div className="onboarding-signal">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="onboarding-battery"></span>
      </div>

      <div className="onboarding-card">
        {/* Hero Section */}
        <div className="onboarding-hero-section">
          <div className="onboarding-icon-circle">
            <div className="electric-journey-icon">
              {/* Electric Vehicles and Charging Station Scene */}
              <div className="vehicle-scene">
                {/* Top Car */}
                <div className="vehicle-item top-car">
                  <div className="car-body car-purple">🚗</div>
                  <div className="charging-arrow">→</div>
                </div>
                
                {/* Charging Station */}
                <div className="charging-station">
                  <div className="station-pole">🔌</div>
                  <div className="station-bolt">⚡</div>
                </div>
                
                {/* Bottom Car */}
                <div className="vehicle-item bottom-car">
                  <div className="car-body car-blue">🚗</div>
                  <div className="charging-bolt-small">⚡</div>
                </div>
                
                {/* Electric Bike */}
                <div className="vehicle-item electric-bike">
                  <div className="bike-body">🏍️</div>
                </div>
                
                {/* Floating Dots */}
                <div className="floating-dots">
                  <span className="dot dot-1">•</span>
                  <span className="dot dot-2">•</span>
                  <span className="dot dot-3">•</span>
                  <span className="dot dot-4">•</span>
                  <span className="dot dot-5">•</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="onboarding-text-content">
          <h1 className="onboarding-app-title">Sạc Vui</h1>
          <p className="onboarding-slogan">Kết nối trạm sạc - Lái xe an tâm</p>
          <p className="onboarding-description">
            Ứng dụng tìm và so sánh giá trạm sạc xe điện thông minh
          </p>
        </div>

        {/* Actions */}
        <div className="onboarding-actions">
          <button 
            onClick={() => navigateWithTransition('/register')}
            className="onboarding-btn onboarding-btn-primary"
            disabled={isTransitioning}
          >
            {isTransitioning ? (
              <div className="btn-loading">
                <div className="loading-spinner"></div>
                <span>Đang tải...</span>
              </div>
            ) : (
              'Đăng ký'
            )}
          </button>
          <button 
            onClick={() => navigateWithTransition('/login')}
            className="onboarding-btn onboarding-btn-secondary"
            disabled={isTransitioning}
          >
            Đăng nhập
          </button>
        </div>

        {/* Footer */}
        <div className="onboarding-footer">
          <p>© 2024 Sạc Vui • v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;