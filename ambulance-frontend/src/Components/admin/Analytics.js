import React from 'react';

const Analytics = () => {
  // Simple bar chart data
  const barData = [
    { day: 'Day 1', responseTime: 7 },
    { day: 'Day 2', responseTime: 8 },
    { day: 'Day 3', responseTime: 6 },
    { day: 'Day 4', responseTime: 9 },
    { day: 'Day 5', responseTime: 7 },
    { day: 'Day 6', responseTime: 5 },
    { day: 'Day 7', responseTime: 6 },
  ];

  const maxResponseTime = Math.max(...barData.map(d => d.responseTime));

  // Pie chart data for incident types
  const pieData = [
    { type: 'Cardiac', count: 35, color: '#ef4444' },
    { type: 'Trauma', count: 25, color: '#f59e0b' },
    { type: 'Respiratory', count: 20, color: '#10b981' },
    { type: 'Other', count: 20, color: '#6b7280' },
  ];

  const totalIncidents = pieData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="analytics">
      <div className="charts-container">
        <div className="chart-section">
          <h3>Response Time Trends</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {barData.map((d, i) => (
                <div key={i} className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ height: `${(d.responseTime / maxResponseTime) * 100}%` }}
                    title={`Response Time: ${d.responseTime} min`}
                  ></div>
                  <div className="bar-label">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-section">
          <h3>Incident Types</h3>
          <div className="chart-container">
            <div className="pie-chart">
              {pieData.map((d, i) => {
                const angle = (d.count / totalIncidents) * 360;
                const prevAngle = pieData.slice(0, i).reduce((sum, p) => sum + (p.count / totalIncidents) * 360, 0);
                return (
                  <div
                    key={i}
                    className="pie-slice"
                    style={{
                      background: `conic-gradient(${d.color} ${prevAngle}deg ${prevAngle + angle}deg, transparent ${prevAngle + angle}deg)`,
                    }}
                    title={`${d.type}: ${d.count} incidents`}
                  ></div>
                );
              })}
              <div className="pie-center"></div>
            </div>
            <div className="pie-legend">
              {pieData.map((d, i) => (
                <div key={i} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: d.color }}></div>
                  <span>{d.type}: {d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="analytics-summary">
        <div className="summary-item">
          <span className="label">Success Rate:</span>
          <span className="value">98.5%</span>
        </div>
        <div className="summary-item">
          <span className="label">Avg. Dispatch Time:</span>
          <span className="value">4.2 min</span>
        </div>
        <div className="summary-item">
          <span className="label">Patient Satisfaction:</span>
          <span className="value">4.8/5</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
