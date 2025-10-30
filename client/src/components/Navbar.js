import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Trạm Sạc Pin
        </Link>
      </h1>
      <ul className="nav-links">
        <li><Link to="/map">Bản đồ</Link></li>
        {user ? (
          <>
            <li><Link to="/create-station">Tạo trạm</Link></li>
            <li><Link to="/profile">Profile ({user.points || 0} điểm)</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/admin">Admin</Link></li>
            )}
            <li>
              <button onClick={logout} className="btn-secondary">
                Đăng xuất
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Đăng nhập</Link></li>
            <li><Link to="/register">Đăng ký</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;