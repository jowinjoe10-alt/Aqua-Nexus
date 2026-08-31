from django.urls import path

from .views import (
    PondListCreateView,
    PondDetailView,
    PondFishListCreateView,
    PondFishDetailView,
)


urlpatterns = [

    # =============================
    # Ponds
    # =============================

    path(
        '',
        PondListCreateView.as_view()
    ),

    path(
        '<int:pond_id>/',
        PondDetailView.as_view()
    ),


    # =============================
    # Fish in Pond
    # =============================

    path(
        '<int:pond_id>/fish/',
        PondFishListCreateView.as_view()
    ),

    path(
        '<int:pond_id>/fish/<int:pond_fish_id>/',
        PondFishDetailView.as_view()
    ),
]