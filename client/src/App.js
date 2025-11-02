import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import QuickRegister from './pages/QuickRegister';
import NearbyStations from './pages/NearbyStations';
import Map from './pages/Map';
import StationDetail from './pages/StationDetail';
import CreateStation from './pages/CreateStation';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import './App-minimal.css';
import './charger-styles.css';

function AppContent() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/quick-register';

  return (
    <div className="App app-container">
      {!isOnboarding && !isAuthPage && <Navbar />}
      <div className={`main-content ${isOnboarding ? 'onboarding-mode' : ''} ${isAuthPage ? 'auth-mode' : ''}`}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<QuickRegister />} />
            <Route path="/quick-register" element={<QuickRegister />} />
            <Route path="/nearby" element={<NearbyStations />} />
            <Route path="/map" element={<Map />} />
            <Route path="/station/:id" element={<StationDetail />} />
            <Route path="/create-station" element={<CreateStation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Routes>
        </PageTransition>
      </div>
      {!isOnboarding && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;