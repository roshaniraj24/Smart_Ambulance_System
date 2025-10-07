import React from 'react';

const AnalyticsCards = ({ data }) => {
  const analytics = [
    {
      title: 'Total Fleet',
      value: data.totalFleet,
      icon: '🚑',
      color: '#3b82f6',
      trend: '+2 this month'
    },
    {
      title: 'Available Units',
      value: data.availableUnits,
      icon: '✅',
      color: '#10b981',
      trend: `${Math.round((data.availableUnits / data.totalFleet) * 100)}% ready`
    },
    {
      title: 'Avg Response Time',
      value: `${data.avgResponseTime} min`,
      icon: '⏱️',
      color: '#f59e0b',
      trend: '-1.2 min improved'
    },
    {
      title: 'Active Calls',
      value: data.activeCalls,
      icon: '📞',
      color: '#ef4444',
      trend: 'Real-time'
    },
    {
      title: 'Completed Today',
      value: data.completedToday,
      icon: '✅',
      color: '#8b5cf6',
      trend: '+5 from yesterday'
    },
    {
      title: 'Fuel Efficiency',
      value: `${data.fuelEfficiency}%`,
      icon: '⛽',
      color: '#06b6d4',
      trend: 'Fleet average'
    },
    {
      title: 'Pending Maintenance',
      value: data.pendingMaintenance || 3,
      icon: '🔧',
      color: '#f97316',
      trend: 'Needs attention'
    },
    {
      title: 'Incident Reports',
      value: data.incidentReports || 12,
      icon: '📋',
      color: '#dc2626',
      trend: 'This week'
    },
    {
      title: 'Staff On Duty',
      value: data.staffOnDuty || 28,
      icon: '👥',
      color: '#059669',
      trend: 'All shifts covered'
    },
    {
      title: 'System Uptime',
      value: `${data.systemUptime || 99.8}%`,
      icon: '⚡',
      color: '#7c3aed',
      trend: 'Last 30 days'
    }
  ];

  return (
    <div className="analytics-grid">
      {analytics.map((item, index) => (
        <div key={index} className="analytics-card">
          <div className="card-icon" style={{ color: item.color }}>
            {item.icon}
          </div>
          <div className="card-content">
            <h3>{item.title}</h3>
            <div className="card-value" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="card-trend">
              {item.trend}
            </div>
          </div>
          <div className="card-glow" style={{ background: `${item.color}20` }}></div>
        </div>
      ))}

      </div>
  );
};

export default AnalyticsCards;
