from django.urls import path

from .views import (
    RegisterView,
    LoginCheckView,
    VerifyOTPView,
    ResendOTPView,
    UpdateLocationView,
    UpdateProfileView,
    AdminPasswordView,
)


urlpatterns = [

    path(
        'register/',
        RegisterView.as_view()
    ),

    path(
        'login/check/',
        LoginCheckView.as_view()
    ),

    path(
        'login/verify-otp/',
        VerifyOTPView.as_view()
    ),

    path(
        'login/resend-otp/',
        ResendOTPView.as_view()
    ),

    path(
        'admin/verify-password/',
        AdminPasswordView.as_view()
    ),

    path(
        'account/location/',
        UpdateLocationView.as_view()
    ),

    path(
        'account/profile/',
        UpdateProfileView.as_view()
    ),
]