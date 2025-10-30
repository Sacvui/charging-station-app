import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
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
  const [userLocation, setUserLocation] = useState([10.8231, 106.6297]); // Default: TP.HCM
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
          fetchNearbyStations(10.8231, 106.6297); // Fallback location
        }
      );
    } else {
      fetchNearbyStations(10.8231, 106.6297);
    }
  }, []);

  const fetchNearbyStations = async (lat, lng) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/stations/nearby?lat=${lat}&lng=${lng}&radius=10000`);
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return <div className="loading">Đang tải bản đồ...</div>;
  }

  return (
    <div className="map-container">
      <h2>Tìm trạm sạc gần bạn</h2>
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
          <Popup>Vị trí của bạn</Popup>
        </Marker>

        {/* Markers cho các trạm sạc */}
        {stations.map((station) => (
          <Marker 
            key={station._id} 
            position={[station.location.coordinates[1], station.location.coordinates[0]]}
          >
            <Popup>
              <div className="station-popup">
                <h3>{station.name}</h3>
                <p><strong>Địa chỉ:</strong> {station.address}</p>
                <p><strong>Đánh giá:</strong> {getRatingStars(station.rating)} ({station.totalRatings} đánh giá)</p>
                <p><strong>Loại sạc:</strong> {station.chargerTypes.join(', ')}</p>
                {station.pricing.length > 0 && (
                  <div>
                    <strong>Bảng giá:</strong>
                    {station.pricing.map((price, index) => (
                      <div key={index}>
                        {price.chargerType}: {price.pricePerHour}đ/giờ
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => window.location.href = `/station/${station._id}`}
                  className="btn-primary"
                >
                  Xem chi tiết
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;