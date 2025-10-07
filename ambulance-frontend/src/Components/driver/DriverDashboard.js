// src/components/driver/DriverDashboard.js
import React, { useState, useEffect } from 'react';
import './DriverDashboard.css';
import PatientVitals from './PatientVitals';
import ECGMonitor from './ECGMonitor';
import TripInfo from './TripInfo';
import RouteMap from './RouteMap';
import EmergencyButton from './EmergencyButton';
import VehicleStatus from './VehicleStatus';

const DriverDashboard = ({ onNavigate }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [vitalsData, setVitalsData] = useState({
    heartRate: 95,
    bloodPressure: '113/81',
    spo2: 99,
    temperature: '99.4',
    respiratoryRate: 15,
    bloodGlucose: 129,
    timestamp: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    // Mock current trip data
    setCurrentTrip({
      patientName: "John Smith",
      priority: "High",
      pickupAddress: "123 Emergency St, Downtown",
      hospitalName: "Central Medical Center",
      eta: 15,
      status: "En Route"
    });

    // Simulate real-time vitals updates
    const interval = setInterval(() => {
      setVitalsData({
        heartRate: Math.floor(Math.random() * (120 - 60) + 60),
        bloodPressure: `${Math.floor(Math.random() * (140 - 90) + 90)}/${Math.floor(Math.random() * (90 - 60) + 60)}`,
        spo2: Math.floor(Math.random() * (100 - 95) + 95),
        temperature: (Math.random() * (101 - 97) + 97).toFixed(1),
        respiratoryRate: Math.floor(Math.random() * (20 - 12) + 12),
        bloodGlucose: Math.floor(Math.random() * (140 - 70) + 70),
        timestamp: new Date().toLocaleTimeString()
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="driver-dashboard">
      <div className="dashboard-background"></div>
      <div className="dashboard-overlay"></div>
      
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>🚑 Driver Dashboard</h1>
            <div className="status-indicator">
              <span className="status-dot active"></span>
              <span>On Duty</span>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Patient Vitals Card */}
          <div 
            className="dashboard-card vitals-card" 
            onClick={() => onNavigate && onNavigate('vitals')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate && onNavigate('vitals')}
          >
            <div className="card-header">
              <h3>📊 Patient Vitals</h3>
              <span className="real-time-indicator">● LIVE</span>
            </div>
            <PatientVitals vitals={vitalsData} />
          </div>

          {/* ECG Monitor Card */}
          <div 
            className="dashboard-card ecg-card" 
            onClick={() => onNavigate && onNavigate('ecg')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate && onNavigate('ecg')}
          >
            <div className="card-header">
              <h3>💓 ECG Monitor</h3>
              <span className="bpm-display">{vitalsData.heartRate} BPM</span>
            </div>
            <ECGMonitor heartRate={vitalsData.heartRate} />
          </div>

          {/* Current Trip Card */}
          <div 
            className="dashboard-card trip-card" 
            onClick={() => onNavigate && onNavigate('trip')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate && onNavigate('trip')}
          >
            <div className="card-header">
              <h3>🎯 Current Trip</h3>
              <span className={`priority-badge ${currentTrip?.priority?.toLowerCase()}`}>
                {currentTrip?.priority}
              </span>
            </div>
            <TripInfo trip={currentTrip} />
          </div>

          {/* Route Map Card */}
          <div 
            className="dashboard-card map-card" 
            onClick={() => onNavigate && onNavigate('map')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate && onNavigate('map')}
          >
            <div className="card-header">
              <h3>🗺️ Route Navigation</h3>
              <span className="eta-display">ETA: {currentTrip?.eta} min</span>
            </div>
            <RouteMap trip={currentTrip} />
          </div>

          {/* Emergency Controls Card */}
          <div 
            className="dashboard-card emergency-card" 
            onClick={() => onNavigate && onNavigate('emergency')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate && onNavigate('emergency')}
          >
            <div className="card-header">
              <h3>🚨 Emergency Controls</h3>
            </div>
            <EmergencyButton />
          </div>

          {/* Vehicle Status Card */}
          <div 
            className="dashboard-card vehicle-card" 
            onClick={() => onNavigate && onNavigate('vehicle')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate && onNavigate('vehicle')}
          >
            <div className="card-header">
              <h3>🔧 Vehicle Status</h3>
              <span className="status-good">All Systems Good</span>
            </div>
            <VehicleStatus />
          </div>
        </div>
      </div>

    </div>
  );
};

export default DriverDashboard;