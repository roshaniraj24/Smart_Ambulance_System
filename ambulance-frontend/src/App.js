import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import components
import Login from './Components/auth/Login';
import Signup from './Components/auth/Signup';
import LoadingSpinner from './Components/common/LoadingSpinner';

// Import pages
import DriverPage from './pages/DriverPage';
import HospitalPage from './pages/HospitalPage';
import AdminPage from './pages/AdminPage';

// Import styles
import './App.css';
import './styles/variables.css';
import './styles/global.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading and check authentication
    const initializeApp = async () => {
      try {
        // Add any initialization logic here
        // Check for saved authentication, load app settings, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Initialize theme and listen for runtime theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'teal';
    document.body.setAttribute('data-theme', savedTheme);

    const onSetTheme = (e) => {
      const theme = e?.detail?.theme;
      if (!theme) return;
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };
    window.addEventListener('set-theme', onSetTheme);
    return () => window.removeEventListener('set-theme', onSetTheme);
  }, []);

  // Initialize color mode (light/dark) and listen for toggle
  useEffect(() => {
    const savedMode = localStorage.getItem('mode') || 'light';
    document.body.setAttribute('data-mode', savedMode);

    const onSetMode = (e) => {
      const mode = e?.detail?.mode;
      if (!mode) return;
      document.body.setAttribute('data-mode', mode);
      localStorage.setItem('mode', mode);
    };
    const onToggleMode = () => {
      const current = document.body.getAttribute('data-mode') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-mode', next);
      localStorage.setItem('mode', next);
    };

    window.addEventListener('set-mode', onSetMode);
    window.addEventListener('toggle-mode', onToggleMode);
    return () => {
      window.removeEventListener('set-mode', onSetMode);
      window.removeEventListener('toggle-mode', onToggleMode);
    };
  }, []);

  // Global hotkeys
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        window.dispatchEvent(new CustomEvent('global-emergency'));
      }
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        window.dispatchEvent(new CustomEvent('global-toggle-notifications'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Show loading screen while app initializes
  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <h2>Smart Ambulance System</h2>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App medical-bg">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/driver" element={<DriverPage />} />
            <Route path="/hospital" element={<HospitalPage />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;