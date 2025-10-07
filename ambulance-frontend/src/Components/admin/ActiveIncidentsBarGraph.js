import React, { useState } from 'react';
import './ActiveIncidentsBarGraph.css';

const ActiveIncidentsBarGraph = ({ incidents }) => {
  console.log('ActiveIncidentsBarGraph incidents:', incidents);

  // Priority color mapping
  const priorityColors = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#10b981',
    low: '#6b7280',
  };

  // Aggregate incidents by priority for bar graph
  const priorityCounts = (incidents || []).reduce((acc, incident) => {
    const priority = incident.priority.toLowerCase();
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  console.log('ActiveIncidentsBarGraph priorityCounts:', priorityCounts);

  const maxCount = Math.max(...Object.values(priorityCounts), 1);

  return (
    <div className="active-incidents-bar-graph-container add-incident-form-container">
      {/* Bar Graph */}
      <div className="active-incidents-bar-graph" style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '100px', marginBottom: '10px' }}>
        {Object.entries(priorityCounts).map(([priority, count]) => (
          <div key={priority} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '30px',
                height: `${(count / maxCount) * 80}%`,
                backgroundColor: priorityColors[priority] || '#6b7280',
                borderRadius: '3px',
                transition: 'height 0.3s ease',
              }}
              title={`${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${count}`}
            ></div>
            <div style={{ marginTop: '5px', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '12px' }}>{priority}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveIncidentsBarGraph;
