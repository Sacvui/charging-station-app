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
// Temporarily disable CSS imports to test build

function AppContent() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/quick-register';

  const appStyles = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#ffffff'
  };

  const mainContentStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div className="App app-container" style={appStyles}>
      {!isOnboarding && !isAuthPage && <Navbar />}
      <div 
        className={`main-content ${isOnboarding ? 'onboarding-mode' : ''} ${isAuthPage ? 'auth-mode' : ''}`}
        style={mainContentStyles}
      >
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