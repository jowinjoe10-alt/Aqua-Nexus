from django.urls import path
from .views import RegisterView, LoginCheckView, VerifyOTPView


urlpatterns = [

    path('register/', RegisterView.as_view()),

    path('login/check/', LoginCheckView.as_view()),

    path('login/verify-otp/', VerifyOTPView.as_view()),

]
