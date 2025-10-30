import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStationsNearby } from '../utils/mockData';

const Home = () => {
  const { user } = useAuth();
  const [nearbyStations, setNearbyStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState('all'); // all, car, motorbike

  useEffect(() => {
    if (user) {
      getCurrentLocationAndStations();
    } else {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when vehicle filter changes
  useEffect(() => {
    if (user && userLocation) {
      fetchNearbyStations(userLocation.lat, userLocation.lng);
    }
  }, [vehicleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCurrentLocationAndStations = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyStations(latitude, longitude);
          setLocationError(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(true);
          // Fallback to TP.HCM center
          setUserLocation({ lat: 10.7769, lng: 106.7009 });
          fetchNearbyStations(10.7769, 106.7009);
        }
      );
    } else {
      setLocationError(true);
      setUserLocation({ lat: 10.7769, lng: 106.7009 });
      fetchNearbyStations(10.7769, 106.7009);
    }
  };

  const fetchNearbyStations = async (lat, lng) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let stations = getStationsNearby(lat, lng, 50000); // 50km radius
    
    // Filter by vehicle type
    if (vehicleFilter !== 'all') {
      stations = stations.filter(station => 
        station.supportedVehicles && station.supportedVehicles.includes(vehicleFilter)
      );
    }
    
    console.log(`Searching from ${lat}, ${lng} - Found ${stations.length} stations (filter: ${vehicleFilter})`);
    setNearbyStations(stations.slice(0, 5)); // Top 5 closest
    setLoading(false);
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceText = (station) => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng, 
      station.latitude, station.longitude
    );
    
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const openDirections = (station) => {
    console.log('Opening directions to:', station.name);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Guest user view
  if (!user) {
    return (
      <div className="home-guest">
        <div className="guest-hero">
          <div className="hero-icon">⚡</div>
          <h1>ChargeFinder</h1>
          <p>Tìm trạm sạc pin xe máy gần bạn nhất</p>
          
          <div className="guest-actions">
            <Link to="/quick-register" className="btn-primary-ios">
              📱 Đăng ký nhanh bằng SĐT
            </Link>
            <Link to="/login" className="btn-secondary-ios">
              🔐 Đăng nhập
            </Link>
          </div>
        </div>

        <div className="guest-features">
          <div className="feature-item">
            <div className="feature-icon">📍</div>
            <div className="feature-text">
              <strong>Tìm trạm gần nhất</strong>
              <span>GPS định vị chính xác</span>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🧭</div>
            <div className="feature-text">
              <strong>Chỉ đường tức thì</strong>
              <span>Kết nối Google Maps</span>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <div className="feature-text">
              <strong>So sánh giá cả</strong>
              <span>Minh bạch, cập nhật</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in user view
  return (
    <div className="home-logged-in">
      {/* Header */}
      <div className="home-header">
        <div className="user-greeting">
          <h1>Xin chào, {user.name}! 👋</h1>
          <p>
            {locationError ? 
              '📍 Sử dụng vị trí mặc định TP.HCM' : 
              '📍 Đã xác định vị trí của bạn'
            }
          </p>
        </div>
        
        <div className="user-points">
          <div className="points-badge">
            <span className="points-icon">⭐</span>
            <span className="points-value">{user.points || 0}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-home">
        <Link to="/map" className="action-card">
          <div className="action-icon">🗺️</div>
          <div className="action-text">
            <strong>Xem bản đồ</strong>
            <span>Khám phá khu vực</span>
          </div>
          <div className="action-arrow">→</div>
        </Link>
      </div>

      {/* Nearby Stations */}
      <div className="nearby-section">
        <div className="section-header">
          <h2>⚡ Trạm sạc gần nhất</h2>
          <Link to="/nearby" className="see-all-btn">Xem tất cả</Link>
        </div>

        {/* Quick Links to Nearby with Filter */}
        <div className="quick-filter-links">
          <Link to="/nearby?filter=all" className="quick-link">
            📍 Tất cả trạm gần
          </Link>
          <Link to="/nearby?filter=car" className="quick-link car">
            🚗 Trạm sạc ô tô
          </Link>
          <Link to="/nearby?filter=motorbike" className="quick-link motorbike">
            🏍️ Trạm sạc xe máy
          </Link>
        </div>

        {loading ? (
          <div className="loading-stations">
            <div className="loading-spinner"></div>
            <p>Đang tìm trạm sạc gần bạn...</p>
          </div>
        ) : nearbyStations.length > 0 ? (
          <div className="stations-grid">
            {nearbyStations.map((station, index) => (
              <div key={station.id} className="station-card-compact" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="station-main-info">
                  <div className="station-header-compact">
                    <h3>{station.name}</h3>
                    <div className="station-badges">
                      <span className="distance-badge">{getDistanceText(station)}</span>
                      {station.isVerified && <span className="verified-badge">✅</span>}
                    </div>
                  </div>
                  
                  <div className="station-details-compact">
                    <div className="detail-item">
                      <span className="rating">{getRatingStars(station.rating)}</span>
                      <span className="rating-text">{station.rating}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="price-from">Từ {formatPrice(Math.min(...station.pricing.map(p => p.pricePerHour)))}đ/h</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="vehicle-support">
                        {station.supportedVehicles?.includes('car') && '🚗'}
                        {station.supportedVehicles?.includes('motorbike') && '🏍️'}
                        {!station.supportedVehicles && '🚗🏍️'}
                      </span>
                      <span className="charger-count">{station.chargerTypes.length} loại sạc</span>
                    </div>
                  </div>

                  {station.promotions.length > 0 && (
                    <div className="promotion-tag">
                      🎁 Giảm {station.promotions[0].discount}%
                    </div>
                  )}
                </div>

                <div className="station-actions-compact">
                  <button 
                    onClick={() => openDirections(station)}
                    className="directions-btn"
                  >
                    🧭 Chỉ đường
                  </button>
                  
                  <Link 
                    to={`/station/${station.id}`}
                    className="details-btn"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-stations">
            <div className="no-stations-icon">📍</div>
            <h3>Không tìm thấy trạm sạc gần</h3>
            <p>Thử mở rộng bán kính tìm kiếm hoặc thêm trạm mới</p>
            <Link to="/create-station" className="btn-primary-ios">
              ➕ Thêm trạm sạc
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <Link to="/create-station" className="bottom-action-btn primary">
          <span className="action-icon">➕</span>
          <span>Thêm trạm sạc</span>
        </Link>
        
        <Link to="/profile" className="bottom-action-btn secondary">
          <span className="action-icon">👤</span>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;