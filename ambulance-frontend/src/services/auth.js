import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('authentication/login/', {
      username,
      password,
    });

    if (response.data.success) {
      const { token, user } = response.data;
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return {
        success: true,
        user,
        token,
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Login failed',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Network error',
    };
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('authentication/signup/', {
      username: userData.username,
      email: userData.email,
      phone_number: userData.phone,
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_type: userData.role,
      password: userData.password,
      confirm_password: userData.confirmPassword,
    });

    if (response.data.success) {
      return {
        success: true,
        user: response.data,
      };
    } else {
      return {
        success: false,
        error: response.data.errors || 'Signup failed',
      };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.response?.data?.errors || 'Network error',
    };
  }
};

export const forgotPassword = async (identifier) => {
  try {
    const response = await api.post('authentication/forgot-password/', {
      identifier,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        error: response.data.errors || 'Failed to send reset link',
      };
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      error: error.response?.data?.errors || 'Network error',
    };
  }
};
