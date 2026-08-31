from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from accounts.models import Account

from .models import Pond, PondFish

from .serializers import (
    PondSerializer,
    PondFishSerializer,
)


# =========================================================
# Pond List / Create
# =========================================================

class PondListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = PondSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        farmer_id = self.request.query_params.get(
            'farmer_id'
        )

        if farmer_id:

            return Pond.objects.filter(
                farmer_id=farmer_id
            ).order_by(
                'id'
            )

        return Pond.objects.all().order_by(
            'id'
        )

    def perform_create(self, serializer):

        farmer_id = self.request.data.get(
            'farmer'
        )

        farmer = get_object_or_404(
            Account,
            id=farmer_id,
            role='farmer'
        )

        serializer.save(
            farmer=farmer
        )


# =========================================================
# Pond Detail
# =========================================================

class PondDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = PondSerializer

    lookup_url_kwarg = 'pond_id'

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        return Pond.objects.all()


# =========================================================
# Fish in Pond
# =========================================================

class PondFishListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = PondFishSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        pond_id = self.kwargs[
            'pond_id'
        ]

        return PondFish.objects.select_related(
            'fish',
            'current_stage'
        ).filter(
            pond_id=pond_id
        ).order_by(
            'id'
        )

    def perform_create(self, serializer):

        pond_id = self.kwargs[
            'pond_id'
        ]

        pond = get_object_or_404(
            Pond,
            id=pond_id
        )

        serializer.save(
            pond=pond
        )


# =========================================================
# Pond Fish Detail
# =========================================================

class PondFishDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = PondFishSerializer

    lookup_url_kwarg = 'pond_fish_id'

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        pond_id = self.kwargs[
            'pond_id'
        ]

        return PondFish.objects.filter(
            pond_id=pond_id
        )