from django.urls import path

from .views import (
    FeedTypeListView,
    FeedNameListView,
    ProductListCreateView,
    ProductDetailView,
)


urlpatterns = [

    # =============================
    # Feed Types
    # =============================

    path(
        'feed-types/',
        FeedTypeListView.as_view()
    ),

    # =============================
    # Feed Names
    # =============================

    path(
        'feed-names/',
        FeedNameListView.as_view()
    ),

    # =============================
    # Products
    # =============================

    path(
        '',
        ProductListCreateView.as_view()
    ),

    path(
        '<int:pk>/',
        ProductDetailView.as_view()
    ),

]