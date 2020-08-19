from django.urls import path
from .views import (register_view,
                    get_user_view,
                    login_view, confirm_registration_view,
                    create_password_reset_token_view,
                    reset_password_view)
from knox.views import LogoutView

urlpatterns = [
    path("", get_user_view),
    path("register/", register_view),
    path("login/", login_view),
    path("logout/", LogoutView.as_view(), name="LogoutView"),
    path("confirmregistration/", confirm_registration_view),
    path("resetpassword/getusername/", create_password_reset_token_view),
    path("resetpassword/", reset_password_view),
]
