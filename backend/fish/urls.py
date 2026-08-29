from django.urls import path

from .views import (
    FishListCreateView,
    FishDetailView,
    FishStageListCreateView,
    FishStageDetailView,
    FeedRecommendationListCreateView,
    FeedRecommendationDetailView,
)

urlpatterns = [

    path(
        '',
        FishListCreateView.as_view()
    ),

    path(
        '<int:fish_id>/',
        FishDetailView.as_view()
    ),

    path(
        '<int:fish_id>/stages/',
        FishStageListCreateView.as_view()
    ),

    path(
        '<int:fish_id>/stages/<int:stage_id>/',
        FishStageDetailView.as_view()
    ),

    path(
       '<int:fish_id>/stages/<int:stage_id>/feed-recommendations/',
       FeedRecommendationListCreateView.as_view()
    ),

    path(
       '<int:fish_id>/stages/<int:stage_id>/feed-recommendations/<int:recommendation_id>/',
       FeedRecommendationDetailView.as_view()
    ),
]