from rest_framework import serializers

from .models import Pond, PondFish


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
            'stage_started_at',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'pond',
            'fish_name',
            'stage_number',
            'created_at',
            'updated_at',
        ]


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