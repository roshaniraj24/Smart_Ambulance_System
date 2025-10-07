import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../Components/common/Header';
import AdminDashboard from '../Components/admin/AdminDashboard';
import PatientDataForm from '../Components/admin/PatientDataForm';
import Sidebar from '../Components/common/Sidebar';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const AdminPage = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);

  const addPatientData = (patientData) => {
    // Update the incident with patient data
    setIncidents(prevIncidents =>
      prevIncidents.map(incident =>
        incident.id === patientData.id
          ? { ...incident, patientData: { ...patientData } }
          : incident
      )
    );
  };

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
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated() || !hasRole('admin')) {
    return <Navigate to="/login" replace />;
  }

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Overview', 
      icon: '📊',
      active: true 
    },
    { 
      id: 'ambulances', 
      label: 'Ambulance Fleet', 
      icon: '🚑' 
    },
    { 
      id: 'hospitals', 
      label: 'Hospital Network', 
      icon: '🏥' 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: '👥' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: '📈' 
    },
    { 
      id: 'system', 
      label: 'System Monitor', 
      icon: '🖥️' 
    },
    { 
      id: 'logs', 
      label: 'System Logs', 
      icon: '📋' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️' 
    }
  ];

  return (
    <div className="main-layout">
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          title="Admin Portal"
          items={sidebarItems}
          userRole="admin"
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="main-content">
        <div className="header-container">
          <Header 
            title="System Administration"
            onMenuToggle={handleMenuToggle}
            showNotifications={true}
          />
        </div>
        
        <div className="content-area">
          <Routes>
            <Route path="/" element={<AdminDashboard incidents={incidents} setIncidents={setIncidents} />} />
            <Route path="/patient-data/:incidentId" element={<PatientDataForm addPatientData={addPatientData} />} />
          </Routes>
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

export default AdminPage;