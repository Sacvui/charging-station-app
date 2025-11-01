import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuickRegister from './pages/QuickRegister';
import NearbyStations from './pages/NearbyStations';
import Map from './pages/Map';
import StationDetail from './pages/StationDetail';
import CreateStation from './pages/CreateStation';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import './App-clean.css';
import './charger-styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quick-register" element={<QuickRegister />} />
              <Route path="/nearby" element={<NearbyStations />} />
              <Route path="/map" element={<Map />} />
              <Route path="/station/:id" element={<StationDetail />} />
              <Route path="/create-station" element={<CreateStation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/chat/:userId" element={<Chat />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;