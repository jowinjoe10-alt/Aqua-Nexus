from rest_framework import generics
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from .models import Fish
from .serializers import FishSerializer


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