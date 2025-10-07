import re
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
from .models import OTP

class OTPService:
    def __init__(self):
        if hasattr(settings, 'TWILIO_ACCOUNT_SID') and settings.TWILIO_ACCOUNT_SID:
            self.twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        else:
            self.twilio_client = None
    
    def is_email(self, identifier):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_pattern, identifier) is not None
    
    def is_phone(self, identifier):
        phone_pattern = r'^\+?[1-9]\d{1,14}$'
        return re.match(phone_pattern, identifier.replace(' ', '').replace('-', '')) is not None
    
    def send_otp(self, identifier):
        """Send OTP via email or SMS"""
        try:
            # Create OTP
            otp_instance = OTP.create_otp(identifier, settings.OTP_EXPIRY_MINUTES)
            
            if self.is_email(identifier):
                return self._send_email_otp(identifier, otp_instance.otp_code)
            elif self.is_phone(identifier):
                return self._send_sms_otp(identifier, otp_instance.otp_code)
            else:
                return False, "Invalid email or phone number format"
                
        except Exception as e:
            return False, f"Failed to send OTP: {str(e)}"
    
    def _send_email_otp(self, email, otp_code):
        """Send OTP via email"""
        try:
            subject = 'Smart Ambulance System - OTP Verification'
            message = f'''
            Your OTP for Smart Ambulance System verification is: {otp_code}
            
            This OTP will expire in {settings.OTP_EXPIRY_MINUTES} minutes.
            
            If you didn't request this, please ignore this email.
            '''
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return True, "OTP sent to email successfully"
            
        except Exception as e:
            # For development, print to console
            print(f"EMAIL OTP for {email}: {otp_code}")
            return True, "OTP sent to email successfully (console)"
    
    def _send_sms_otp(self, phone, otp_code):
        """Send OTP via SMS"""
        try:
            if self.twilio_client:
                message = self.twilio_client.messages.create(
                    body=f"Your Smart Ambulance System OTP is: {otp_code}. Valid for {settings.OTP_EXPIRY_MINUTES} minutes.",
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=phone
                )
                return True, "OTP sent to phone successfully"
            else:
                # For development, print to console
                print(f"SMS OTP for {phone}: {otp_code}")
                return True, "OTP sent to phone successfully (console)"
                
        except Exception as e:
            print(f"SMS OTP for {phone}: {otp_code}")  # Fallback to console
            return True, "OTP sent to phone successfully (console)"
    
    def verify_otp(self, identifier, otp_code):
        """Verify OTP"""
        try:
            otp_instance = OTP.objects.filter(
                identifier=identifier,
                otp_code=otp_code,
                is_used=False
            ).first()
            
            if not otp_instance:
                return False, "Invalid OTP"
            
            if otp_instance.is_expired():
                return False, "OTP has expired"
            
            # Mark OTP as used
            otp_instance.is_used = True
            otp_instance.save()
            
            return True, "OTP verified successfully"
            
        except Exception as e:
            return False, f"OTP verification failed: {str(e)}"