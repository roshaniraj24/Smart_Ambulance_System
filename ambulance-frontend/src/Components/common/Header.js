import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = ({ title, onMenuToggle, showNotifications }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const themes = {
    'teal': '#14b8a6',
    'pink': '#ec4899',
    'light-blue': '#60a5fa',
    'green': '#22c55e',
    'purple': '#8b5cf6',
    'red': '#ef4444',
    'orange': '#fb923c',
    'black': '#111827',
    'gray': '#94a3b8'
  };
  const [appliedTheme, setAppliedTheme] = useState('teal');
  const [previousTheme, setPreviousTheme] = useState(null);
  const [pendingTheme, setPendingTheme] = useState('teal');
  const [notifications] = useState([
    { id: 1, message: 'Emergency case assigned', time: '2 mins ago', type: 'critical' },
    { id: 2, message: 'Hospital capacity updated', time: '5 mins ago', type: 'info' },
    { id: 3, message: 'System maintenance scheduled', time: '1 hour ago', type: 'warning' }
  ]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'driver':
        return 'Ambulance Driver';
      case 'hospital':
        return 'Hospital Staff';
      case 'admin':
        return 'System Administrator';
      default:
        return role;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const toggleNotifications = useCallback(() => {
    setShowNotificationPanel(prev => !prev);
  }, []);

  useEffect(() => {
    const onGlobalToggle = () => toggleNotifications();
    window.addEventListener('global-toggle-notifications', onGlobalToggle);
    return () => window.removeEventListener('global-toggle-notifications', onGlobalToggle);
  }, [toggleNotifications]);

  // Initialize theme state from DOM/localStorage
  useEffect(() => {
    const current = document.body.getAttribute('data-theme') || localStorage.getItem('theme') || 'teal';
    setAppliedTheme(current);
    setPendingTheme(current);
  }, []);

  // When opening dropdown, sync pending with applied
  useEffect(() => {
    if (showDropdown) {
      setPendingTheme(appliedTheme);
    }
  }, [showDropdown, appliedTheme]);

  const applyTheme = () => {
    if (!pendingTheme || pendingTheme === appliedTheme) return;
    setPreviousTheme(appliedTheme);
    setAppliedTheme(pendingTheme);
    window.dispatchEvent(new CustomEvent('set-theme', { detail: { theme: pendingTheme } }));
  };

  const resetTheme = () => {
    setPendingTheme('teal');
  };

  const undoTheme = () => {
    if (!previousTheme) return;
    setPendingTheme(previousTheme);
    setAppliedTheme(previousTheme);
    window.dispatchEvent(new CustomEvent('set-theme', { detail: { theme: previousTheme } }));
  };

  return (
    <>
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="header-title">
          <h2>{title}</h2>
          <p className="header-subtitle">
            {getGreeting()}, {user?.name}
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Current Time */}
        <div className="current-time">
          <span>{new Date().toLocaleTimeString()}</span>
        </div>

        {/* Notifications */}
        {showNotifications && (
          <div className="notification-container">
            <button
              className="notification-button"
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
              </svg>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            {showNotificationPanel && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button onClick={() => setShowNotificationPanel(false)}>×</button>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.type}`}>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        <div className="user-profile">
          {/* Dark/Light toggle */}
          <button
            className="notification-button"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-mode'))}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
            </svg>
          </button>
          <button
            className="profile-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{getRoleDisplayName(user?.role)}</span>
            </div>
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="avatar-large">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="dropdown-name">{user?.name}</p>
                  <p className="dropdown-email">{user?.email}</p>
                  <p className="dropdown-role">{getRoleDisplayName(user?.role)}</p>
                </div>
              </div>
              <div className="dropdown-menu">
                
                <button className="dropdown-item" onClick={() => setActiveModal('profile')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                  Profile Settings
                </button>
                <button className="dropdown-item" onClick={() => setActiveModal('settings')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor"/>
                  </svg>
                  Settings
                </button>
                <button className="dropdown-item" onClick={() => setActiveModal('support')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5H10.6C9.68 5 8.76 5.06 7.83 5.17L10.5 2.5L9 1L3 7V9C3 11.76 5.24 14 8 14H9V22H11V14H13V22H15V14H16C18.76 14 21 11.76 21 9Z" fill="currentColor"/>
                  </svg>
                  Help & Support
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {activeModal && (
      <div className="forgot-modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
          {activeModal === 'profile' && (
            <div>
              <div className="modal-header">
                <h3>Profile Settings</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
              </div>
              <div className="form-group">
                <label className="form-label">Primary Phone</label>
                <input className="form-input" placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">Add Alternate Phone</label>
                <input className="form-input" placeholder="Add another number" />
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
                <button className="btn btn-primary">Save</button>
              </div>
            </div>
          )}
          {activeModal === 'settings' && (
            <div>
              <div className="modal-header">
                <h3>Application Settings</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
              </div>
              <div className="form-group">
                <label className="form-label">Theme</label>
                <select className="form-select">
                  <option>Teal</option>
                  <option>Blue</option>
                  <option>Purple</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notifications</label>
                <select className="form-select">
                  <option>All</option>
                  <option>Critical Only</option>
                  <option>Muted</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
                <button className="btn btn-primary">Save</button>
              </div>
            </div>
          )}
          {activeModal === 'support' && (
            <div>
              <div className="modal-header">
                <h3>Help & Support</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
              </div>
              <div className="card">
                <p>Emergency Hotline: 108</p>
                <p>Dispatch Center: +91 80-1234-5678</p>
                <p>Medical Director: med.director@hospital.example</p>
                <div className="modal-actions">
                  <a className="btn btn-primary" href="tel:+918012345678">Call Dispatch</a>
                  <a className="btn btn-secondary" href="mailto:support@ambulancetrack.example">Email Support</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default Header;