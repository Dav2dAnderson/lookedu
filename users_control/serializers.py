from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from django.contrib.auth import get_user_model
from django.core.mail import send_mail, get_connection
from django.conf import settings


from .models import CustomUser, ContactMessage


User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "first_name", "last_name", "phone_number", "email", "password", "password_confirm"]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Password fields didn't match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')

        from .models import Roles
        role_user, _ = Roles.objects.get_or_create(name='user')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data['phone_number'],
            email=validated_data.get('email', ''),
            role=role_user,
            have_right_to_add=False # Default to student
        )

        if user.email:
            try:
                send_mail("Welcome!", "Thanks for registering.", settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
            except Exception as e:
                print(f"Registration email failed to send: {e}")

        return user
    

class UserLogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField(write_only=True)

    def validate_refresh(self, value):
        try:
            RefreshToken(value)
        except TokenError:
            return serializers.ValidationError("Invalid refresh token")
        return value
    
    def save(self, **kwargs):
        token = RefreshToken(self.validated_data["refresh"])
        token.blacklist()


class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'phone_number', 'email', 'have_right_to_add')


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['first_name', 'last_name', 'email', 'message']

