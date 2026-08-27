from django.db import models


class Fish(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    image = models.ImageField(
        upload_to='fish_images/',
        blank=True,
        null=True
    )

    water_type = models.CharField(
        max_length=50
    )

    feeding_habit = models.CharField(
        max_length=50
    )

    temperature_min = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    temperature_max = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    ph_min = models.DecimalField(
        max_digits=4,
        decimal_places=2
    )

    ph_max = models.DecimalField(
        max_digits=4,
        decimal_places=2
    )

    culture_period_days = models.PositiveIntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name