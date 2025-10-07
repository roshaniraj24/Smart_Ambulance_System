import React from 'react';

const VehicleStatus = () => {
  return (
    <div className="vehicle-status">
      <div className="status-item">
        <span className="status-label">Engine:</span>
        <span className="status-value good">Running</span>
      </div>
      <div className="status-item">
        <span className="status-label">Fuel:</span>
        <span className="status-value good">75%</span>
      </div>
      <div className="status-item">
        <span className="status-label">GPS:</span>
        <span className="status-value good">Active</span>
      </div>
      <div className="status-item">
        <span className="status-label">Siren:</span>
        <span className="status-value good">Functional</span>
      </div>
      <div className="status-item">
        <span className="status-label">Medical Equipment:</span>
        <span className="status-value good">Ready</span>
      </div>
    </div>
  );
};

export default VehicleStatus;
