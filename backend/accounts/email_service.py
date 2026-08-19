import resend

from django.conf import settings


def send_email(to_email, subject, message):
    resend.api_key = settings.RESEND_API_KEY

    response = resend.Emails.send({
        'from': 'onboarding@resend.dev',
        'to': [to_email],
        'subject': subject,
        'html': f'<p>{message}</p>',
    })

    return response