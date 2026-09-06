from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction

from fish.models import FeedRecommendation
from accounts.models import Account
from pond.models import Notification

from .models import (
    Product,
    Chat,
    Inventory,
    Order,
    Subscription,
)

from .serializers import (
    ProductSerializer,
    ChatSerializer,
    OrderSerializer,
    SubscriptionSerializer,
)







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

class ChatCreateView(APIView):

    def post(self, request):

        farmer_id = request.data.get(
            'farmer_id'
        )

        vendor_id = request.data.get(
            'vendor_id'
        )

        product_id = request.data.get(
            'product_id'
        )

        question = request.data.get(
            'question',
            ''
        ).strip()

        if not farmer_id or not vendor_id or not product_id:

            return Response(
                {
                    'error': 'Farmer, vendor and product are required.'
                },
                status=400
            )

        if not question:

            return Response(
                {
                    'error': 'Question is required.'
                },
                status=400
            )

        try:

            farmer = Account.objects.get(
                id=farmer_id,
                role='farmer'
            )

        except Account.DoesNotExist:

            return Response(
                {
                    'error': 'Farmer not found.'
                },
                status=404
            )

        try:

            vendor = Account.objects.get(
                id=vendor_id,
                role='vendor'
            )

        except Account.DoesNotExist:

            return Response(
                {
                    'error': 'Vendor not found.'
                },
                status=404
            )

        try:

            product = Product.objects.get(
                id=product_id,
                vendor=vendor
            )

        except Product.DoesNotExist:

            return Response(
                {
                    'error': 'Product not found for this vendor.'
                },
                status=404
            )

        chat = Chat.objects.create(
            farmer=farmer,
            vendor=vendor,
            product=product,
            question=question
        )

        Notification.objects.create(
           recipient=vendor,
           message='You got a chat from Farmer.',
           is_read=False
        )

        return Response(
            {
                'message': 'Question sent successfully.',
                'chat_id': chat.id
            },
            status=201
        )


class VendorChatListView(APIView):

    def get(self, request):

        vendor_id = request.query_params.get(
            'vendor_id'
        )

        if not vendor_id:

            return Response(
                {
                    'error': 'Vendor ID is required.'
                },
                status=400
            )

        chats = Chat.objects.filter(
            vendor_id=vendor_id
        ).select_related(
            'farmer',
            'vendor',
            'product'
        ).order_by(
            '-created_at'
        )

        serializer = ChatSerializer(
            chats,
            many=True
        )

        return Response(
            serializer.data
        )

class VendorChatReplyView(APIView):

    def post(self, request, pk):

        vendor_id = request.data.get(
            'vendor_id'
        )

        reply = request.data.get(
            'reply',
            ''
        ).strip()

        if not vendor_id:

            return Response(
                {
                    'error': 'Vendor ID is required.'
                },
                status=400
            )

        if not reply:

            return Response(
                {
                    'error': 'Reply is required.'
                },
                status=400
            )

        try:

            chat = Chat.objects.select_related(
                'vendor'
            ).get(
                id=pk
            )

        except Chat.DoesNotExist:

            return Response(
                {
                    'error': 'Chat not found.'
                },
                status=404
            )

        if chat.vendor_id != int(vendor_id):

            return Response(
                {
                    'error': 'This chat does not belong to this vendor.'
                },
                status=403
            )

        chat.reply = reply

        chat.vendor_replied_at = timezone.now()

        chat.save()

        Notification.objects.create(
          recipient=chat.farmer,
          message='Vendor replied to your chat.',
          is_read=False
        )

        return Response(
            {
                'message': 'Reply sent successfully.',
                'chat_id': chat.id
            }
        )  

