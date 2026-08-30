from django.db import models
from rest_framework import generics
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from .models import Fish, FishStage, FeedRecommendation
from .serializers import (
    FishSerializer,
    FishStageSerializer,
    FeedRecommendationSerializer,
    AdminFeedRecommendationSerializer,
)

class FishListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = FishSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        queryset = Fish.objects.all()

        # =============================
        # Search
        # =============================

        search = self.request.query_params.get(
            'search',
            ''
        ).strip()

        if search:

            queryset = queryset.filter(
                name__icontains=search
            )


        # =============================
        # Sorting
        # =============================

        sort = self.request.query_params.get(
            'sort',
            'id_asc'
        )

        if sort == 'name_asc':

            queryset = queryset.order_by(
                'name',
                'id'
            )

        elif sort == 'name_desc':

            queryset = queryset.order_by(
                '-name',
                'id'
            )

        elif sort == 'id_desc':

            queryset = queryset.order_by(
                '-id'
            )

        elif sort == 'created_latest':

            queryset = queryset.order_by(
                '-created_at',
                'id'
            )

        elif sort == 'created_earliest':

            queryset = queryset.order_by(
                'created_at',
                'id'
            )

        else:

            queryset = queryset.order_by(
                'id'
            )

        return queryset


class FishDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = FishSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    lookup_url_kwarg = 'fish_id'

    def get_queryset(self):

        return Fish.objects.all()

    def perform_update(self, serializer):

        fish = serializer.save()

        duration_days = round(
            fish.culture_period_days / 6
        )

        FishStage.objects.filter(
            fish=fish
        ).update(
            duration_days=duration_days
        )

        
class FishStageListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = FishStageSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        fish_id = self.kwargs['fish_id']

        return FishStage.objects.filter(
            fish_id=fish_id
        ).order_by(
            'stage_number'
        )

    def perform_create(self, serializer):

        fish_id = self.kwargs['fish_id']

        fish = Fish.objects.get(
            id=fish_id
        )

        duration_days = round(
            fish.culture_period_days / 6
        )

        serializer.save(
            fish=fish,
            duration_days=duration_days
        )


class FishStageDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = FishStageSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    lookup_url_kwarg = 'stage_id'

    def get_queryset(self):

        fish_id = self.kwargs['fish_id']

        return FishStage.objects.filter(
            fish_id=fish_id
        )


class FeedRecommendationListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = FeedRecommendationSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):

        fish_id = self.kwargs['fish_id']
        stage_id = self.kwargs['stage_id']

        return FeedRecommendation.objects.filter(
            fish_stage_id=stage_id,
            fish_stage__fish_id=fish_id
        ).order_by(
            'id'
        )

    def perform_create(self, serializer):

        fish_id = self.kwargs['fish_id']
        stage_id = self.kwargs['stage_id']

        stage = FishStage.objects.get(
            id=stage_id,
            fish_id=fish_id
        )

        serializer.save(
            fish_stage=stage
        )


class FeedRecommendationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = FeedRecommendationSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    lookup_url_kwarg = 'recommendation_id'

    def get_queryset(self):

        fish_id = self.kwargs['fish_id']
        stage_id = self.kwargs['stage_id']

        return FeedRecommendation.objects.filter(
            fish_stage_id=stage_id,
            fish_stage__fish_id=fish_id
        )


class AdminFeedRecommendationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = AdminFeedRecommendationSerializer

    lookup_url_kwarg = 'recommendation_id'

    def get_queryset(self):

        return FeedRecommendation.objects.select_related(
            'fish_stage__fish'
        )


class AdminFeedRecommendationListView(
    generics.ListAPIView
):

    serializer_class = AdminFeedRecommendationSerializer

    def get_queryset(self):

        queryset = FeedRecommendation.objects.select_related(
            'fish_stage__fish'
        )

        # =============================
        # Stage
        # =============================

        stage = self.request.query_params.get(
            'stage'
        )

        if stage:

            queryset = queryset.filter(
                fish_stage__stage_number=stage
            )


        # =============================
        # Search
        # =============================

        search = self.request.query_params.get(
            'search',
            ''
        ).strip()

        if search:

            queryset = queryset.filter(
                models.Q(
                    feed_name__icontains=search
                )
                |
                models.Q(
                    fish_stage__fish__name__icontains=search
                )
            )


        return queryset.order_by(
            'id'
        )