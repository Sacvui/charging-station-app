import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/mockData';

const CreateStation = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    province: '',
    district: '',
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
  const [gettingLocation, setGettingLocation] = useState(false);

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Danh sách tỉnh thành Việt Nam
  const provinces = [
    { code: 'HCM', name: 'TP. Hồ Chí Minh', districts: ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Tân Bình', 'Phú Nhuận', 'Gò Vấp', 'Thủ Đức', 'Bình Tân'] },
    { code: 'HN', name: 'Hà Nội', districts: ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân', 'Nam Từ Liêm', 'Bắc Từ Liêm'] },
    { code: 'DN', name: 'Đà Nẵng', districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'] },
    { code: 'CT', name: 'Cần Thơ', districts: ['Ninh Kiều', 'Ô Môn', 'Bình Thuỷ', 'Cái Răng', 'Thốt Nốt'] },
    { code: 'HP', name: 'Hải Phòng', districts: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn'] },
    { code: 'BD', name: 'Bình Dương', districts: ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Tân Uyên', 'Bến Cát'] },
    { code: 'DNA', name: 'Đồng Nai', districts: ['Biên Hòa', 'Long Khánh', 'Nhơn Trạch', 'Vĩnh Cửu', 'Trảng Bom'] },
    { code: 'KH', name: 'Khánh Hòa', districts: ['Nha Trang', 'Cam Ranh', 'Ninh Hòa', 'Vạn Ninh'] },
    { code: 'QN', name: 'Quảng Nam', districts: ['Hội An', 'Tam Kỳ', 'Điện Bàn', 'Duy Xuyên'] },
    { code: 'VT', name: 'Vũng Tàu', districts: ['Vũng Tàu', 'Bà Rịa', 'Châu Đức', 'Xuyên Mộc'] }
  ];

  const getCurrentDistricts = () => {
    const selectedProvince = provinces.find(p => p.code === formData.province);
    return selectedProvince ? selectedProvince.districts : [];
  };

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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      if (formData.chargerTypes.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một loại sạc');
      }

      // Tạo station mới
      const newStation = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.lat),
        longitude: parseFloat(formData.lng),
        rating: 0,
        totalRatings: 0,
        chargerTypes: formData.chargerTypes,
        pricing: formData.pricing.filter(p => p.chargerType && p.pricePerHour),
        amenities: formData.amenities,
        images: images.map(img => img.name), // Chỉ lưu tên file
        isVerified: false,
        status: 'ACTIVE',
        operatingHours: formData.operatingHours,
        promotions: [],
        owner: {
          name: user.name,
          phone: user.phone || 'Chưa cập nhật'
        },
        ownerId: user.id,
        createdAt: new Date().toISOString()
      };

      // Lưu vào localStorage
      const stations = getFromLocalStorage('userStations', []);
      stations.push(newStation);
      saveToLocalStorage('userStations', stations);

      // Thưởng điểm cho user
      const updatedUser = { ...user, points: (user.points || 0) + 100 };
      updateUser(updatedUser);

      alert('🎉 Tạo trạm sạc thành công! Bạn được thưởng 100 điểm. Trạm sạc sẽ được xem xét để xác minh.');
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
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
      
      <div className="form-container" style={{ maxWidth: '700px' }}>
        <h2>⚡ Thêm trạm sạc mới</h2>
        {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>⚡ Tên trạm sạc</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="VD: Trạm sạc Vincom Quận 1"
            required
          />
        </div>
        
        <div className="form-group">
          <label>🏙️ Tỉnh/Thành phố</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map(province => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {formData.province && (
          <div className="form-group">
            <label>🏘️ Quận/Huyện</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">Chọn quận/huyện</option>
              {getCurrentDistricts().map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>📍 Địa chỉ cụ thể</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="VD: 123 Nguyễn Huệ"
            required
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>🌍 Vĩ độ (Latitude)</label>
            <input
              type="number"
              step="any"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="VD: 10.7769"
              required
            />
          </div>
          
          <div className="form-group">
            <label>🌍 Kinh độ (Longitude)</label>
            <input
              type="number"
              step="any"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              placeholder="VD: 106.7009"
              required
            />
          </div>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px', marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
            💡 <strong>Mẹo:</strong> Bạn có thể tìm tọa độ chính xác bằng cách search địa chỉ trên Google Maps, 
            click chuột phải và chọn tọa độ hiển thị.
          </p>
        </div>
        
        <div className="form-group">
          <label>🔌 Loại sạc có sẵn</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {['Type A', 'Type B', 'Type C', 'Fast Charge', 'Super Fast'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', padding: '0.75rem', background: formData.chargerTypes.includes(type) ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.5)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <input
                  type="checkbox"
                  name="chargerTypes"
                  value={type}
                  checked={formData.chargerTypes.includes(type)}
                  onChange={handleChange}
                  style={{ margin: 0 }}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
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
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? '⏳ Đang tạo trạm sạc...' : '🚀 Tạo trạm sạc (+100 điểm)'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <p style={{ fontSize: '0.9rem', color: '#059669', margin: 0, fontWeight: '500' }}>
            🎁 Tạo trạm sạc thành công sẽ được thưởng 100 điểm!<br/>
            ✅ Sau khi được admin xác minh sẽ thưởng thêm 200 điểm nữa!
          </p>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateStation;