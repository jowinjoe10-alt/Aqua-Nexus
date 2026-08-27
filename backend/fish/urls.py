from django.urls import path

from .views import (
    FishListCreateView,
    FishDetailView,
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

]