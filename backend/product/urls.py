from django.urls import path

from .views import (
    FeedTypeListView,
    FeedNameListView,
    ProductListCreateView,
    ProductDetailView,
    ChatCreateView,
    VendorChatListView,
    VendorChatReplyView,
    FarmerChatReadView,
    FarmerChatListView,
    VendorChatUnreadCountView,
    FarmerChatUnreadView,
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

    path(
       'chat/',
       ChatCreateView.as_view()
    ),

    path(
      'chat/farmer/unread/',
      FarmerChatUnreadView.as_view()
    ),

    path(
       'chat/vendor/',
       VendorChatListView.as_view()
    ),

    path(
          'chat/vendor/unread/',
          VendorChatUnreadCountView.as_view()
        ),
    

    path(
       'chat/<int:pk>/reply/',
       VendorChatReplyView.as_view()
    ),

    path(
      'chat/<int:pk>/read/',
      FarmerChatReadView.as_view()
    ),

    path(
      'chat/farmer/',
      FarmerChatListView.as_view()
    ),

    path(
      'chat/farmer/unread/',
      FarmerChatUnreadView.as_view()
    ),

]