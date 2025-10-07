import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../Components/common/Header';
import DriverDashboard from '../Components/driver/DriverDashboard';
import Sidebar from '../Components/common/Sidebar';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import PatientVitals from '../Components/driver/PatientVitals';
import ECGMonitor from '../Components/driver/ECGMonitor';
import TripInfo from '../Components/driver/TripInfo';
import RouteMap from '../Components/driver/RouteMap';
import EmergencyButton from '../Components/driver/EmergencyButton';
import VehicleStatus from '../Components/driver/VehicleStatus';

const DriverPage = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'vitals', 'ecg', 'trip', 'map', 'emergency', 'vehicle'

  useEffect(() => {
    // Auto-close sidebar on desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" />
        <p>Loading driver dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated() || !hasRole('driver')) {
    return <Navigate to="/login" replace />;
  }

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      active: currentView === 'dashboard' 
    },
    { 
      id: 'trips', 
      label: 'Trip History', 
      icon: '📝' 
    },
    { 
      id: 'vitals', 
      label: 'Patient Monitor', 
      icon: '❤️',
      active: currentView === 'vitals' 
    },
    { 
      id: 'navigation', 
      label: 'Navigation', 
      icon: '🗺️',
      active: currentView === 'map' 
    },
    { 
      id: 'emergency', 
      label: 'Emergency Protocols', 
      icon: '🚨',
      active: currentView === 'emergency' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️' 
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'vitals':
        return (
          <div className="full-view">
            <div className="view-header">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h2>Patient Vitals Monitor</h2>
            </div>
            <PatientVitals fullView={true} />
          </div>
        );
      case 'ecg':
        return (
          <div className="full-view">
            <div className="view-header">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h2>ECG Monitor</h2>
            </div>
            <ECGMonitor fullView={true} />
          </div>
        );
      case 'trip':
        return (
          <div className="full-view">
            <div className="view-header">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h2>Trip Information</h2>
            </div>
            <TripInfo fullView={true} />
          </div>
        );
      case 'map':
        return (
          <div className="full-view">
            <div className="view-header">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h2>Route Navigation</h2>
            </div>
            <RouteMap fullView={true} />
          </div>
        );
      case 'emergency':
        return (
          <div className="full-view">
            <div className="view-header">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h2>Emergency Controls</h2>
            </div>
            <EmergencyButton fullView={true} />
          </div>
        );
      case 'vehicle':
        return (
          <div className="full-view">
            <div className="view-header">
              <button className="back-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h2>Vehicle Status</h2>
            </div>
            <VehicleStatus fullView={true} />
          </div>
        );
      default:
        return <DriverDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="main-layout">
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          title="Driver Portal"
          items={sidebarItems}
          userRole="driver"
          onSelect={(id) => {
            if (id === 'dashboard') setCurrentView('dashboard');
            if (id === 'vitals') setCurrentView('vitals');
            if (id === 'navigation') setCurrentView('map');
            if (id === 'emergency') setCurrentView('emergency');
          }}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="main-content">
        <div className="header-container">
          <Header 
            title={currentView === 'dashboard' ? "Driver Dashboard" : `Driver - ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`}
            onMenuToggle={handleMenuToggle}
            showNotifications={true}
          />
        </div>
        
        <div className="content-area">
          {renderCurrentView()}
        </div>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DriverPage;
