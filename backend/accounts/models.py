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