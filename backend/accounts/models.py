from django.db import models


ROLE_CHOICES = [
    ('farmer', 'Farmer'),
    ('vendor', 'Vendor'),
    ('admin', 'Admin'),
]


class Account(models.Model):
    name = models.CharField(max_length=100)

    gmail = models.EmailField(
        unique=True
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES
    )

    password = models.CharField(
        max_length=128,
        blank=True
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        blank=True
    )

    mobile_number = models.CharField(
        max_length=15,
        blank=True
    )

    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class OTP(models.Model):

    gmail = models.EmailField()

    code = models.CharField(
        max_length=6
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField()

    last_sent_at = models.DateTimeField()

    resend_count = models.IntegerField(
        default=0
    )

    resend_date = models.DateField()