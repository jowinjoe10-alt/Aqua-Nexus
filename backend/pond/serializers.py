from rest_framework import serializers
from fish.serializers import FeedRecommendationSerializer

from .models import (
    Pond,
    PondFish,
    Notification,
)


# =========================================================
# Pond Fish Serializer
# =========================================================

class PondFishSerializer(
    serializers.ModelSerializer
):

    fish_name = serializers.CharField(
        source='fish.name',
        read_only=True
    )

    stage_number = serializers.IntegerField(
        source='current_stage.stage_number',
        read_only=True
    )

    min_weight = serializers.DecimalField(
        source='current_stage.min_weight',
        max_digits=8,
        decimal_places=2,
        read_only=True
    )

    max_weight = serializers.DecimalField(
        source='current_stage.max_weight',
        max_digits=8,
        decimal_places=2,
        read_only=True
    )

    feed_recommendations = FeedRecommendationSerializer(
        source='current_stage.feed_recommendations',
        many=True,
        read_only=True
    )

    class Meta:

        model = PondFish

        fields = [
            'id',
            'pond',
            'fish',
            'fish_name',
            'quantity',
            'current_stage',
            'stage_number',
            'min_weight',
            'max_weight',
            'feed_recommendations',
            'stage_started_at',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'pond',
            'fish_name',
            'stage_number',
            'min_weight',
            'max_weight',
            'feed_recommendations',
            'created_at',
            'updated_at',
        ]


# =========================================================
# Pond Serializer
# =========================================================

class PondSerializer(
    serializers.ModelSerializer
):

    fish = PondFishSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Pond

        fields = [
            'id',
            'farmer',
            'name',
            'created_at',
            'updated_at',
            'fish',
        ]

        read_only_fields = [
            'id',
            'farmer',
            'created_at',
            'updated_at',
            'fish',
        ]


# =========================================================
# Notification Serializer
# =========================================================

class NotificationSerializer(
    serializers.ModelSerializer
):

    recipient_name = serializers.CharField(
        source='recipient.name',
        read_only=True
    )

    pond_name = serializers.CharField(
        source='pond.name',
        read_only=True
    )

    fish_name = serializers.CharField(
        source='fish.name',
        read_only=True
    )

    old_stage_number = serializers.IntegerField(
        source='old_stage.stage_number',
        read_only=True
    )

    new_stage_number = serializers.IntegerField(
        source='new_stage.stage_number',
        read_only=True
    )

    class Meta:

        model = Notification

        fields = [
            'id',
            'recipient',
            'recipient_name',
            'pond',
            'pond_name',
            'fish',
            'fish_name',
            'old_stage',
            'old_stage_number',
            'new_stage',
            'new_stage_number',
            'message',
            'is_read',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'recipient',
            'recipient_name',
            'pond',
            'pond_name',
            'fish',
            'fish_name',
            'old_stage',
            'old_stage_number',
            'new_stage',
            'new_stage_number',
            'message',
            'created_at',
        ]