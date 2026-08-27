from rest_framework import serializers

from .models import Fish


class FishSerializer(
    serializers.ModelSerializer
):

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
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]

        extra_kwargs = {
            'image': {
                'required': False,
                'allow_null': True,
            },
        }