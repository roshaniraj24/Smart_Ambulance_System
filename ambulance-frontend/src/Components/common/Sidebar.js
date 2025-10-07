import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = ({ title, items, userRole, onClose, onSelect }) => {
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    onSelect?.(itemId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'driver':
        return '#3b82f6'; // Blue
      case 'hospital':
        return '#10b981'; // Green
      case 'admin':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ backgroundColor: getRoleColor() }}>
            🚑
          </div>
          <div className="logo-text">
            <h3>AmbulanceTrack</h3>
            <p>{title}</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button className="sidebar-close" onClick={onClose}>
          ×
        </button>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="user-avatar" style={{ backgroundColor: getRoleColor() }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="user-details">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
          <div className="user-status">
            <div className="status-indicator online"></div>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {items.map(item => (
            <li key={item.id} className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Emergency Button (for drivers and hospitals) */}
      {(userRole === 'driver' || userRole === 'hospital') && (
        <div className="sidebar-emergency">
          <button className="emergency-button">
            <span className="emergency-icon">🚨</span>
            <span>Emergency Alert</span>
          </button>
        </div>
      )}

      {/* System Status (for admins) */}
      {userRole === 'admin' && (
        <div className="sidebar-status">
          <h4>System Status</h4>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>API Server</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Database</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>MQTT Broker</span>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <span>Backup Service</span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-stats">
          <div className="stat">
            <span className="stat-value">
              {userRole === 'driver' ? '12' : 
               userRole === 'hospital' ? '85%' : 
               '24/7'}
            </span>
            <span className="stat-label">
              {userRole === 'driver' ? 'Trips Today' : 
               userRole === 'hospital' ? 'Capacity' : 
               'Uptime'}
            </span>
          </div>
        </div>
        
        <div className="footer-actions">
          <button className="footer-button" title="Settings">
            ⚙️
          </button>
          <button className="footer-button" title="Help">
            ❓
          </button>
          <button className="footer-button logout" onClick={handleLogout} title="Logout">
            🚪
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;