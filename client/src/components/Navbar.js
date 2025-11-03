
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InviteFriends from './InviteFriends';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Không hiển thị navbar khi chưa đăng nhập
  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand">
          ⚡ Sạc Vui
        </Link>
      </div>
      <ul className="navbar-nav">
        <li><Link to="/map">🗺️ Bản đồ</Link></li>
        <li><Link to="/create-station">➕ Tạo trạm</Link></li>
        <li><InviteFriends /></li>
        <li><Link to="/profile">👤 {user.name} ({user.points || 0}⭐)</Link></li>
        {user.role === 'ADMIN' && (
          <li><Link to="/admin">⚙️ Admin</Link></li>
        )}
        <li>
          <button onClick={logout} className="navbar-logout-btn">
            🚪 Thoát
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;