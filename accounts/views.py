from rest_framework.response import Response
from .serializers import (Register_serializer,
                          Login_serializer,
                          Create_password_reset_token_serializer,
                          Reset_password_serializer)
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication
import jwt
from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template import loader
from django.shortcuts import render
from django.conf import settings
from jwt.exceptions import InvalidTokenError

# Create your views here.


@api_view(['POST'])
def register_view(request, *args, **kwargs):
    register_serializer = Register_serializer(data=request.data)
    if register_serializer.is_valid(raise_exception=True):
        jwt_token, email = register_serializer.save()
        print(jwt_token)
        # try:
        html_message = loader.render_to_string('emails/emailverification.html', {
            "confirmation_link": f"{settings.HOMEPAGE}/confirmregistration?token=" + jwt_token
        })
        send_mail(subject="confirm registration", recipient_list=[
            email], html_message=html_message, message="email verification", from_email='emailtesting17082000@gmail.com', fail_silently=False)
        return Response({"success": True})
        # except:
        #     return Response({"error": "error while sending email"})


@api_view(['POST'])
def login_view(request, *args, **kwargs):
    print(request)
    login_serializer = Login_serializer(data=request.data)
    if login_serializer.is_valid(raise_exception=True):
        user, token = login_serializer.validated_data
        print(token[1])
        return Response({"username": user.username, "email": user.email, "token": token[1]})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_view(request, *args, **kwargs):
    return Response({"username": request.user.username, "email": request.user.email})


@api_view(['POST'])
def confirm_registration_view(request, *args, **kwargs):
    jwt_token = request.data.get("jwt_token")
    try:
        decoded = jwt.decode(jwt_token, settings.JWT_SECRET_KEY)

    except InvalidTokenError:
        return Response({"non_field_errors": ['Invalid Token']}, status=403)

    username = decoded["username"]
    email = decoded["email"]
    qs = User.objects.filter(username=username, email=email)
    if not qs.exists():
        return Response({"non_field_errors": ["user doesnt exists"]})
    user = qs.first()
    user.is_active = True
    user.save()
    return Response({"success": True})


@api_view(['POST', 'UPDATE'])
def create_password_reset_token_view(request, *args, **kwargs):
    create_password_reset_token_serializer = Create_password_reset_token_serializer(
        data=request.data)
    if(create_password_reset_token_serializer.is_valid(raise_exception=True)):
        return Response({"success": True})


@api_view(['POST', 'UPDATE'])
def reset_password_view(request, *args, **kwargs):
    # print(request.data)
    reset_password_serializer = Reset_password_serializer(data=request.data)
    if reset_password_serializer.is_valid(raise_exception=True):
        return Response({"success": True})
