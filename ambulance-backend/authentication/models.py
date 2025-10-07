from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

class OTP(models.Model):
    identifier = models.CharField(max_length=255)  # email or phone
    otp_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        app_label = 'authentication'
    
    def __str__(self):
        return f"OTP for {self.identifier}: {self.otp_code}"
    
    @classmethod
    def generate_otp(cls):
        return ''.join(random.choices(string.digits, k=6))
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @classmethod
    def create_otp(cls, identifier, expiry_minutes=5):
        # Delete existing unused OTPs for this identifier
        cls.objects.filter(identifier=identifier, is_used=False).delete()
        
        otp_code = cls.generate_otp()
        expires_at = timezone.now() + timedelta(minutes=expiry_minutes)
        
        return cls.objects.create(
            identifier=identifier,
            otp_code=otp_code,
            expires_at=expires_at
        )