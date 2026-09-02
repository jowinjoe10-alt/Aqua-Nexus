from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from fish.models import FeedRecommendation
from .models import Product
from .serializers import ProductSerializer


class FeedTypeListView(APIView):

    def get(self, request):

        feed_types = FeedRecommendation.objects.filter(
            feed_type__isnull=False
        ).exclude(
            feed_type=''
        ).values_list(
            'feed_type',
            flat=True
        ).distinct().order_by(
            'feed_type'
        )

        return Response(
            list(feed_types)
        )


class FeedNameListView(APIView):

    def get(self, request):

        feed_type = request.query_params.get(
            'feed_type',
            ''
        ).strip()

        if not feed_type:

            return Response([])

        feed_names = FeedRecommendation.objects.filter(
            feed_type=feed_type,
            feed_name__isnull=False
        ).exclude(
            feed_name=''
        ).values_list(
            'feed_name',
            flat=True
        ).distinct().order_by(
            'feed_name'
        )

        return Response(
            list(feed_names)
        )


class ProductListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = Product.objects.select_related(
            'vendor'
        ).prefetch_related(
            'inventory'
        )

        account_id = self.request.query_params.get(
            'account_id'
        )

        if account_id:

            queryset = queryset.filter(
                vendor_id=account_id
            )

        return queryset.order_by(
            'id'
        )

class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = Product.objects.select_related(
            'vendor'
        ).prefetch_related(
            'inventory'
        )


        account_id = self.request.query_params.get(
            'account_id'
        )


        if account_id:

            queryset = queryset.filter(
                vendor_id=account_id
            )


        return queryset