class FarmerChatReadView(APIView):

    def post(self, request, pk):

        farmer_id = request.data.get(
            'farmer_id'
        )

        if not farmer_id:

            return Response(
                {
                    'error': 'Farmer ID is required.'
                },
                status=400
            )

        try:

            chat = Chat.objects.get(
                id=pk
            )

        except Chat.DoesNotExist:

            return Response(
                {
                    'error': 'Chat not found.'
                },
                status=404
            )

        if chat.farmer_id != int(farmer_id):

            return Response(
                {
                    'error': 'This chat does not belong to this farmer.'
                },
                status=403
            )

        if not chat.reply:

            return Response(
                {
                    'error': 'Vendor has not replied yet.'
                },
                status=400
            )

        current_time = timezone.now()

        chat.farmer_read_at = current_time

        chat.expires_at = (
            current_time + timezone.timedelta(
                minutes=30
            )
        )

        chat.save()

        return Response(
            {
                'message': 'Chat marked as read.',
                'chat_id': chat.id,
                'expires_at': chat.expires_at
            }
        )

class FarmerChatListView(APIView):

    def get(self, request):

        farmer_id = request.query_params.get(
            'farmer_id'
        )

        if not farmer_id:

            return Response(
                {
                    'error': 'Farmer ID is required.'
                },
                status=400
            )

        chats = Chat.objects.filter(
            farmer_id=farmer_id
        ).select_related(
            'farmer',
            'vendor',
            'product'
        ).order_by(
            '-created_at'
        )

        serializer = ChatSerializer(
            chats,
            many=True
        )

        return Response(
            serializer.data
        )

class VendorChatUnreadCountView(APIView):

    def get(self, request):

        vendor_id = request.query_params.get(
            'vendor_id'
        )

        if not vendor_id:

            return Response(
                {
                    'error': 'Vendor ID is required.'
                },
                status=400
            )

        unread_count = Chat.objects.filter(
            vendor_id=vendor_id,
            reply=''
        ).count()

        return Response(
            {
                'unread_count': unread_count
            }
        )

class FarmerChatUnreadView(APIView):

    def get(self, request):

        farmer_id = request.query_params.get(
            'farmer_id'
        )

        if not farmer_id:

            return Response(
                {
                    'error': 'Farmer ID is required.'
                },
                status=400
            )

        unread_count = Chat.objects.filter(
            farmer_id=farmer_id,
            reply__isnull=False,
            farmer_read_at__isnull=True
        ).exclude(
            reply=''
        ).count()

        return Response(
            {
                'unread_count': unread_count
            }
        )

class OrderCreateView(APIView):

    def post(self, request):

        farmer_id = request.data.get(
            'farmer_id'
        )

        vendor_id = request.data.get(
            'vendor_id'
        )

        product_id = request.data.get(
            'product_id'
        )

        quantity = request.data.get(
            'quantity'
        )

        if not farmer_id or not vendor_id or not product_id:

            return Response(
                {
                    'error':
                        'Farmer, vendor and product are required.'
                },
                status=400
            )

        if not quantity:

            return Response(
                {
                    'error':
                        'Quantity is required.'
                },
                status=400
            )

        try:

            quantity = int(quantity)

        except (TypeError, ValueError):

            return Response(
                {
                    'error':
                        'Quantity must be a valid number.'
                },
                status=400
            )

        if quantity <= 0:

            return Response(
                {
                    'error':
                        'Quantity must be greater than zero.'
                },
                status=400
            )

        try:

            farmer = Account.objects.get(
                id=farmer_id,
                role='farmer'
            )

        except Account.DoesNotExist:

            return Response(
                {
                    'error':
                        'Farmer not found.'
                },
                status=404
            )

        try:

            vendor = Account.objects.get(
                id=vendor_id,
                role='vendor'
            )

        except Account.DoesNotExist:

            return Response(
                {
                    'error':
                        'Vendor not found.'
                },
                status=404
            )

        try:

            product = Product.objects.get(
                id=product_id,
                vendor=vendor
            )

        except Product.DoesNotExist:

            return Response(
                {
                    'error':
                        'Product not found for this vendor.'
                },
                status=404
            )

        try:

            inventory = product.inventory

        except Inventory.DoesNotExist:

            return Response(
                {
                    'error':
                        'Inventory not found for this product.'
                },
                status=404
            )

        if inventory.quantity < quantity:

            return Response(
                {
                    'error':
                        'Requested quantity is not available.'
                },
                status=400
            )

        unit_price = product.price

        total_price = (
            unit_price * quantity
        )

        order = Order.objects.create(

            farmer=farmer,

            vendor=vendor,

            product=product,

            quantity=quantity,

            unit_price=unit_price,

            total_price=total_price,

            status='pending'

        )

        return Response(
            {
                'message':
                    'Order created successfully.',

                'order':
                    OrderSerializer(order).data
            },
            status=201
        )

class FarmerOrderListView(APIView):

    def get(self, request):

        farmer_id = request.query_params.get(
            'farmer_id'
        )

        if not farmer_id:

            return Response(
                {
                    'error':
                        'Farmer ID is required.'
                },
                status=400
            )

        orders = Order.objects.filter(
            farmer_id=farmer_id
        ).select_related(
            'farmer',
            'vendor',
            'product'
        ).order_by(
            '-created_at'
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )

class VendorOrderListView(APIView):

    def get(self, request):

        vendor_id = request.query_params.get(
            'vendor_id'
        )

        if not vendor_id:

            return Response(
                {
                    'error':
                        'Vendor ID is required.'
                },
                status=400
            )

        orders = Order.objects.filter(
            vendor_id=vendor_id
        ).select_related(
            'farmer',
            'vendor',
            'product'
        ).order_by(
            '-created_at'
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )


class OrderAcceptView(APIView):

    @transaction.atomic
    def post(self, request, pk):

        vendor_id = request.data.get(
            'vendor_id'
        )

        if not vendor_id:

            return Response(
                {
                    'error':
                        'Vendor ID is required.'
                },
                status=400
            )

        try:

            order = Order.objects.select_related(
                'product',
                'vendor',
                'farmer'
            ).get(
                id=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    'error':
                        'Order not found.'
                },
                status=404
            )

        if order.vendor_id != int(vendor_id):

            return Response(
                {
                    'error':
                        'This order does not belong to this vendor.'
                },
                status=403
            )

        if order.status != 'pending':

            return Response(
                {
                    'error':
                        'This order cannot be accepted.'
                },
                status=400
            )

        try:

            inventory = Inventory.objects.select_for_update().get(
                product=order.product
            )

        except Inventory.DoesNotExist:

            return Response(
                {
                    'error':
                        'Inventory not found.'
                },
                status=404
            )

        if inventory.quantity < order.quantity:

            return Response(
                {
                    'error':
                        'Insufficient inventory.'
                },
                status=400
            )

        inventory.quantity = (
            inventory.quantity -
            order.quantity
        )

        inventory.save()

        order.status = 'accepted'

        order.save()

        return Response(
            {
                'message':
                    'Order accepted successfully.',

                'order':
                    OrderSerializer(order).data
            }
        )

class OrderRejectView(APIView):

    def post(self, request, pk):

        vendor_id = request.data.get(
            'vendor_id'
        )

        if not vendor_id:

            return Response(
                {
                    'error':
                        'Vendor ID is required.'
                },
                status=400
            )

        try:

            order = Order.objects.get(
                id=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    'error':
                        'Order not found.'
                },
                status=404
            )

        if order.vendor_id != int(vendor_id):

            return Response(
                {
                    'error':
                        'This order does not belong to this vendor.'
                },
                status=403
            )

        if order.status != 'pending':

            return Response(
                {
                    'error':
                        'This order cannot be rejected.'
                },
                status=400
            )

        order.status = 'rejected'

        order.save()

        return Response(
            {
                'message':
                    'Order rejected successfully.',

                'order':
                    OrderSerializer(order).data
            }
        )