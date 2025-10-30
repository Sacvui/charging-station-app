import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateStation = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    chargerTypes: [],
    pricing: [{ chargerType: '', pricePerHour: '' }],
    amenities: [],
    operatingHours: { open: '', close: '', is24Hours: false }
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Vui lòng đăng nhập để tạo trạm sạc</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'chargerTypes') {
      const newTypes = checked 
        ? [...formData.chargerTypes, value]
        : formData.chargerTypes.filter(type => type !== value);
      setFormData({ ...formData, chargerTypes: newTypes });
    } else if (name.startsWith('operatingHours.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        operatingHours: {
          ...formData.operatingHours,
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePricingChange = (index, field, value) => {
    const newPricing = [...formData.pricing];
    newPricing[index][field] = value;
    setFormData({ ...formData, pricing: newPricing });
  };

  const addPricing = () => {
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { chargerType: '', pricePerHour: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('lat', formData.lat);
    formDataToSend.append('lng', formData.lng);
    formDataToSend.append('chargerTypes', JSON.stringify(formData.chargerTypes));
    formDataToSend.append('pricing', JSON.stringify(formData.pricing));
    formDataToSend.append('amenities', JSON.stringify(formData.amenities));
    formDataToSend.append('operatingHours', JSON.stringify(formData.operatingHours));

    for (let i = 0; i < images.length; i++) {
      formDataToSend.append('images', images[i]);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/stations`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>Tạo trạm sạc mới</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên trạm sạc:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Vĩ độ (Latitude):</label>
            <input
              type="number"
              step="any"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Kinh độ (Longitude):</label>
            <input
              type="number"
              step="any"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Loại sạc:</label>
          {['Type A', 'Type B', 'Type C', 'Fast Charge', 'Super Fast'].map(type => (
            <label key={type} style={{ display: 'block', fontWeight: 'normal' }}>
              <input
                type="checkbox"
                name="chargerTypes"
                value={type}
                checked={formData.chargerTypes.includes(type)}
                onChange={handleChange}
              />
              {type}
            </label>
          ))}
        </div>
        
        <div className="form-group">
          <label>Bảng giá:</label>
          {formData.pricing.map((price, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              <select
                value={price.chargerType}
                onChange={(e) => handlePricingChange(index, 'chargerType', e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Chọn loại sạc</option>
                {formData.chargerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Giá/giờ (VNĐ)"
                value={price.pricePerHour}
                onChange={(e) => handlePricingChange(index, 'pricePerHour', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          ))}
          <button type="button" onClick={addPricing} className="btn-secondary">
            Thêm giá
          </button>
        </div>
        
        <div className="form-group">
          <label>Hình ảnh (tối đa 5):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo trạm sạc'}
        </button>
      </form>
    </div>
  );
};

export default CreateStation;