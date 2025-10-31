import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const InviteFriends = () => {
  const { user, updateUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [message, setMessage] = useState('');

  const appLink = 'https://sacvui.app';
  const brandName = 'Sạc Vui';
  
  const shareMessage = `🔋 ${brandName} - App tìm trạm sạc xe điện thông minh!

⚡ Tính năng:
• Tìm trạm sạc gần nhất
• Chỉ đường GPS
• So sánh giá cả
• Đánh giá trạm sạc

📱 Tải ngay: ${appLink}`;

  const handleInvite = async (method) => {
    try {
      let success = false;
      
      switch (method) {
        case 'link':
          await navigator.clipboard.writeText(`${shareMessage}\n\n📱 ${appLink}`);
          setMessage('✅ Đã copy link!');
          success = true;
          break;
          
        case 'zalo':
          const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent(shareMessage)}`;
          window.open(zaloUrl, '_blank');
          setMessage('✅ Đã mở Zalo!');
          success = true;
          break;
          
        case 'facebook':
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}&quote=${encodeURIComponent(shareMessage)}`;
          window.open(fbUrl, '_blank');
          setMessage('✅ Đã mở Facebook!');
          success = true;
          break;
          
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
          window.open(whatsappUrl, '_blank');
          setMessage('✅ Đã mở WhatsApp!');
          success = true;
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
        <span className="invite-text">Mời bạn</span>
        <span className="invite-reward">+50</span>
      </button>

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="invite-modal-simple" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎁 Mời bạn bè sử dụng Sạc Vui</h3>
              <button 
                className="close-btn"
                onClick={() => setShowInviteModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <p className="invite-description">
                Chia sẻ app với bạn bè và nhận 50 điểm thưởng!
              </p>
              
              <div className="invite-options-simple">
                <button 
                  className="invite-option-simple"
                  onClick={() => handleInvite('link')}
                >
                  🔗 Copy Link
                </button>
                
                <button 
                  className="invite-option-simple"
                  onClick={() => handleInvite('zalo')}
                >
                  💙 Zalo
                </button>
                
                <button 
                  className="invite-option-simple"
                  onClick={() => handleInvite('facebook')}
                >
                  📘 Facebook
                </button>
                
                <button 
                  className="invite-option-simple"
                  onClick={() => handleInvite('whatsapp')}
                >
                  📱 WhatsApp
                </button>
              </div>

              {message && (
                <div className={`invite-message ${message.includes('✅') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteFriends;