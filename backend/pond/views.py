from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from rest_framework import generics
from rest_framework.response import Response

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from accounts.models import Account

from .models import (
    Pond,
    PondFish,
    Notification,
)

from .serializers import (
    PondSerializer,
    PondFishSerializer,
    NotificationSerializer,
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

        queryset = Pond.objects.select_related(
            'farmer'
        ).prefetch_related(
            'fish__fish',
            'fish__current_stage__feed_recommendations'
        )

        farmer_id = self.request.query_params.get(
            'farmer_id'
        )

        if farmer_id:

            return queryset.filter(
                farmer_id=farmer_id
            ).order_by(
                'id'
            )

        return queryset.order_by(
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

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        pond_fish = self.get_object()

        old_stage = pond_fish.current_stage

        serializer = self.get_serializer(
            pond_fish,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        new_stage = serializer.validated_data.get(
            'current_stage',
            old_stage
        )

        serializer.save()

        if new_stage.id != old_stage.id:

            pond_fish.stage_started_at = timezone.now()

            pond_fish.save(
                update_fields=[
                    'stage_started_at'
                ]
            )

            Notification.objects.create(

                recipient=pond_fish.pond.farmer,

                pond=pond_fish.pond,

                fish=pond_fish.fish,

                old_stage=old_stage,

                new_stage=new_stage,

                message=(
                    f'{pond_fish.fish.name} '
                    f'stage updated in '
                    f'{pond_fish.pond.name}'
                ),

                is_read=False
            )

        return Response(
            serializer.data
        )


# =========================================================
# Notification List
# =========================================================

class NotificationListView(
    generics.ListAPIView
):

    serializer_class = NotificationSerializer

    def get_queryset(self):

        recipient_id = self.request.query_params.get(
            'recipient_id'
        )

        if not recipient_id:

            return Notification.objects.none()

        # Remove notifications older than 10 days

        expiry_time = (
            timezone.now()
            - timedelta(days=10)
        )

        Notification.objects.filter(
            created_at__lt=expiry_time
        ).delete()

        return Notification.objects.select_related(
            'recipient',
            'pond',
            'fish',
            'old_stage',
            'new_stage'
        ).filter(
            recipient_id=recipient_id
        ).order_by(
            '-created_at'
        )


# =========================================================
# Mark Notification As Read
# =========================================================

class NotificationReadView(
    generics.GenericAPIView
):

    serializer_class = NotificationSerializer

    lookup_url_kwarg = 'notification_id'

    def get_queryset(self):

        recipient_id = self.request.query_params.get(
            'recipient_id'
        )

        if not recipient_id:

            return Notification.objects.none()

        return Notification.objects.filter(
            recipient_id=recipient_id
        )

    def patch(
        self,
        request,
        *args,
        **kwargs
    ):

        notification = get_object_or_404(
            self.get_queryset(),
            id=kwargs[
                'notification_id'
            ]
        )

        notification.is_read = True

        notification.save(
            update_fields=[
                'is_read'
            ]
        )

        serializer = self.get_serializer(
            notification
        )

        return Response(
            serializer.data
        )