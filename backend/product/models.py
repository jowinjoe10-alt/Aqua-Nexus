from django.db import models
from accounts.models import Account


class Product(models.Model):

    vendor = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='products'
    )

    feed_type = models.CharField(
        max_length=100
    )

    feed_name = models.CharField(
        max_length=100
    )

    brand_name = models.CharField(
        max_length=100
    )

    protein_range = models.CharField(
        max_length=50
    )

    pellet_size = models.CharField(
        max_length=50
    )

    image = models.ImageField(
        upload_to='product_images/',
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f'{self.brand_name} - {self.feed_name}'


class Inventory(models.Model):

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name='inventory'
    )

    initial_quantity = models.PositiveIntegerField()

    quantity = models.PositiveIntegerField()

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f'{self.product.feed_name} - {self.quantity}'