import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InviteFriends from './InviteFriends';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" style={{ textDecoration: 'none' }}>
          ⚡ Sạc Vui
        </Link>
      </h1>
      <ul className="nav-links">
        <li><Link to="/map">🗺️ Bản đồ</Link></li>
        {user ? (
          <>
            <li><Link to="/create-station">➕ Tạo trạm</Link></li>
            <li><InviteFriends /></li>
            <li><Link to="/profile">👤 {user.name} ({user.points || 0}⭐)</Link></li>
            {user.role === 'ADMIN' && (
              <li><Link to="/admin">⚙️ Admin</Link></li>
            )}
            <li>
              <button onClick={logout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                🚪 Thoát
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">🔐 Đăng nhập</Link></li>
            <li><Link to="/register">🎯 Đăng ký</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;