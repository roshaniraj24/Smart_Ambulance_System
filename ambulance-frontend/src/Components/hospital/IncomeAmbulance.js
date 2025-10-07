import React from 'react';

const IncomingAmbulances = ({ ambulances, onAccept, onReject }) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="incoming-ambulances">
      {ambulances.length === 0 ? (
        <div className="no-ambulances">
          <span className="no-ambulances-icon">✅</span>
          <p>No incoming ambulances</p>
        </div>
      ) : (
        <div className="ambulances-list">
          {ambulances.map(ambulance => (
            <div key={ambulance.id} className={`ambulance-card ${ambulance.accepted ? 'accepted' : ''}`}>
              <div className="ambulance-header">
                <div className="ambulance-id">
                  <span className="vehicle-icon">🚑</span>
                  <strong>{ambulance.id}</strong>
                </div>
                <div 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(ambulance.priority) }}
                >
                  {ambulance.priority}
                </div>
              </div>

              <div className="patient-info">
                <h4>{ambulance.patientName}</h4>
                <p className="location">📍 {ambulance.location}</p>
              </div>

              <div className="vitals-preview">
                <div className="vital-item">
                  <span>💓 {ambulance.vitals.heartRate} BPM</span>
                </div>
                <div className="vital-item">
                  <span>🩸 {ambulance.vitals.bloodPressure}</span>
                </div>
                <div className="vital-item">
                  <span>🫁 {ambulance.vitals.spo2}%</span>
                </div>
              </div>

              <div className="eta-section">
                <div className="eta-display">
                  <span className="eta-label">ETA:</span>
                  <span className={`eta-time ${ambulance.eta <= 10 ? 'urgent' : ''}`}>
                    {ambulance.eta} min
                  </span>
                </div>
              </div>

              {!ambulance.accepted && (
                <div className="action-buttons">
                  <button 
                    className="accept-btn"
                    onClick={() => onAccept(ambulance.id)}
                  >
                    ✅ Accept
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => onReject(ambulance.id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {ambulance.accepted && (
                <div className="accepted-status">
                  <span>✅ Accepted - Preparing bed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      </div>
  );
};