import React from 'react';

const IncomingPatients = ({ patients }) => {
  const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="incoming-list">
      {patients.map((p, idx) => (
        <div key={`${p.id}-${idx}`} className="incoming-item">
          <div className="incoming-header">
            <span className="incoming-id">{p.id}</span>
            <span className="priority" style={{ backgroundColor: getPriorityColor(p.priority), color: 'white' }}>{p.priority}</span>
          </div>
          <div className="incoming-body">
            <div className="patient-name">{p.name}</div>
            <div className="patient-condition">{p.condition}</div>
          </div>
          <div className="incoming-meta">
            <span>ETA: {p.eta} min</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomingPatients;





