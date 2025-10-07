import otpService from './otpService';

// Mock database for users
const mockUsers = new Map();

// Mock API responses with realistic delays
const mockApi = {
  // Signup endpoint
  signup: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { email, phone, firstName, lastName, username, password, role } = userData;

        // Check if user already exists
        if (mockUsers.has(email)) {
          resolve({
            success: false,
            error: 'User with this email already exists'
          });
          return;
        }

        // Check if username already exists
        for (let user of mockUsers.values()) {
          if (user.username === username) {
            resolve({
              success: false,
              error: 'Username already taken'
            });
            return;
          }
        }

        // Create new user (activated immediately)
        const newUser = {
          id: Date.now().toString(),
          firstName,
          lastName,
          username,
          email,
          phone,
          role,
          password: password, // In production, hash this password
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        mockUsers.set(email, newUser);

        resolve({
          success: true,
          message: 'Account created successfully!',
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        });
      }, 1000); // Simulate network delay
    });
  },

  // Send OTP endpoint
  sendOtp: async ({ email, phone, method }) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          let result;
          
          if (method === 'email') {
            result = await otpService.sendEmailOTP(email);
          } else if (method === 'phone') {
            result = await otpService.sendSMSOTP(phone);
          } else {
            resolve({
              success: false,
              error: 'Invalid verification method'
            });
            return;
          }

          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to send OTP'
          });
        }
      }, 500);
    });
  },

  // Verify OTP endpoint
  verifyOtp: async ({ email, otp, method }) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const identifier = method === 'phone' ? 
            mockUsers.get(email)?.phone : email;
          
          const result = await otpService.verifyOTP(identifier, otp, method);
          
          if (result.success) {
            // Activate user account
            const user = mockUsers.get(email);
            if (user) {
              user.isVerified = true;
              user.verifiedAt = new Date().toISOString();
              mockUsers.set(email, user);
            }
          }

          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: 'OTP verification failed'
          });
        }
      }, 800);
    });
  },

  // Login endpoint (existing users + new verified users)
  login: async ({ email, password, role }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check demo accounts first
        const demoAccounts = {
          'driver@demo.com': { password: 'demo123', role: 'driver', fullName: 'Demo Driver' },
          'hospital@demo.com': { password: 'demo123', role: 'hospital', fullName: 'Demo Hospital' },
          'admin@demo.com': { password: 'demo123', role: 'admin', fullName: 'Demo Admin' }
        };

        const demoUser = demoAccounts[email];
        if (demoUser && demoUser.password === password && demoUser.role === role) {
          resolve({
            success: true,
            user: {
              id: `demo_${role}`,
              fullName: demoUser.fullName,
              email,
              role,
              isDemo: true
            },
            token: `demo_token_${Date.now()}`
          });
          return;
        }

        // Check registered users
        const user = mockUsers.get(email);
        if (!user) {
          resolve({
            success: false,
            error: 'User not found'
          });
          return;
        }

        if (!user.isVerified) {
          resolve({
            success: false,
            error: 'Please verify your account with OTP first'
          });
          return;
        }

        if (user.password !== password) {
          resolve({
            success: false,
            error: 'Invalid password'
          });
          return;
        }

        if (user.role !== role) {
          resolve({
            success: false,
            error: 'Invalid role selected'
          });
          return;
        }

        resolve({
          success: true,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
          },
          token: `token_${user.id}_${Date.now()}`
        });
      }, 1200); // Simulate network delay
    });
  },

  // Forgot password endpoint
  forgotPassword: async ({ value, method }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user exists with the provided email or phone
        let userFound = false;
        for (let user of mockUsers.values()) {
          if (method === 'email' && user.email === value) {
            userFound = true;
            break;
          } else if (method === 'phone' && user.phone === value) {
            userFound = true;
            break;
          }
        }

        if (!userFound) {
          resolve({
            success: false,
            error: 'No account found with this information'
          });
          return;
        }

        // In a real app, this would send an email/SMS with reset link
        resolve({
          success: true,
          message: `Password reset link sent to your ${method}`
        });
      }, 800); // Simulate network delay
    });
  }
};

// Override fetch for our mock endpoints
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  // Handle our mock API endpoints
  if (url === '/api/signup' && options?.method === 'POST') {
    const data = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => await mockApi.signup(data)
    };
  }

  if (url === '/api/send-otp' && options?.method === 'POST') {
    const data = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => await mockApi.sendOtp(data)
    };
  }

  if (url === '/api/verify-otp' && options?.method === 'POST') {
    const data = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => await mockApi.verifyOtp(data)
    };
  }

  if (url === '/api/login' && options?.method === 'POST') {
    const data = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => await mockApi.login(data)
    };
  }

  if (url === '/api/forgot-password' && options?.method === 'POST') {
    const data = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => await mockApi.forgotPassword(data)
    };
  }

  // For all other requests, use original fetch
  return originalFetch(url, options);
};

export default mockApi;