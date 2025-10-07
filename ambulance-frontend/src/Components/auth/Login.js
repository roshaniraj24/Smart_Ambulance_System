import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'driver'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotMethod, setForgotMethod] = useState('email');
  const [forgotValue, setForgotValue] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const { login: contextLogin, forgotPassword: contextForgotPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // FIXED: Wrap navigateByRole in useCallback to prevent re-renders
  const navigateByRole = useCallback((role) => {
    switch (role) {
      case 'driver':
        navigate('/driver');
        break;
      case 'hospital':
        navigate('/hospital');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  }, [navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigateByRole(user.role);
    }
  }, [user, loading, navigateByRole]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotValue) return;

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess(false);

    try {
      const result = await contextForgotPassword(forgotMethod === 'email' ? forgotValue : `+91${forgotValue}`);
      if (result.success) {
        setForgotSuccess(true);
        setForgotValue('');
      } else {
        setForgotError(result.error || 'Failed to send reset link');
      }
    } catch (error) {
      setForgotError('Failed to send reset link. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
    const result = await contextLogin(formData.email, formData.password, formData.role);
      
      if (result.success) {
        // Auto-redirect will happen via useEffect when user state updates
        // Show brief success message if needed
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const fillDemoCredentials = (role) => {
    const demoCredentials = {
      driver: { email: 'driver@demo.com', password: 'demo123' },
      hospital: { email: 'hospital@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };

    setFormData({
      ...demoCredentials[role],
      role: role
    });
  };

  const getRoleBasedStyle = () => {
    switch (formData.role) {
      case 'driver':
        return {
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          cardBg: 'rgba(255, 255, 255, 0.95)'
        };
      case 'hospital':
        return {
          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          cardBg: 'rgba(255, 255, 255, 0.95)'
        };
      case 'admin':
        return {
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          cardBg: 'rgba(255, 255, 255, 0.95)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBg: 'rgba(255, 255, 255, 0.95)'
        };
    }
  };

  if (loading) {
    return (
      <div className="login-loading">
        <LoadingSpinner size="large" color="white" />
      </div>
    );
  }

  const roleStyle = getRoleBasedStyle();

  return (
    <div className="auth-container" data-role={formData.role}>
      <div className="left-panel">
        <div className="left-content">
          <svg width="200" height="200" viewBox="0 0 200 200" className="ambulance-svg">
            <defs>
              <linearGradient id="ambulanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#6A1B9A', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#9C27B0', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <rect width="180" height="100" rx="10" fill="url(#ambulanceGrad)" />
            <circle cx="50" cy="120" r="20" fill="#FF6B6B" />
            <circle cx="130" cy="120" r="20" fill="#FF6B6B" />
            <rect x="10" y="40" width="40" height="20" fill="#4CAF50" />
            <text x="100" y="60" fontSize="12" fill="white" textAnchor="middle">AMBULANCE</text>
          </svg>
          <div className="branding">
            <h1>Smart Ambulance</h1>
            <p>Join the Emergency Response System</p>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Login</h2>
            <p>Welcome back to AmbulanceTrack</p>
          </div>

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
              <a 
                href="#" 
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotModal(true);
                }}
              >
                Forgot Password?
              </a>
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">Login As</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-select ${errors.role ? 'error' : ''}`}
                disabled={isSubmitting}
              >
                <option value="driver">Ambulance Driver</option>
                <option value="hospital">Hospital Staff</option>
                <option value="admin">System Administrator</option>
              </select>
              {errors.role && <div className="form-error">{errors.role}</div>}
            </div>

            {errors.submit && (
              <div className="alert alert-danger">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="inline-spinner">
                  <LoadingSpinner size="small" color="white" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>

          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <div className="demo-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoCredentials('driver')}
              >
                Driver Demo
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoCredentials('hospital')}
              >
                Hospital Demo
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoCredentials('admin')}
              >
                Admin Demo
              </button>
            </div>
            <p className="demo-info">All demo accounts use password: <strong>demo123</strong></p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="forgot-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Forgot Password?</h3>
              <button className="close-btn" onClick={() => setShowForgotModal(false)}>×</button>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="method-group">
                <label>
                  <input
                    type="radio"
                    name="forgotMethod"
                    value="email"
                    checked={forgotMethod === 'email'}
                    onChange={(e) => setForgotMethod(e.target.value)}
                  />
                  Email
                </label>
                <label>
                  <input
                    type="radio"
                    name="forgotMethod"
                    value="phone"
                    checked={forgotMethod === 'phone'}
                    onChange={(e) => setForgotMethod(e.target.value)}
                  />
                  Phone
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="forgotValue" className="form-label">
                  {forgotMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <input
                  type={forgotMethod === 'email' ? 'email' : 'tel'}
                  id="forgotValue"
                  name="forgotValue"
                  value={forgotValue}
                  onChange={(e) => setForgotValue(e.target.value)}
                  className={`form-input ${forgotError ? 'error' : ''}`}
                  placeholder={forgotMethod === 'email' ? 'Enter your email' : 'Enter your phone'}
                  disabled={forgotLoading}
                />
                {forgotError && <div className="form-error">{forgotError}</div>}
              </div>
              {forgotSuccess && (
                <div className="alert alert-success">
                  Reset link sent to your {forgotMethod}!
                </div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForgotModal(false)}
                  disabled={forgotLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={forgotLoading || !forgotValue}
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;