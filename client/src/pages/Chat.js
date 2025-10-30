import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, getChatMessages, sendChatMessage } from '../utils/mockData';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatData();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto refresh messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        const updatedMessages = getChatMessages(userId);
        setMessages(updatedMessages);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const loadChatData = async () => {
    try {
      const userData = getUserById(userId);
      const chatMessages = getChatMessages(userId);
      
      setTargetUser(userData);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    const message = sendChatMessage(userId, newMessage.trim(), true);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Đang tải cuộc trò chuyện...</div>;
  }

  if (!targetUser) {
    return (
      <div className="chat-error">
        <h2>❌ Không tìm thấy người dùng</h2>
        <Link to="/map" className="btn-primary">← Quay lại bản đồ</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="chat-error">
        <h2>🔐 Vui lòng đăng nhập để chat</h2>
        <Link to="/login" className="btn-primary">Đăng nhập</Link>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <Link to="/map" className="back-btn">←</Link>
        <div className="chat-user-info">
          <div className="user-avatar-small">
            <span>{targetUser.avatar}</span>
            {targetUser.isOnline && <div className="online-indicator-small"></div>}
          </div>
          <div>
            <h2>{targetUser.name}</h2>
            <p className="user-status-small">
              {targetUser.isOnline ? '🟢 Đang online' : `🕒 Hoạt động ${formatMessageTime(targetUser.lastSeen)}`}
            </p>
          </div>
        </div>
        <div className="chat-actions">
          <span className="user-vehicle-small">{targetUser.vehicle}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <h3>Chưa có tin nhắn nào</h3>
            <p>Hãy bắt đầu cuộc trò chuyện với {targetUser.name}!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.fromCurrentUser ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="message-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Nhắn tin cho ${targetUser.name}...`}
            className="message-input"
            maxLength={500}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim()}
          >
            📤
          </button>
        </div>
      </form>

      {/* Quick Messages */}
      <div className="quick-messages">
        <button 
          className="quick-msg-btn"
          onClick={() => setNewMessage('Chào bạn! 👋')}
        >
          👋 Chào bạn
        </button>
        <button 
          className="quick-msg-btn"
          onClick={() => setNewMessage('Bạn đang ở trạm sạc nào vậy?')}
        >
          📍 Hỏi vị trí
        </button>
        <button 
          className="quick-msg-btn"
          onClick={() => setNewMessage('Trạm này sạc nhanh không bạn?')}
        >
          ⚡ Hỏi tốc độ sạc
        </button>
        <button 
          className="quick-msg-btn"
          onClick={() => setNewMessage('Cảm ơn bạn! 😊')}
        >
          😊 Cảm ơn
        </button>
      </div>
    </div>
  );
};

export default Chat;