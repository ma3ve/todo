from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from knox.models import AuthToken
import jwt
from django.conf import settings
from django.core.mail import send_mail
from django.template import loader
from jwt.exceptions import InvalidTokenError


class Register_serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}, 'email': {
            'required': True
        }}

    def create(self, validated_data):
        user = User(username=validated_data["username"],
                    email=validated_data["email"], is_active=False)
        user.set_password(validated_data['password'])
        user.save()
        jwt_token = jwt.encode(
            {"username": user.username, "email": user.email}, settings.JWT_SECRET_KEY).decode('utf-8')
        # jwt_token = jwt_token.decode('utf-8')
        email = user.email
        return jwt_token, email


class Login_serializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            token = AuthToken.objects.create(user=user)
            return user, token

        raise serializers.ValidationError("Incorrect credentials")


class Create_password_reset_token_serializer(serializers.Serializer):
    username = serializers.CharField(required=True)

    def validate(self, data):
        qs = User.objects.filter(username=data["username"])
        if not qs.exists():
            raise serializers.ValidationError("username_doesnt_exists")
        user = qs.first()

        jwt_token = jwt.encode({"username": user.username},
                               key=settings.JWT_SECRET_KEY).decode('utf-8')

        html_message = loader.render_to_string('emails/emailpasswordreset.html', {
            "jwt_token": f"{settings.HOMEPAGE}/resetpassword?token=" + jwt_token
        })
        print(user.email)
        send_mail(subject='reset password', message='reset password token', recipient_list=[
                  user.email], html_message=html_message, from_email='emailtesting17082000@gmail.com')
        return True


class Reset_password_serializer(serializers.Serializer):
    jwt_token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, data):

        try:
            decoded = jwt.decode(data["jwt_token"], settings.JWT_SECRET_KEY)
        except InvalidTokenError:
            raise serializers.ValidationError("Invalid Token")
        qs = User.objects.filter(username=decoded["username"])
        print(decoded["username"])
        if not qs.exists():
            raise serializers.ValidationError("user doesnt exists")
        user = qs.first()
        user.set_password(data['new_password'])
        user.save()
        return True
