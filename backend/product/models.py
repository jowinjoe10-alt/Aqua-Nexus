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

class VendorAvailability(models.Model):

    vendor = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        related_name='vendor_availability'
    )

    orders_enabled = models.BooleanField(
        default=True
    )

    subscriptions_enabled = models.BooleanField(
        default=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f'{self.vendor.name} - Vendor Availability'  

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

class Order(models.Model):

    STATUS_CHOICES = [
      ('pending', 'Pending'),
      ('accepted', 'Accepted'),
      ('packed', 'Packed'),
      ('reached', 'Reached'),
      ('delivered', 'Delivered'),
      ('rejected', 'Rejected'),
      ('cancelled', 'Cancelled'),
    ]

    farmer = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='farmer_orders'
    )

    vendor = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='vendor_orders'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    quantity = models.PositiveIntegerField()

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f'Order {self.id} - '
            f'{self.product.feed_name}'
        )

class Subscription(models.Model):

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
    ]

    farmer = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='farmer_subscriptions'
    )

    vendor = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='vendor_subscriptions'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f'Subscription {self.id} - '
            f'{self.product.feed_name}'
        )