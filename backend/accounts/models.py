from django.db import models


ROLE_CHOICES = [
    ('farmer', 'Farmer'),
    ('vendor', 'Vendor'),
]


class Account(models.Model):
    name = models.CharField(max_length=100)
    gmail = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)



class OTP(models.Model):

    gmail = models.EmailField()

    code = models.CharField(max_length=6)

    created_at = models.DateTimeField(auto_now_add=True)

    expires_at = models.DateTimeField()

    last_sent_at = models.DateTimeField()

    resend_count = models.IntegerField(default=0)

    resend_date = models.DateField()