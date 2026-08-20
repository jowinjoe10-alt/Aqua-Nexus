from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import AccountSerializer
from .models import Account
from .otp_service import create_otp, verify_otp, resend_otp

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

        otp = create_otp(account.gmail)

        return Response({
          'message': 'OTP sent successfully',
          'account': {
              'id': account.id,
              'name': account.name,
              'gmail': account.gmail,
              'role': account.role,
           }
        }, status=200)

class VerifyOTPView(APIView):

    def post(self, request):
        gmail = request.data.get('gmail')
        entered_code = request.data.get('otp')

        if not gmail:
            return Response({
                'message': 'Gmail is required'
            }, status=400)

        if not entered_code:
            return Response({
                'message': 'OTP is required'
            }, status=400)

        success, message = verify_otp(gmail, entered_code)

        if not success:
            return Response({
                'message': message
            }, status=400)

        try:
            account = Account.objects.get(gmail=gmail)
        except Account.DoesNotExist:
            return Response({
                'message': 'Account not found'
            }, status=404)

        return Response({
            'message': 'Login successful',
            'account': {
                'id': account.id,
                'name': account.name,
                'gmail': account.gmail,
                'role': account.role,
            }
        }, status=200)


class ResendOTPView(APIView):

    def post(self, request):
        gmail = request.data.get('gmail')

        if not gmail:
            return Response({
                'message': 'Gmail is required'
            }, status=400)

        success, message = resend_otp(gmail)

        if not success:
            return Response({
                'message': message
            }, status=400)

        return Response({
            'message': message
        }, status=200)