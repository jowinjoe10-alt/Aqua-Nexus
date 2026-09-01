from django.db import models

from accounts.models import Account
from fish.models import Fish, FishStage


class Pond(models.Model):

    farmer = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='ponds'
    )

    name = models.CharField(
        max_length=100
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.name


class PondFish(models.Model):

    pond = models.ForeignKey(
        Pond,
        on_delete=models.CASCADE,
        related_name='fish'
    )

    fish = models.ForeignKey(
        Fish,
        on_delete=models.CASCADE,
        related_name='pond_entries'
    )

    quantity = models.PositiveIntegerField()

    current_stage = models.ForeignKey(
        FishStage,
        on_delete=models.PROTECT,
        related_name='pond_fish'
    )

    stage_started_at = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f'{self.pond.name} - {self.fish.name}'


class Notification(models.Model):

    recipient = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    pond = models.ForeignKey(
        Pond,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )

    fish = models.ForeignKey(
        Fish,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )

    old_stage = models.ForeignKey(
        FishStage,
        on_delete=models.PROTECT,
        related_name='old_stage_notifications',
        null=True,
        blank=True
    )

    new_stage = models.ForeignKey(
        FishStage,
        on_delete=models.PROTECT,
        related_name='new_stage_notifications',
        null=True,
        blank=True
    )

    message = models.CharField(
        max_length=255
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.message