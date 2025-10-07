from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
import re

User = get_user_model()

class SendOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=255)
    
    def validate_identifier(self, value):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        phone_pattern = r'^\+?[1-9]\d{1,14}$'
        
        if not (re.match(email_pattern, value) or re.match(phone_pattern, value.replace(' ', '').replace('-', ''))):
            raise serializers.ValidationError("Please enter a valid email address or phone number.")
        
        return value

class VerifyOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=255)
    otp = serializers.CharField(max_length=6, min_length=6)

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone_number', 'first_name', 'last_name',
                 'user_type', 'password', 'confirm_password')
        extra_kwargs = {
            'email': {'required': False},
            'phone_number': {'required': False},
        }

    def validate_password(self, value):
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")

        if not attrs.get('email') and not attrs.get('phone_number'):
            raise serializers.ValidationError("Either email or phone number is required.")

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class ForgotPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()
