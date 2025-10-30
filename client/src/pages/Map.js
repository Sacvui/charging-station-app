import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { getStationsNearby } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix cho marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState([10.7769, 106.7009]); // Default: TP.HCM
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy vị trí hiện tại của user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearbyStations(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          fetchNearbyStations(10.7769, 106.7009); // Fallback location: TP.HCM
        }
      );
    } else {
      fetchNearbyStations(10.7769, 106.7009);
    }
  }, []);

  const fetchNearbyStations = async (lat, lng) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const nearbyStations = getStationsNearby(lat, lng, 10000);
      setStations(nearbyStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  if (loading) {
    return <div className="loading">Đang tải bản đồ...</div>;
  }

  return (
    <div className="map-container">
      <h2>🗺️ Tìm trạm sạc gần bạn</h2>
      
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.1rem' }}>
          Tìm thấy <strong>{stations.length}</strong> trạm sạc gần bạn
        </p>
      </div>

      <MapContainer 
        center={userLocation} 
        zoom={13} 
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marker vị trí user */}
        <Marker position={userLocation}>
          <Popup>
            <div className="station-popup">
              <h3>📍 Vị trí của bạn</h3>
              <p>Bạn đang ở đây</p>
            </div>
          </Popup>
        </Marker>

        {/* Markers cho các trạm sạc */}
        {stations.map((station) => (
          <Marker 
            key={station.id} 
            position={[station.latitude, station.longitude]}
          >
            <Popup>
              <div className="station-popup">
                <h3>⚡ {station.name}</h3>
                <p><strong>📍 Địa chỉ:</strong> {station.address}</p>
                <p><strong>⭐ Đánh giá:</strong> {getRatingStars(station.rating)} ({station.totalRatings} đánh giá)</p>
                <p><strong>🔌 Loại sạc:</strong> {station.chargerTypes.join(', ')}</p>
                
                {station.pricing.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>💰 Bảng giá:</strong>
                    {station.pricing.map((price, index) => (
                      <div key={index} style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>
                        • {price.chargerType}: {formatPrice(price.pricePerHour)}đ/giờ
                      </div>
                    ))}
                  </div>
                )}

                {station.promotions.length > 0 && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                    <strong>🎁 Khuyến mãi:</strong>
                    <div style={{ fontSize: '0.9rem' }}>
                      {station.promotions[0].title} - Giảm {station.promotions[0].discount}%
                    </div>
                  </div>
                )}

                <Link 
                  to={`/station/${station.id}`}
                  className="btn-primary"
                  style={{ marginTop: '0.75rem', display: 'block', textAlign: 'center' }}
                >
                  👀 Xem chi tiết
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Danh sách trạm sạc */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '1.5rem' }}>
          📋 Danh sách trạm sạc gần bạn
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stations.map((station) => (
            <div key={station.id} className="station-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3>⚡ {station.name}</h3>
                  <p style={{ color: '#6b7280', margin: '0.5rem 0' }}>📍 {station.address}</p>
                </div>
                {station.isVerified && (
                  <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                    ✅ Đã xác minh
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p><strong>⭐ Đánh giá:</strong> <span className="rating">{getRatingStars(station.rating)}</span> ({station.totalRatings})</p>
                  <p><strong>🔌 Loại sạc:</strong> {station.chargerTypes.join(', ')}</p>
                </div>
                <div>
                  <p><strong>🕒 Giờ hoạt động:</strong> {station.operatingHours.is24Hours ? '24/7' : `${station.operatingHours.open} - ${station.operatingHours.close}`}</p>
                  <p><strong>🎯 Tiện ích:</strong> {station.amenities.join(', ')}</p>
                </div>
              </div>

              {station.promotions.length > 0 && (
                <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <p style={{ margin: 0, color: '#059669', fontWeight: '600' }}>
                    🎁 {station.promotions[0].title} - Giảm {station.promotions[0].discount}%
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#6b7280' }}>
                    {station.promotions[0].description}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>💰 Từ {formatPrice(Math.min(...station.pricing.map(p => p.pricePerHour)))}đ/giờ</strong>
                </div>
                <Link to={`/station/${station.id}`} className="btn-primary">
                  👀 Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;