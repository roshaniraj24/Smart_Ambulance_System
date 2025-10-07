import React from 'react';

const BedCapacity = ({ capacity }) => {
  const capacityTypes = [
    { key: 'icu', label: 'ICU Beds', icon: '🏥', color: '#ef4444' },
    { key: 'general', label: 'General Beds', icon: '🛏️', color: '#f59e0b' },
    { key: 'emergency', label: 'Emergency Beds', icon: '🚨', color: '#10b981' }
  ];

  return (
    <div className="capacity-overview">
      {capacityTypes.map(type => (
        <div key={type.key} className="capacity-item">
          <div className="capacity-header">
            <span className="capacity-icon">{type.icon}</span>
            <h4>{type.label}</h4>
          </div>
          
          <div className="capacity-stats">
            <div className="bed-count">
              <span className="occupied">{capacity[type.key]?.occupied || 0}</span>
              <span className="divider">/</span>
              <span className="total">{capacity[type.key]?.total || 0}</span>
            </div>
            
            <div className="capacity-bar">
              <div 
                className="capacity-fill"
                style={{ 
                  width: `${capacity[type.key]?.percentage || 0}%`,
                  backgroundColor: type.color
                }}
              />
            </div>
            
            <div className="percentage">
              {capacity[type.key]?.percentage || 0}% Full
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BedCapacity;