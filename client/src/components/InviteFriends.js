import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const InviteFriends = () => {
  const { user, updateUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const appLink = 'https://charging-station-app.vercel.app';
  const brandName = 'Sạc Vui';
  const hashtags = '#SacVui #XeDien #TramSac #EV #Vietnam #GreenEnergy #SustainableTransport #ElectricVehicle';
  
  // eslint-disable-next-line no-unused-vars
  const inviteMessage = `🔋 ${brandName} - Ứng dụng tìm trạm sạc xe điện thông minh nhất Việt Nam!

✨ TÍNH NĂNG NỔI BẬT:
🎯 Tìm trạm sạc gần nhất với GPS thông minh
🗺️ Bản đồ tương tác với 1000+ trạm sạc toàn quốc
💬 Cộng đồng EV - Chat và chia sẻ kinh nghiệm
⭐ Đánh giá chi tiết 5 tiêu chí chất lượng
💰 So sánh giá cả minh bạch
🎁 Tích điểm thưởng cho mọi hoạt động
🚀 Chỉ đường tức thì tích hợp Google Maps

🎯 PHỤC VỤ:
🚗 Chủ xe ô tô điện (Tesla, VinFast, BMW...)
🛵 Người dùng xe máy điện (Klara, Pega...)
🏢 Chủ trạm sạc muốn mở rộng khách hàng
🌱 Cộng đồng yêu thích năng lượng xanh

📲 TRẢI NGHIỆM NGAY: ${appLink}

${hashtags}`;

  const shortMessage = `🔋 ${brandName} - App tìm trạm sạc xe điện thông minh nhất VN! 🇻🇳

⚡ Tính năng chính:
• GPS tìm trạm gần nhất
• 1000+ trạm sạc toàn quốc  
• Cộng đồng EV chat & chia sẻ
• Đánh giá 5 tiêu chí chi tiết
• So sánh giá minh bạch
• Tích điểm thưởng hấp dẫn

📱 Tải ngay: ${appLink}

${hashtags}`;
  
  const socialMessage = `🔋 Khám phá ${brandName} - Giải pháp thông minh cho cộng đồng xe điện Việt Nam! 🇻🇳

🌟 Tại sao chọn ${brandName}?
✅ GPS thông minh tìm trạm gần nhất
✅ Bản đồ tương tác 1000+ trạm sạc
✅ Cộng đồng EV sôi động - Chat & review
✅ Đánh giá đa tiêu chí (dịch vụ, giá cả, vệ sinh...)
✅ So sánh giá cả minh bạch
✅ Hệ thống tích điểm thưởng hấp dẫn
✅ Tích hợp Google Maps chỉ đường

🎯 Dành cho: Xe ô tô điện, xe máy điện, chủ trạm sạc

📲 Trải nghiệm ngay: ${appLink}

${hashtags}`;

  const handleInvite = async (method) => {
    try {
      let success = false;
      
      switch (method) {
        case 'link':
          await navigator.clipboard.writeText(`${socialMessage}\n\n📱 ${appLink}`);
          setMessage('✅ Đã copy link và nội dung quảng cáo!');
          success = true;
          break;
          
        case 'zalo':
          const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent(shortMessage)}`;
          window.open(zaloUrl, '_blank');
          setMessage('✅ Đã mở Zalo!');
          success = true;
          break;
          
        case 'facebook':
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}&quote=${encodeURIComponent(socialMessage)}`;
          window.open(fbUrl, '_blank');
          setMessage('✅ Đã mở Facebook!');
          success = true;
          break;
          
        case 'telegram':
          const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent(socialMessage)}`;
          window.open(telegramUrl, '_blank');
          setMessage('✅ Đã mở Telegram!');
          success = true;
          break;
          
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(socialMessage)}`;
          window.open(whatsappUrl, '_blank');
          setMessage('✅ Đã mở WhatsApp!');
          success = true;
          break;
          
        case 'sms':
          if (phoneNumber) {
            const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(shortMessage)}`;
            window.open(smsUrl);
            setMessage('✅ Đã mở ứng dụng tin nhắn!');
            success = true;
          } else {
            setMessage('❌ Vui lòng nhập số điện thoại');
          }
          break;
          
        default:
          break;
      }
      
      if (success) {
        // Thưởng điểm cho user
        const newPoints = (user.points || 0) + 50;
        updateUser({ ...user, points: newPoints });
        
        setTimeout(() => {
          setMessage('');
          setShowInviteModal(false);
        }, 2000);
      }
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  if (!user) return null;

  return (
    <>
      <button 
        onClick={() => setShowInviteModal(true)}
        className="invite-friends-btn"
      >
        <span className="invite-icon">🎁</span>
        <span className="invite-text">Mời bạn bè</span>
        <span className="invite-reward">+50đ</span>
      </button>

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎁 Mời bạn bè</h2>
              <button 
                className="close-btn"
                onClick={() => setShowInviteModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="invite-reward">
                <div className="reward-badge">
                  <span className="reward-icon">⭐</span>
                  <span className="reward-text">+50 điểm cho mỗi lời mời</span>
                </div>
              </div>

              <div className="invite-methods">
                <h3>Chọn cách mời:</h3>
                
                <div className="invite-options">
                  <button 
                    className="invite-option"
                    onClick={() => handleInvite('link')}
                  >
                    <span className="option-icon">🔗</span>
                    <span className="option-text">Copy Link</span>
                  </button>
                  
                  <button 
                    className="invite-option zalo"
                    onClick={() => handleInvite('zalo')}
                  >
                    <span className="option-icon">💙</span>
                    <span className="option-text">Zalo</span>
                  </button>
                  
                  <button 
                    className="invite-option facebook"
                    onClick={() => handleInvite('facebook')}
                  >
                    <span className="option-icon">📘</span>
                    <span className="option-text">Facebook</span>
                  </button>
                  
                  <button 
                    className="invite-option telegram"
                    onClick={() => handleInvite('telegram')}
                  >
                    <span className="option-icon">✈️</span>
                    <span className="option-text">Telegram</span>
                  </button>
                  
                  <button 
                    className="invite-option whatsapp"
                    onClick={() => handleInvite('whatsapp')}
                  >
                    <span className="option-icon">📱</span>
                    <span className="option-text">WhatsApp</span>
                  </button>
                </div>

                <div className="sms-invite">
                  <h4>📱 Gửi SMS:</h4>
                  <div className="sms-input-group">
                    <input
                      type="tel"
                      placeholder="Số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="phone-input"
                    />
                    <button 
                      onClick={() => handleInvite('sms')}
                      className="sms-btn"
                    >
                      Gửi SMS
                    </button>
                  </div>
                </div>
              </div>

              {message && (
                <div className={`invite-message ${message.includes('✅') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <div className="invite-preview">
                <h4>📝 Nội dung chia sẻ:</h4>
                <div className="message-preview">
                  {socialMessage}
                </div>
                <div className="hashtags-preview">
                  <strong>🏷️ Hashtags:</strong> {hashtags}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteFriends;