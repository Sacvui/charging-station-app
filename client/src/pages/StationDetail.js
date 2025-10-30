import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStationById, getReviewsByStationId, saveToLocalStorage, getFromLocalStorage, generateId } from '../utils/mockData';

const StationDetail = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [station, setStation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadStationData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStationData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stationData = getStationById(id);
    const reviewsData = getReviewsByStationId(id);
    
    setStation(stationData);
    setReviews(reviewsData);
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    // Tạo review mới
    const newReview = {
      id: generateId(),
      stationId: id,
      user: { name: user.name, avatar: user.avatar },
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
      images: [],
      createdAt: new Date()
    };

    // Lưu review vào localStorage
    const allReviews = getFromLocalStorage('reviews', []);
    allReviews.push(newReview);
    saveToLocalStorage('reviews', allReviews);

    // Cập nhật state
    setReviews([newReview, ...reviews]);

    // Thưởng điểm cho user
    const updatedUser = { ...user, points: (user.points || 0) + 10 };
    updateUser(updatedUser);

    // Reset form
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);

    alert('Cảm ơn bạn đã đánh giá! Bạn được thưởng 10 điểm.');
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="loading">Đang tải thông tin trạm sạc...</div>;
  }

  if (!station) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>❌ Không tìm thấy trạm sạc</h2>
        <Link to="/map" className="btn-primary">🗺️ Quay lại bản đồ</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="station-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>⚡ {station.name}</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '1.1rem' }}>📍 {station.address}</p>
          </div>
          {station.isVerified && (
            <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#059669', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
              ✅ Đã xác minh
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3>⭐ Đánh giá</h3>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              <span className="rating">{getRatingStars(station.rating)}</span>
              <span style={{ marginLeft: '0.5rem', fontSize: '1rem', color: '#6b7280' }}>
                {station.rating}/5 ({station.totalRatings} đánh giá)
              </span>
            </div>
          </div>

          <div>
            <h3>🕒 Giờ hoạt động</h3>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>
              {station.operatingHours.is24Hours ? '24/7' : `${station.operatingHours.open} - ${station.operatingHours.close}`}
            </p>
          </div>

          <div>
            <h3>📞 Liên hệ</h3>
            <p style={{ margin: 0 }}>👤 {station.owner.name}</p>
            <p style={{ margin: 0 }}>📱 {station.owner.phone}</p>
          </div>
        </div>
      </div>

      {/* Promotions */}
      {station.promotions.length > 0 && (
        <div className="station-card" style={{ marginBottom: '2rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <h3 style={{ color: '#059669', marginBottom: '1rem' }}>🎁 Khuyến mãi đặc biệt</h3>
          {station.promotions.map((promo, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', margin: 0 }}>{promo.title} - Giảm {promo.discount}%</h4>
              <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>{promo.description}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                Có hiệu lực: {formatDate(promo.validFrom)} - {formatDate(promo.validTo)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Pricing & Charger Types */}
        <div className="station-card">
          <h3>💰 Bảng giá & Loại sạc</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {station.pricing.map((price, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
                <div>
                  <strong>🔌 {price.chargerType}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#667eea' }}>
                    {formatPrice(price.pricePerHour)}đ/giờ
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="station-card">
          <h3>🎯 Tiện ích</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
            {station.amenities.map((amenity, index) => (
              <div key={index} style={{ padding: '0.75rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                {amenity}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="station-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>💬 Đánh giá từ khách hàng ({reviews.length})</h3>
          {user && (
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              ✍️ Viết đánh giá
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '16px' }}>
            <div className="form-group">
              <label>⭐ Đánh giá</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({...reviewForm, rating: e.target.value})}
                required
              >
                <option value={5}>5 sao - Xuất sắc</option>
                <option value={4}>4 sao - Tốt</option>
                <option value={3}>3 sao - Bình thường</option>
                <option value={2}>2 sao - Kém</option>
                <option value={1}>1 sao - Rất kém</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>💭 Nhận xét</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                placeholder="Chia sẻ trải nghiệm của bạn về trạm sạc này..."
                rows={4}
                required
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">
                🚀 Gửi đánh giá (+10 điểm)
              </button>
              <button 
                type="button" 
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary"
              >
                ❌ Hủy
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <strong>👤 {review.user.name}</strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      <span className="rating">{getRatingStars(review.rating)}</span>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá trạm sạc này!</p>
            </div>
          )}
        </div>
      </div>

      {/* Back to Map */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/map" className="btn-secondary">
          🗺️ Quay lại bản đồ
        </Link>
      </div>
    </div>
  );
};

export default StationDetail;