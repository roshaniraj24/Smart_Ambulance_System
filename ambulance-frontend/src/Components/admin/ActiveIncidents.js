import React from 'react';

const ActiveIncidents = ({ incidents, onIncidentClick }) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#10b981';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('En Route')) return '#f59e0b';
    if (status.includes('At Scene')) return '#ef4444';
    if (status.includes('Dispatched')) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="active-incidents">
      <div className="incidents-list">
        {incidents.map(incident => (
          <div key={incident.id} className="incident-card" onClick={() => onIncidentClick && onIncidentClick(incident.id)} style={{ cursor: 'pointer' }}>
            <div className="incident-header">
              <div className="incident-id">
                <strong>{incident.id}</strong>
              </div>
              <div 
                className="priority-badge"
              >
                {incident.priority}
              </div>
            </div>

            <div className="incident-details">
              <h4>{incident.type}</h4>
              <p className="location">📍 {incident.location}</p>
              
              <div className="incident-meta">
                <div className="time-elapsed">
                  <span className="time-icon">⏱️</span>
                  <span>{incident.time}</span>
                </div>
                
                <div className="ambulance-assigned">
                  <span className="ambulance-icon">🚑</span>
                  <span>{incident.ambulance || 'Unassigned'}</span>
                </div>
              </div>

              <div 
                className="status-badge"
              >
                {incident.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
  );
};

export default ActiveIncidents;
