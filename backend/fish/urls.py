from django.urls import path

from .views import (
    FishListCreateView,
    FishDetailView,
    FishStageListCreateView,
    FishStageDetailView,
    FeedRecommendationListCreateView,
    FeedRecommendationDetailView,
    AdminFeedRecommendationListView,
    AdminFeedRecommendationDetailView,
)


urlpatterns = [

    # =============================
    # Fish
    # =============================

    path(
        '',
        FishListCreateView.as_view()
    ),


    # =============================
    # Admin Products
    # =============================

    path(
        'admin/products/',
        AdminFeedRecommendationListView.as_view()
    ),

    path(
        'admin/products/<int:recommendation_id>/',
        AdminFeedRecommendationDetailView.as_view()
    ),


    # =============================
    # Fish Detail
    # =============================

    path(
        '<int:fish_id>/',
        FishDetailView.as_view()
    ),


    # =============================
    # Fish Stages
    # =============================

    path(
        '<int:fish_id>/stages/',
        FishStageListCreateView.as_view()
    ),

    path(
        '<int:fish_id>/stages/<int:stage_id>/',
        FishStageDetailView.as_view()
    ),


    # =============================
    # Feed Recommendations
    # =============================

    path(
        '<int:fish_id>/stages/<int:stage_id>/feed-recommendations/',
        FeedRecommendationListCreateView.as_view()
    ),

    path(
        '<int:fish_id>/stages/<int:stage_id>/feed-recommendations/<int:recommendation_id>/',
        FeedRecommendationDetailView.as_view()
    ),
]