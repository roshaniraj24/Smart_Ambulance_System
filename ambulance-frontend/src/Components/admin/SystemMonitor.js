import React from 'react';

const SystemMonitor = () => {
  const systemStatus = [
    { name: 'Server Status', status: 'Online', color: '#10b981' },
    { name: 'Database', status: 'Connected', color: '#10b981' },
    { name: 'GPS Tracking', status: 'Active', color: '#10b981' },
    { name: 'Communication', status: 'Stable', color: '#f59e0b' },
    { name: 'Backup System', status: 'Ready', color: '#10b981' }
  ];

  return (
    <div className="system-monitor">
      <h3>System Health</h3>
      <div className="status-indicators">
        {systemStatus.map((item, index) => (
          <div key={index} className="status-item">
            <div className="status-dot" style={{ backgroundColor: item.color }}></div>
            <span className="status-name">{item.name}</span>
            <span className="status-value">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemMonitor;
