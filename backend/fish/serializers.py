from rest_framework import serializers
from .models import Fish, FishStage, FeedRecommendation


class FishStageSerializer(
    serializers.ModelSerializer
):

    def validate_stage_number(self, value):

        if value < 1 or value > 6:
            raise serializers.ValidationError(
                "Stage number must be between 1 and 6."
            )

        return value

    class Meta:

        model = FishStage

        fields = [
            'id',
            'fish',
            'stage_number',
            'image',
            'duration_days',
            'min_weight',
            'max_weight',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'fish',
            'duration_days',
            'created_at',
        ]

        extra_kwargs = {
            'image': {
                'required': False,
                'allow_null': True,
            },
        }


class FishSerializer(
    serializers.ModelSerializer
):

    stages = FishStageSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Fish

        fields = [
            'id',
            'name',
            'image',
            'water_type',
            'feeding_habit',
            'temperature_min',
            'temperature_max',
            'ph_min',
            'ph_max',
            'culture_period_days',
            'created_at',
            'stages',
        ]

        read_only_fields = [
            'id',
            'created_at',
            'stages',
        ]

        extra_kwargs = {
            'image': {
                'required': False,
                'allow_null': True,
            },
        }


class FeedRecommendationSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = FeedRecommendation

        fields = [
            'id',
            'fish_stage',
            'feed_name',
            'feed_type',
            'feed_form',
            'protein_min',
            'protein_max',
            'particle_size_min',
            'particle_size_max',
            'is_organic',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'fish_stage',
            'created_at',
            'updated_at',
        ]