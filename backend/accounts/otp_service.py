import random

from datetime import timedelta
from django.utils import timezone

from .models import OTP
from .email_service import send_email

def generate_otp():
    otp = random.randint(100000, 999999)

    return str(otp)


def create_otp(gmail):
    OTP.objects.filter(gmail=gmail).delete()
    code = generate_otp()
    now = timezone.now()

    otp = OTP.objects.create(
        gmail=gmail,
        code=code,
        expires_at=now + timedelta(minutes=5),
        last_sent_at=now,
        resend_count=0,
        resend_date=now.date()
    )
    email_response = send_email(
       gmail,
       'Aqua Nexus OTP',
       f'Your Aqua Nexus OTP is {code}. It is valid for 5 minutes.'
    )

    return otp

def verify_otp(gmail, entered_code):
    try:
        otp = OTP.objects.get(gmail=gmail)
    except OTP.DoesNotExist:
        return False, 'OTP not found'

    if timezone.now() > otp.expires_at:
        otp.delete()
        return False, 'OTP expired'

    if otp.code != entered_code:
        return False, 'Invalid OTP'

    otp.delete()

    return True, 'OTP verified'