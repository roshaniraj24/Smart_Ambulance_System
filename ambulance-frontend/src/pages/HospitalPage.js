import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../Components/common/Header';
import HospitalDashboard from '../Components/hospital/HospitalDashboard';
import Sidebar from '../Components/common/Sidebar';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import BedCapacity from '../Components/hospital/BedCapacity';
import IncomingPatients from '../Components/hospital/IncomingPatients';
import HospitalSettings from '../Components/hospital/HospitalSettings';

const HospitalPage = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

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
        <p>Loading hospital dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated() || !hasRole('hospital')) {
    return <Navigate to="/login" replace />;
  }

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '🏥',
      active: currentView === 'dashboard' 
    },
    { 
      id: 'patients', 
      label: 'Incoming Patients', 
      icon: '🚑' 
    },
    { 
      id: 'capacity', 
      label: 'Bed Management', 
      icon: '🛏️' 
    },
    { 
      id: 'staff', 
      label: 'Staff Management', 
      icon: '👨‍⚕️' 
    },
    { 
      id: 'equipment', 
      label: 'Equipment Status', 
      icon: '⚕️' 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: '📊' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️' 
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'patients':
        return (
          <div className="card">
            <h3>Incoming Ambulances</h3>
            <IncomingPatients patients={[{ id: 'AMB-301', name: 'John D', condition: 'Trauma', eta: 9, priority: 'High' }]} />
          </div>
        );
      case 'capacity':
        return (
          <div className="card">
            <h3>Bed Capacity</h3>
            <BedCapacity capacity={{ icu: { occupied: 7, total: 10, percentage: 70 }, general: { occupied: 20, total: 40, percentage: 50 }, emergency: { occupied: 3, total: 8, percentage: 38 } }} />
          </div>
        );
      case 'settings':
        return <HospitalSettings />;
      default:
        return <HospitalDashboard />;
    }
  };

  return (
    <div className="main-layout">
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          title="Hospital Portal"
          items={sidebarItems}
          userRole="hospital"
          onSelect={(id) => setCurrentView(id)}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="main-content">
        <div className="header-container">
          <Header 
            title="Hospital Dashboard"
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

export default HospitalPage;