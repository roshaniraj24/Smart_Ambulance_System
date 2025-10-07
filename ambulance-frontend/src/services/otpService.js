// OTP Service - Simulates backend OTP functionality
class OtpService {
  constructor() {
    this.otpStorage = new Map(); // In production, use a proper database
    this.otpExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Generate a 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via email (simulated)
  async sendEmailOTP(email) {
    try {
      const otp = this.generateOTP();
      const expiryTime = Date.now() + this.otpExpiry;
      
      // Store OTP with expiry
      this.otpStorage.set(`email_${email}`, {
        otp,
        expiryTime,
        attempts: 0
      });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In development, log the OTP (remove in production)
      console.log(`📧 Email OTP for ${email}: ${otp}`);

      return {
        success: true,
        message: `OTP sent to ${email}`,
        // In development only - remove in production
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email OTP'
      };
    }
  }

  // Send OTP via SMS (simulated)
  async sendSMSOTP(phone) {
    try {
      const otp = this.generateOTP();
      const expiryTime = Date.now() + this.otpExpiry;
      
      // Store OTP with expiry
      this.otpStorage.set(`phone_${phone}`, {
        otp,
        expiryTime,
        attempts: 0
      });

      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In development, log the OTP (remove in production)
      console.log(`📱 SMS OTP for ${phone}: ${otp}`);

      return {
        success: true,
        message: `OTP sent to ${phone}`,
        // In development only - remove in production
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send SMS OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(identifier, otp, method = 'email') {
    try {
      const key = `${method}_${identifier}`;
      const storedData = this.otpStorage.get(key);

      if (!storedData) {
        return {
          success: false,
          message: 'OTP not found or expired'
        };
      }

      // Check if OTP has expired
      if (Date.now() > storedData.expiryTime) {
        this.otpStorage.delete(key);
        return {
          success: false,
          message: 'OTP has expired'
        };
      }

      // Check attempts limit
      if (storedData.attempts >= 3) {
        this.otpStorage.delete(key);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP'
        };
      }

      // Verify OTP
      if (storedData.otp === otp) {
        this.otpStorage.delete(key);
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        // Increment attempts
        storedData.attempts += 1;
        this.otpStorage.set(key, storedData);
        
        return {
          success: false,
          message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'OTP verification failed'
      };
    }
  }

  // Clean expired OTPs (should be called periodically)
  cleanExpiredOTPs() {
    const now = Date.now();
    for (const [key, data] of this.otpStorage.entries()) {
      if (now > data.expiryTime) {
        this.otpStorage.delete(key);
      }
    }
  }

  // Get remaining time for OTP
  getOTPRemainingTime(identifier, method = 'email') {
    const key = `${method}_${identifier}`;
    const storedData = this.otpStorage.get(key);
    
    if (!storedData) return 0;
    
    const remaining = storedData.expiryTime - Date.now();
    return Math.max(0, Math.floor(remaining / 1000)); // Return seconds
  }
}

// Create singleton instance
const otpService = new OtpService();

// Clean expired OTPs every minute
setInterval(() => {
  otpService.cleanExpiredOTPs();
}, 60 * 1000);

export default otpService;