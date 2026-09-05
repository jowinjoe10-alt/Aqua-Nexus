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

    price = models.DecimalField(
            max_digits=10,
            decimal_places=2
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

class Chat(models.Model):

    farmer = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='farmer_chats'
    )

    vendor = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='vendor_chats'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='chats'
    )

    question = models.TextField()

    reply = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    vendor_replied_at = models.DateTimeField(
        null=True,
        blank=True
    )

    farmer_read_at = models.DateTimeField(
        null=True,
        blank=True
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True
    )