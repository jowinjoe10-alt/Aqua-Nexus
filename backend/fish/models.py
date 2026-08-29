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


class FishStage(models.Model):

    fish = models.ForeignKey(
        Fish,
        on_delete=models.CASCADE,
        related_name='stages'
    )

    stage_number = models.PositiveIntegerField()

    image = models.ImageField(
        upload_to='fish_stage_images/',
        blank=True,
        null=True
    )

    duration_days = models.PositiveIntegerField()

    min_weight = models.DecimalField(
       max_digits=8,
       decimal_places=2,
       blank=True,
       null=True
    )

    max_weight = models.DecimalField(
       max_digits=8,
       decimal_places=2,
       blank=True,
       null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=['fish', 'stage_number'],
                name='unique_fish_stage'
            )
        ]

    def __str__(self):

        return f'{self.fish.name} - Stage {self.stage_number}'


class FeedRecommendation(models.Model):
    fish_stage = models.ForeignKey(
        FishStage,
        on_delete=models.CASCADE,
        related_name="feed_recommendations"
    )

    feed_name = models.CharField(
       max_length=100,
       blank=True,
       null=True
    )

    feed_type = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    feed_form = models.CharField(
        max_length=100
    )

    protein_min = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    protein_max = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    particle_size_min = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    particle_size_max = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    is_organic = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.fish_stage} - {self.feed_name}"