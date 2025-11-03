import React from 'react';

function App() {
  const appStyles = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  };

  return (
    <div style={appStyles}>
      <h1>🚀 SacVui - Trạm Sạc Thông Minh</h1>
      <p>App đang hoạt động với inline styles!</p>
      <div style={{ marginTop: '2rem' }}>
        <button style={{
          padding: '1rem 2rem',
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Test Button
        </button>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
        ✅ React app is working<br/>
        ✅ Inline styles are working<br/>
        ✅ No CSS build errors<br/>
        🎯 Ready for development!
      </div>
    </div>
  );
}

export default App;