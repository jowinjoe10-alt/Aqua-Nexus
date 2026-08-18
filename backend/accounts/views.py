from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import AccountSerializer
from .models import Account


class RegisterView(APIView):

    def post(self, request):
        serializer = AccountSerializer(data=request.data)

        if serializer.is_valid():
            account = serializer.save()

            return Response({
                'message': 'Account created successfully',
                'account': AccountSerializer(account).data
            }, status=201)

        return Response({
            'errors': serializer.errors
        }, status=400)


class LoginCheckView(APIView):

    def post(self, request):
        gmail = request.data.get('gmail')

        if not gmail:
            return Response({
                'message': 'Gmail is required'
            }, status=400)

        try:
            account = Account.objects.get(gmail=gmail)
        except Account.DoesNotExist:
            return Response({
                'message': 'Account not registered. Please register first.'
            }, status=404)

        return Response({
            'message': 'Account found',
            'account': {
                'id': account.id,
                'name': account.name,
                'gmail': account.gmail,
                'role': account.role,
            }
        }, status=200)