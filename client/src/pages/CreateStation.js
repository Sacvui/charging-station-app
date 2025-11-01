import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/mockData';
import provincesData from '../data/provinces.json';
import chargerTypesData from '../data/chargerTypes.json';
import '../charger-styles.css';

const CreateStation = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    contactPhone: '',
    lat: null,
    lng: null,
    chargerTypes: [], // Will store {id, price} objects
    amenities: [],
    operatingHours: { open: '', close: '', is24Hours: false }
  });
  const [overallImages, setOverallImages] = useState([]); // Hình tổng thể
  const [chargerImages, setChargerImages] = useState([]); // Hình trụ sạc
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [addressSuggestion, setAddressSuggestion] = useState('');
  const [geocodingStatus, setGeocodingStatus] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const provinces = useMemo(() => provincesData?.provinces || [], []);
  const chargerTypes = useMemo(() => chargerTypesData?.chargerTypes || [], []);

  useEffect(() => {
    // Ensure data is loaded
    if (provinces.length > 0 && chargerTypes.length > 0) {
      setDataLoaded(true);
    }
  }, [provinces.length, chargerTypes.length]);

  const getCurrentDistricts = () => {
    const selectedProvince = provinces.find(p => p.code === formData.province);
    return selectedProvince ? selectedProvince.districts : [];
  };

  const getCurrentWards = () => {
    const selectedProvince = provinces.find(p => p.code === formData.province);
    if (!selectedProvince) return [];
    const selectedDistrict = selectedProvince.districts.find(d => d.code === formData.district);
    return selectedDistrict?.wards || [];
  };

  // Ước tính tỉnh dựa trên tọa độ (offline fallback)
  const estimateProvinceFromCoords = (lat, lng) => {
    // Các vùng chính của Việt Nam
    if (lat >= 21.0 && lat <= 23.5 && lng >= 105.0 && lng <= 106.5) return 'HN'; // Hà Nội
    if (lat >= 10.5 && lat <= 11.0 && lng >= 106.0 && lng <= 107.0) return 'HCM'; // TP.HCM
    if (lat >= 15.8 && lat <= 16.3 && lng >= 107.8 && lng <= 108.5) return 'DN'; // Đà Nẵng
    if (lat >= 20.7 && lat <= 21.2 && lng >= 106.0 && lng <= 106.8) return 'HP'; // Hải Phòng
    if (lat >= 10.0 && lat <= 10.5 && lng >= 105.5 && lng <= 106.5) return 'CT'; // Cần Thơ
    
    // Miền Bắc
    if (lat >= 20.0) return 'HN';
    // Miền Trung
    if (lat >= 14.0 && lat < 20.0) return 'DN';
    // Miền Nam
    return 'HCM';
  };

  // Reverse geocoding để đoán tỉnh/huyện từ tọa độ với retry logic
  const reverseGeocode = useCallback(async (lat, lng, retryCount = 0) => {
    // Tránh gọi trùng lặp
    if (isGeocoding) {
      console.log('🔄 Đang geocoding, bỏ qua request trùng lặp');
      return;
    }
    
    let controller = null;
    let timeoutId = null;
    
    try {
      setIsGeocoding(true);
      console.log('🔍 Đang reverse geocoding cho tọa độ:', lat, lng);
      setGeocodingStatus(retryCount > 0 ? `Đang thử lại... (${retryCount + 1}/3)` : 'Đang tìm địa chỉ...');
      
      // Tạo AbortController mới cho mỗi request
      controller = new AbortController();
      
      // Timeout sau 8 giây (tăng thời gian chờ)
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          controller.abort();
        }
      }, 8000);
      
      // Sử dụng Nominatim API (OpenStreetMap) - miễn phí với CORS headers
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=vi`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'SacVui/1.0'
          },
          signal: controller.signal
        }
      );
      
      // Clear timeout nếu request thành công
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📍 Dữ liệu từ Nominatim API:', data);
      
      if (data && data.address) {
        const address = data.address;
        const fullAddress = data.display_name;
        setAddressSuggestion(fullAddress);
        setGeocodingStatus('');
        
        console.log('🏠 Address object:', address);
        
        // Mapping các tên thành phố với code - mở rộng hơn
        const cityMapping = {
          // Hồ Chí Minh
          'hồ chí minh': 'HCM',
          'ho chi minh': 'HCM',
          'sài gòn': 'HCM',
          'saigon': 'HCM',
          'thành phố hồ chí minh': 'HCM',
          'tp hồ chí minh': 'HCM',
          'tp. hồ chí minh': 'HCM',
          
          // Hà Nội
          'hà nội': 'HN',
          'ha noi': 'HN',
          'hanoi': 'HN',
          'thành phố hà nội': 'HN',
          'tp hà nội': 'HN',
          'tp. hà nội': 'HN',
          
          // Đà Nẵng
          'đà nẵng': 'DN',
          'da nang': 'DN',
          'danang': 'DN',
          'thành phố đà nẵng': 'DN',
          'tp đà nẵng': 'DN',
          'tp. đà nẵng': 'DN',
          
          // Cần Thơ
          'cần thơ': 'CT',
          'can tho': 'CT',
          'cantho': 'CT',
          'thành phố cần thơ': 'CT',
          'tp cần thơ': 'CT',
          'tp. cần thơ': 'CT',
          
          // Hải Phòng
          'hải phòng': 'HP',
          'hai phong': 'HP',
          'haiphong': 'HP',
          'thành phố hải phòng': 'HP',
          'tp hải phòng': 'HP',
          'tp. hải phòng': 'HP',
          
          // Bình Dương
          'bình dương': 'BD',
          'binh duong': 'BD',
          'tỉnh bình dương': 'BD',
          
          // Đồng Nai
          'đồng nai': 'DN2',
          'dong nai': 'DN2',
          'tỉnh đồng nai': 'DN2',
          
          // Long An
          'long an': 'LA',
          'tỉnh long an': 'LA'
        };
        
        // Lấy thông tin địa chỉ từ nhiều trường
        const addressFields = [
          address.city, 
          address.province, 
          address.state,
          address.city_district,
          address.county,
          address.municipality,
          address.administrative_area_level_1,
          address.administrative_area_level_2
        ].filter(Boolean);
        
        console.log('🏙️ Các trường địa chỉ tìm được:', addressFields);
        
        let matchedProvinceCode = null;
        
        // Tìm tỉnh phù hợp từ mapping
        for (const cityName of addressFields) {
          const normalizedCity = cityName.toLowerCase()
            .replace(/tp\.|thành phố|tỉnh/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          console.log('🔍 Đang kiểm tra:', normalizedCity);
          
          if (cityMapping[normalizedCity]) {
            matchedProvinceCode = cityMapping[normalizedCity];
            console.log('✅ Tìm thấy match:', normalizedCity, '->', matchedProvinceCode);
            break;
          }
          
          // Thử tìm kiếm partial match
          for (const [key, value] of Object.entries(cityMapping)) {
            if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
              matchedProvinceCode = value;
              console.log('✅ Tìm thấy partial match:', key, '->', value);
              break;
            }
          }
          
          if (matchedProvinceCode) break;
        }
        
        // Nếu không tìm thấy trong mapping, tìm trong danh sách provinces
        if (!matchedProvinceCode) {
          console.log('🔍 Không tìm thấy trong mapping, thử tìm trong danh sách provinces...');
          
          for (const cityName of addressFields) {
            const matchedProvince = provinces.find(p => {
              const provinceName = p.name.toLowerCase().replace('tp. ', '').replace('tỉnh ', '');
              const cityNameLower = cityName.toLowerCase().replace('tp. ', '').replace('tỉnh ', '');
              
              return provinceName.includes(cityNameLower) || cityNameLower.includes(provinceName);
            });
            
            if (matchedProvince) {
              matchedProvinceCode = matchedProvince.code;
              console.log('✅ Tìm thấy trong provinces:', matchedProvince.name, '->', matchedProvinceCode);
              break;
            }
          }
        }
        
        // Tạo địa chỉ gợi ý
        const suggestedAddress = [
          address.house_number,
          address.road,
          address.suburb || address.neighbourhood || address.quarter
        ].filter(Boolean).join(' ');
        
        console.log('📍 Kết quả cuối cùng:', {
          province: matchedProvinceCode || 'HCM',
          suggestedAddress
        });
        
        // Cập nhật form data
        setFormData(prev => ({
          ...prev,
          province: matchedProvinceCode || 'HCM',
          address: prev.address || suggestedAddress
        }));
        
        setIsGeocoding(false);
      }
    } catch (error) {
      // Clear timeout nếu có lỗi
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      setIsGeocoding(false);
      console.error('❌ Reverse geocoding error:', error);
      
      // Retry logic - thử lại tối đa 2 lần, nhưng không retry nếu là AbortError liên tục
      if (retryCount < 2 && error.message.includes('Failed to fetch')) {
        console.log(`🔄 Thử lại lần ${retryCount + 1}/2...`);
        setGeocodingStatus(`Kết nối chậm, đang thử lại... (${retryCount + 2}/3)`);
        setTimeout(() => {
          reverseGeocode(lat, lng, retryCount + 1);
        }, 3000); // Tăng thời gian chờ lên 3 giây
        return;
      }
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Không thể tự động đoán địa chỉ. Vui lòng nhập thủ công.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Kết nối mạng chậm. Đã thử 3 lần. Vui lòng nhập địa chỉ thủ công.';
        console.log('⏰ Geocoding timeout sau nhiều lần thử');
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Không có kết nối mạng. Vui lòng kiểm tra internet và nhập địa chỉ thủ công.';
        console.log('🌐 Không có kết nối mạng sau nhiều lần thử');
      }
      
      // Fallback: ước tính tỉnh dựa trên tọa độ (offline)
      const estimatedProvince = estimateProvinceFromCoords(lat, lng);
      setFormData(prev => ({
        ...prev,
        province: estimatedProvince
      }));
      setAddressSuggestion(`${errorMessage} (Ước tính: ${provinces.find(p => p.code === estimatedProvince)?.name || 'TP.HCM'})`);
      setGeocodingStatus('');
    }
  }, [provinces, isGeocoding]);

  // Compress image before upload
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    const compressedImages = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          compressedImages.push({
            id: Date.now() + Math.random(),
            file: compressed,
            preview: event.target.result,
            name: file.name
          });
          
          if (compressedImages.length === files.length) {
            if (type === 'overall') {
              setOverallImages(prev => [...prev, ...compressedImages]);
            } else {
              setChargerImages(prev => [...prev, ...compressedImages]);
            }
          }
        };
        reader.readAsDataURL(compressed);
      }
    }
  };

  const removeImage = (imageId, type) => {
    if (type === 'overall') {
      setOverallImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      setChargerImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const getCurrentLocation = useCallback(() => {
    setGettingLocation(true);
    setError('');
    
    if (navigator.geolocation) {
      console.log('🎯 Bắt đầu lấy vị trí GPS...');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = parseFloat(position.coords.latitude.toFixed(6));
            const lng = parseFloat(position.coords.longitude.toFixed(6));
            const accuracy = position.coords.accuracy;
            
            console.log('📍 Tọa độ GPS nhận được:', {
              lat,
              lng,
              accuracy: `${accuracy}m`,
              timestamp: new Date(position.timestamp).toLocaleString()
            });
            
            setFormData(prev => ({
              ...prev,
              lat,
              lng
            }));
            
            setLocationDetected(true);
            setGettingLocation(false);
            
            // Tự động đoán địa chỉ (có thể bỏ qua nếu lỗi)
            console.log('🔍 Bắt đầu reverse geocoding...');
            try {
              await reverseGeocode(lat, lng);
            } catch (geocodeError) {
              console.log('⚠️ Bỏ qua reverse geocoding, user có thể nhập thủ công:', geocodeError);
              // Không làm gì, để user tự chọn tỉnh/huyện
            }
          } catch (positionError) {
            console.error('❌ Lỗi xử lý vị trí:', positionError);
            setError('Lỗi xử lý dữ liệu vị trí. Vui lòng thử lại.');
            setGettingLocation(false);
          }
        },
        (error) => {
          console.error('❌ Lỗi lấy vị trí GPS:', error);
          let errorMessage = 'Không thể lấy vị trí hiện tại. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Vui lòng cho phép truy cập vị trí trong trình duyệt và thử lại.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Thông tin vị trí không khả dụng. Hãy kiểm tra GPS/WiFi.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Hết thời gian chờ lấy vị trí. Vui lòng thử lại.';
              break;
            default:
              errorMessage += 'Vui lòng thử lại hoặc nhập thủ công.';
              break;
          }
          
          setError(errorMessage);
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // Tăng timeout lên 20s
          maximumAge: 30000 // Giảm xuống 30s để có dữ liệu mới hơn
        }
      );
    } else {
      setError('Trình duyệt không hỗ trợ định vị GPS. Vui lòng nhập thông tin thủ công.');
      setGettingLocation(false);
    }
  }, [reverseGeocode]); // Thêm reverseGeocode dependency

  // Auto-detect location khi component mount
  useEffect(() => {
    if (dataLoaded && !locationDetected) {
      // Tự động lấy vị trí khi trang load
      const timer = setTimeout(() => {
        getCurrentLocation();
      }, 500); // Delay nhỏ để đảm bảo component đã render xong
      
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, locationDetected]);

  if (!user) {
    return <div>Vui lòng đăng nhập để tạo trạm sạc</div>;
  }

  if (!dataLoaded) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('operatingHours.')) {
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

  const handleChargerTypeChange = (chargerId, checked) => {
    if (checked) {
      const chargerType = chargerTypes.find(ct => ct.id === chargerId);
      const newChargerType = {
        id: chargerId,
        name: chargerType.name,
        price: chargerType.defaultPrice
      };
      setFormData({
        ...formData,
        chargerTypes: [...formData.chargerTypes, newChargerType]
      });
    } else {
      setFormData({
        ...formData,
        chargerTypes: formData.chargerTypes.filter(ct => ct.id !== chargerId)
      });
    }
  };

  const handleChargerPriceChange = (chargerId, price) => {
    setFormData({
      ...formData,
      chargerTypes: formData.chargerTypes.map(ct => 
        ct.id === chargerId ? { ...ct, price: parseInt(price) } : ct
      )
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
      if (!formData.name || !formData.address || !formData.province || !formData.district || !formData.contactPhone) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      if (!formData.lat || !formData.lng) {
        throw new Error('Vui lòng lấy tọa độ GPS hoặc chọn vị trí trên bản đồ');
      }

      if (formData.chargerTypes.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một loại sạc');
      }



      // Tạo station mới
      const newStation = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        contactPhone: formData.contactPhone,
        latitude: formData.lat,
        longitude: formData.lng,
        rating: 0,
        totalRatings: 0,
        chargerTypes: formData.chargerTypes.map(ct => ct.name),
        pricing: formData.chargerTypes.map(ct => ({
          chargerType: ct.name,
          pricePerHour: ct.price
        })),
        amenities: formData.amenities,
        images: {
          overall: overallImages.map(img => img.name),
          charger: chargerImages.map(img => img.name)
        },
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
    <div style={{ 
      padding: '1rem', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937, #111827)',
      color: 'white'
    }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Quay lại
        </button>
      </div>
      
      <div className="form-container" style={{ maxWidth: '800px' }}>
        <h2>⚡ Thêm trạm sạc mới</h2>
        {error && <div className="error-message">{error}</div>}
        
        {/* GPS Location Section */}
        <div className="location-section" style={{ 
          background: locationDetected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
          border: `1px solid ${locationDetected ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
          borderRadius: '12px', 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: locationDetected ? '#10b981' : '#60a5fa' }}>
            📍 Bước 1: Xác định vị trí trạm sạc
          </h3>
          
          {!locationDetected ? (
            <div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                Nhấn nút bên dưới để tự động lấy tọa độ GPS và đoán địa chỉ
              </p>
              
              {error && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  color: '#fca5a5'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>❌ Lỗi lấy vị trí:</div>
                  <div style={{ fontSize: '0.9rem' }}>{error}</div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="location-btn"
                  style={{
                    background: gettingLocation ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: gettingLocation ? 'not-allowed' : 'pointer',
                    opacity: gettingLocation ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {gettingLocation ? '🔄 Đang lấy vị trí...' : '🎯 Lấy vị trí hiện tại'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    setLocationDetected(true);
                    setFormData(prev => ({ ...prev, lat: 10.7769, lng: 106.7009, province: 'HCM' }));
                    setError('');
                  }}
                  className="manual-location-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  📝 Nhập thủ công
                </button>
              </div>
              
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                💡 <strong>Mẹo:</strong> Để lấy vị trí chính xác, hãy đảm bảo:
                <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: '1rem' }}>
                  <li>Cho phép truy cập vị trí trong trình duyệt</li>
                  <li>Bật GPS/Location Services trên thiết bị</li>
                  <li>Kết nối WiFi hoặc dữ liệu di động ổn định</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="location-success">
              <div className="location-info">
                <span style={{ color: '#059669', fontSize: '1.2rem' }}>✅</span>
                <span style={{ fontWeight: '600', color: '#059669' }}>Đã lấy tọa độ GPS thành công!</span>
              </div>
              
              <div className="location-coords">
                📍 Tọa độ: {formData.lat}, {formData.lng}
              </div>
              
              {geocodingStatus && (
                <div className="location-address" style={{ color: '#f59e0b' }}>
                  🔄 {geocodingStatus}
                </div>
              )}
              
              {addressSuggestion && (
                <div className="location-address">
                  🏠 Địa chỉ gợi ý: {addressSuggestion}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setLocationDetected(false);
                    setFormData(prev => ({ ...prev, lat: null, lng: null, province: '', district: '', ward: '' }));
                    setAddressSuggestion('');
                    setGeocodingStatus('');
                  }}
                  className="retry-location-btn"
                >
                  🔄 Lấy lại vị trí
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${formData.lat},${formData.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="retry-location-btn"
                  style={{ background: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}
                >
                  🗺️ Xem trên bản đồ
                </button>
              </div>
            </div>
          )}
        </div>
      
      <form onSubmit={handleSubmit}>
        {/* Hiển thị form khi đã có tọa độ GPS hoặc user chọn nhập thủ công */}
        {(locationDetected || formData.lat !== null) && (
          <>
            {/* Địa chỉ - Bước 2 */}
            <div className="form-section">
              <h3 className="section-title">📍 Bước 2: Xác nhận địa chỉ trạm sạc</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>🏙️ Tỉnh/Thành phố * <span className="auto-detected">(đã tự động đoán)</span></label>
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
                    <label>🏘️ Quận/Huyện *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn quận/huyện</option>
                      {getCurrentDistricts().map(district => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {formData.district && getCurrentWards().length > 0 && (
                <div className="form-group">
                  <label>🏠 Phường/Xã</label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                  >
                    <option value="">Chọn phường/xã (tùy chọn)</option>
                    {getCurrentWards().map(ward => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>🏢 Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="VD: 123 Nguyễn Huệ, Phường Bến Nghé"
                  required
                />
                {addressSuggestion && !formData.address && (
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, address: addressSuggestion }))}
                    className="address-suggestion-btn"
                  >
                    💡 Sử dụng gợi ý: {addressSuggestion}
                  </button>
                )}
              </div>
            </div>

            {/* Thông tin cơ bản - Bước 3 */}
            {formData.province && formData.district && (
              <div className="form-section">
                <h3 className="section-title">📝 Bước 3: Thông tin trạm sạc</h3>
                
                <div className="form-group">
                  <label>⚡ Tên trạm sạc *</label>
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
                  <label>📞 Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="VD: 0901234567"
                    required
                  />
                  <p className="field-hint">
                    Số điện thoại để khách hàng liên hệ khi có vấn đề với trạm sạc
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Thông báo cần lấy GPS trước */}
        {!locationDetected && (
          <div className="form-section" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
            <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Vui lòng lấy tọa độ GPS trước</h3>
            <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: '1.6' }}>
              Để tạo trạm sạc, bạn cần lấy tọa độ GPS chính xác của vị trí trạm sạc.<br/>
              Nhấn nút "🎯 Lấy vị trí hiện tại" ở phía trên để tiếp tục.
            </p>
          </div>
        )}
        

        {/* Loại sạc và giá cả */}
        <div className="form-section charger-types-section">
          <h3 className="section-title">🔌 Loại sạc và giá cả</h3>
          <div className="field-hint">
            <strong>💡 Hướng dẫn:</strong> Chọn các loại sạc có tại trạm của bạn và thiết lập mức giá cạnh tranh. 
            Giá cả hợp lý sẽ thu hút nhiều khách hàng hơn và tăng doanh thu.
          </div>
          
          {formData.chargerTypes.length > 0 && (
            <div className="charger-selection-counter">
              ✅ Đã chọn {formData.chargerTypes.length} loại sạc
            </div>
          )}
          
          <div className="charger-types-grid">
            {chargerTypes.map((charger) => {
              const isSelected = formData.chargerTypes.some(ct => ct.id === charger.id);
              const selectedCharger = formData.chargerTypes.find(ct => ct.id === charger.id);
              
              return (
                <div key={charger.id} className={`charger-type-card ${isSelected ? 'selected' : ''}`}>
                  <div className="charger-power-badge">{charger.power}</div>
                  <label className="charger-header">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleChargerTypeChange(charger.id, e.target.checked)}
                      className="charger-checkbox"
                    />
                    <div className="charger-icon">{charger.icon}</div>
                    <div className="charger-info">
                      <div className="charger-name">{charger.name}</div>
                      <div className="charger-desc">{charger.description}</div>
                      <div className="charger-time">⏱️ {charger.chargingTime}</div>
                      <div className="vehicle-indicators">
                        {charger.vehicleTypes.map(vehicle => (
                          <span key={vehicle} className="vehicle-indicator">
                            {vehicle === 'car' ? '🚗 Ô tô' : '🏍️ Xe máy'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="check-indicator">✓</div>
                  </label>
                  
                  {isSelected && (
                    <div className="charger-price-section">
                      <label className="price-label">
                        💰 Giá (VNĐ/giờ):
                        <span className="recommended-price">
                          💡 Đề xuất: {charger.defaultPrice.toLocaleString()}đ
                        </span>
                      </label>
                      <div className="price-input-group">
                        <div className="price-input-container">
                          <input
                            type="number"
                            value={selectedCharger?.price || charger.defaultPrice}
                            onChange={(e) => handleChargerPriceChange(charger.id, e.target.value)}
                            min={charger.priceRange.min}
                            max={charger.priceRange.max}
                            className="price-input"
                            placeholder={charger.defaultPrice.toString()}
                          />
                        </div>
                        <span className="price-range">
                          Khoảng giá thị trường: {charger.priceRange.min.toLocaleString()}đ - {charger.priceRange.max.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Pricing Summary */}
          {formData.chargerTypes.length > 0 && (
            <div className="pricing-summary">
              <h4 className="pricing-summary-title">
                💰 Tóm tắt giá cả ({formData.chargerTypes.length} loại sạc)
              </h4>
              <div className="pricing-summary-list">
                {formData.chargerTypes.map((chargerType) => {
                  const charger = chargerTypes.find(ct => ct.id === chargerType.id);
                  return (
                    <div key={chargerType.id} className="pricing-summary-item">
                      <span className="pricing-summary-charger">
                        {charger?.icon} {charger?.name}
                      </span>
                      <span className="pricing-summary-price">
                        {parseInt(chargerType.price || charger?.defaultPrice || 0).toLocaleString('vi-VN')}đ/giờ
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Revenue Estimate */}
          {formData.chargerTypes.length > 0 && (
            <div className="revenue-estimate">
              <h4 className="revenue-estimate-title">
                📊 Ước tính doanh thu
              </h4>
              <div className="revenue-estimate-text">
                Với {formData.chargerTypes.length} loại sạc và giá trung bình{' '}
                {Math.round(
                  formData.chargerTypes.reduce((sum, ct) => {
                    const charger = chargerTypes.find(c => c.id === ct.id);
                    return sum + parseInt(ct.price || charger?.defaultPrice || 0);
                  }, 0) / formData.chargerTypes.length
                ).toLocaleString()}đ/giờ, 
                bạn có thể thu về <strong>
                  {(Math.round(
                    formData.chargerTypes.reduce((sum, ct) => {
                      const charger = chargerTypes.find(c => c.id === ct.id);
                      return sum + parseInt(ct.price || charger?.defaultPrice || 0);
                    }, 0) / formData.chargerTypes.length
                  ) * 8 * 30).toLocaleString()}đ - {(Math.round(
                    formData.chargerTypes.reduce((sum, ct) => {
                      const charger = chargerTypes.find(c => c.id === ct.id);
                      return sum + parseInt(ct.price || charger?.defaultPrice || 0);
                    }, 0) / formData.chargerTypes.length
                  ) * 12 * 30).toLocaleString()}đ/tháng
                </strong> (ước tính 8-12 giờ sử dụng/ngày).
              </div>
            </div>
          )}
        </div>

        {/* Hình ảnh trạm sạc */}
        <div className="form-section">
          <h3 className="section-title">📸 Hình ảnh trạm sạc</h3>
          
          <div className="image-upload-row">
            {/* Hình ảnh tổng thể */}
            <div className="image-upload-group">
              <label className="image-group-label">🏢 Hình ảnh tổng thể (tối đa 3)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'overall')}
                  className="image-input"
                  id="overall-images"
                />
                <label htmlFor="overall-images" className="image-upload-btn-small">
                  📷 Chọn hình
                </label>
                <p className="image-tip">Hình ảnh toàn cảnh trạm sạc, bãi đỗ xe, khu vực xung quanh</p>
                
                {overallImages.length > 0 && (
                  <div className="image-preview-grid">
                    {overallImages.map((image) => (
                      <div key={image.id} className="image-preview-item">
                        <img src={image.preview} alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => removeImage(image.id, 'overall')}
                          className="remove-image-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hình ảnh trụ sạc */}
            <div className="image-upload-group">
              <label className="image-group-label">🔌 Hình ảnh trụ sạc (tối đa 3)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'charger')}
                  className="image-input"
                  id="charger-images"
                />
                <label htmlFor="charger-images" className="image-upload-btn-small">
                  📷 Chọn hình
                </label>
                <p className="image-tip">Hình ảnh chi tiết các trụ sạc, cổng sạc, bảng giá</p>
                
                {chargerImages.length > 0 && (
                  <div className="image-preview-grid">
                    {chargerImages.map((image) => (
                      <div key={image.id} className="image-preview-item">
                        <img src={image.preview} alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => removeImage(image.id, 'charger')}
                          className="remove-image-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? '⏳ Đang tạo trạm sạc...' : '🚀 Tạo trạm sạc (+100 điểm)'}
        </button>
        
        <div className="success-message">
          <p>
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