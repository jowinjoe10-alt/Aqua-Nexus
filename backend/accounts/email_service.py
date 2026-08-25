from django.core.mail import send_mail
from django.conf import settings


def send_email(to_email, subject, message):

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [to_email],
            fail_silently=False,
        )

        return True, 'Email sent successfully'

    except Exception as error:
        print('Email sending error:', error)

        return False, error