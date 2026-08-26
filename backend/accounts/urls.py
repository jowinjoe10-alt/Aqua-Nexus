from django.urls import path

from .views import (
    RegisterView,
    LoginCheckView,
    VerifyOTPView,
    ResendOTPView,
    UpdateLocationView,
    UpdateProfileView,
    AdminPasswordView,
    FarmerStatsView,
    VendorStatsView,
    FarmerAccountsView,
)


urlpatterns = [

    # =============================
    # Authentication
    # =============================

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


    # =============================
    # Admin Authentication
    # =============================

    path(
        'admin/verify-password/',
        AdminPasswordView.as_view()
    ),


    # =============================
    # Farmer Statistics
    # =============================

    path(
        'admin/farmer-stats/',
        FarmerStatsView.as_view()
    ),


    # =============================
    # Vendor Statistics
    # =============================

    path(
        'admin/vendor-stats/',
        VendorStatsView.as_view()
    ),


    # =============================
    # Farmer Accounts
    # =============================

    path(
        'admin/farmers/',
        FarmerAccountsView.as_view()
    ),

    path(
        'admin/farmers/<int:farmer_id>/',
        FarmerAccountsView.as_view()
    ),


    # =============================
    # Account
    # =============================

    path(
        'account/location/',
        UpdateLocationView.as_view()
    ),

    path(
        'account/profile/',
        UpdateProfileView.as_view()
    ),

]