import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Analytics from './Analytics';

import AnalyticsCards from './AnalyticsCards';
import ActiveIncidents from './ActiveIncidents';
import ActiveIncidentsBarGraph from './ActiveIncidentsBarGraph';
import './AdminDashboard.css';

const AdminDashboard = ({ incidents, setIncidents }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const handleIncidentClick = (incidentId) => {
    navigate(`/patient-data/${incidentId}`);
  };

  useEffect(() => {
    // Mock data for analytics
    const mockAnalyticsData = {
      totalFleet: 25,
      avgResponseTime: 7.5,
      activeCalls: 12,
      completedToday: 18,
      fuelEfficiency: 85,
      pendingMaintenance: 3,
    };
    setDashboardData(mockAnalyticsData);
  }, []);

  useEffect(() => {
    // Mock data for active incidents
    const mockIncidents = [
      {
        id: 'INC001',
        type: 'Cardiac Arrest',
        location: 'Downtown',
        time: '15 mins ago',
        ambulance: 'Ambulance 1',
        priority: 'Critical',
        status: 'En Route',
      },
      {
        id: 'INC002',
        type: 'Road Accident',
        location: 'Highway 50',
        time: '10 mins ago',
        ambulance: 'Ambulance 3',
        priority: 'High',
        status: 'At Scene',
      },
      {
        id: 'INC003',
        type: 'Fire Emergency',
        location: 'Industrial Area',
        time: '5 mins ago',
        ambulance: null,
        priority: 'Medium',
        status: 'Dispatched',
      },
    ];
    setIncidents(mockIncidents);
  }, [setIncidents]);

  if (!dashboardData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>System Overview</h1>
        <p>Real-time monitoring of ambulance operations</p>
      </div>

      <div className="dashboard-grid">
        <div className="analytics-section">
          <h2><strong>Response Time Trends</strong></h2>
          <Analytics showOnly="responseTime" />
        </div>

        <div className="analytics-section">
          <h2><strong>Incident Types</strong></h2>
          <Analytics showOnly="incidentTypes" />
        </div>

        <div className="analytics-section">
          <h2><strong>Total Fleet</strong></h2>
          <div className="data-box">
            <p>{dashboardData.totalFleet}</p>
            <small>+2 this month</small>
          </div>
        </div>

        <div className="analytics-section">
          <h2><strong>Avg Response Time</strong></h2>
          <div className="data-box">
            <p>{dashboardData.avgResponseTime} min</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2><strong>Active Calls</strong></h2>
          <div className="data-box">
            <p>{dashboardData.activeCalls}</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2><strong>Today's Completed Tasks</strong></h2>
          <div className="data-box">
            <p>{dashboardData.completedToday}</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2><strong>Fuel Efficiency</strong></h2>
          <div className="data-box">
            <p>{dashboardData.fuelEfficiency}%</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2><strong>Pending Maintenance</strong></h2>
          <div className="data-box">
            <p>{dashboardData.pendingMaintenance}</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2><strong>Active Incidents</strong></h2>
          {incidents.length > 0 ? (
            <>
              <ActiveIncidentsBarGraph incidents={incidents} />
              <ActiveIncidents incidents={incidents} onIncidentClick={handleIncidentClick} />
            </>
          ) : (
            <p>No active incidents data available.</p>
          )}
        </div>
      </div>

      {/* Removed detailed active incidents list as per user request */}
    </div>
  );
};

export default AdminDashboard;
