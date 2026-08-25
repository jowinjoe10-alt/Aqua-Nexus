from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import AccountSerializer
from .models import Account
from .otp_service import (
    create_otp,
    verify_otp,
    resend_otp,
)


class RegisterView(APIView):

    def post(self, request):

        serializer = AccountSerializer(
            data=request.data
        )

        if serializer.is_valid():

            account = serializer.save()

            return Response({
                'message':
                    'Account created successfully',

                'account':
                    AccountSerializer(
                        account
                    ).data

            }, status=201)

        return Response({
            'errors':
                serializer.errors

        }, status=400)


class LoginCheckView(APIView):

    def post(self, request):

        gmail = request.data.get(
            'gmail'
        )

        if gmail:
            gmail = gmail.strip().lower()

        if not gmail:

            return Response({
                'message':
                    'Gmail is required'
            }, status=400)

        try:

            account = Account.objects.get(
                gmail=gmail
            )

        except Account.DoesNotExist:

            return Response({
                'message':
                    'Account not registered. Please register first.'
            }, status=404)

        create_otp(
            account.gmail
        )

        return Response({

            'message':
                'OTP sent successfully',

            'account': {

                'id':
                    account.id,

                'name':
                    account.name,

                'gmail':
                    account.gmail,

                'role':
                    account.role,

            }

        }, status=200)


class VerifyOTPView(APIView):

    def post(self, request):

        gmail = request.data.get(
            'gmail'
        )

        if gmail:
            gmail = gmail.strip().lower()

        entered_code = request.data.get(
            'otp'
        )

        if not gmail:

            return Response({
                'message':
                    'Gmail is required'
            }, status=400)

        if not entered_code:

            return Response({
                'message':
                    'OTP is required'
            }, status=400)

        success, message = verify_otp(
            gmail,
            entered_code
        )

        if not success:

            return Response({
                'message':
                    message
            }, status=400)

        try:

            account = Account.objects.get(
                gmail=gmail
            )

        except Account.DoesNotExist:

            return Response({
                'message':
                    'Account not found'
            }, status=404)


        # =============================
        # Profile Picture URL
        # =============================

        profile_picture_url = ''

        if account.profile_picture:

            profile_picture_url = (
                request.build_absolute_uri(
                    account.profile_picture.url
                )
            )


        return Response({

            'message':
                'Login successful',

            'account': {

                'id':
                    account.id,

                'name':
                    account.name,

                'gmail':
                    account.gmail,

                'role':
                    account.role,

                'city':
                    account.city,

                'state':
                    account.state,

                'mobile_number':
                    account.mobile_number,

                'profile_picture':
                    profile_picture_url,

            }

        }, status=200)


class UpdateLocationView(APIView):

    def post(self, request):

        account_id = request.data.get(
            'account_id'
        )

        city = request.data.get(
            'city'
        )

        state = request.data.get(
            'state'
        )


        if not account_id:

            return Response({
                'message':
                    'Account ID is required'
            }, status=400)


        if not city or not city.strip():

            return Response({
                'message':
                    'City is required'
            }, status=400)


        if not state or not state.strip():

            return Response({
                'message':
                    'State is required'
            }, status=400)


        try:

            account = Account.objects.get(
                id=account_id
            )

        except Account.DoesNotExist:

            return Response({
                'message':
                    'Account not found'
            }, status=404)


        account.city = city.strip()
        account.state = state.strip()

        account.save()


        profile_picture_url = ''

        if account.profile_picture:

            profile_picture_url = (
                request.build_absolute_uri(
                    account.profile_picture.url
                )
            )


        return Response({

            'message':
                'Location updated successfully',

            'account': {

                'id':
                    account.id,

                'name':
                    account.name,

                'gmail':
                    account.gmail,

                'role':
                    account.role,

                'city':
                    account.city,

                'state':
                    account.state,

                'mobile_number':
                    account.mobile_number,

                'profile_picture':
                    profile_picture_url,

            }

        }, status=200)


class UpdateProfileView(APIView):

    def post(self, request):

        account_id = request.data.get(
            'account_id'
        )


        if not account_id:

            return Response({
                'message':
                    'Account ID is required'
            }, status=400)


        try:

            account = Account.objects.get(
                id=account_id
            )

        except Account.DoesNotExist:

            return Response({
                'message':
                    'Account not found'
            }, status=404)


        # =============================
        # Normal Profile Fields
        # =============================

        name = request.data.get(
            'name'
        )

        mobile_number = request.data.get(
            'mobile_number'
        )

        city = request.data.get(
            'city'
        )

        state = request.data.get(
            'state'
        )


        # =============================
        # Profile Picture
        # =============================

        profile_picture = request.FILES.get(
            'profile_picture'
        )

        print(
            'PROFILE PICTURE:',
            profile_picture
        )


        # =============================
        # Name
        # =============================

        if name is not None:

            name = name.strip()

            if not name:

                return Response({
                    'message':
                        'Name is required'
                }, status=400)

            account.name = name


        # =============================
        # Mobile Number
        # =============================

        if mobile_number is not None:

            mobile_number = (
                mobile_number.strip()
            )

            account.mobile_number = (
                mobile_number
            )


        # =============================
        # City
        # =============================

        if city is not None:

            city = city.strip()

            if not city:

                return Response({
                    'message':
                        'City is required'
                }, status=400)

            account.city = city


        # =============================
        # State
        # =============================

        if state is not None:

            state = state.strip()

            if not state:

                return Response({
                    'message':
                        'State is required'
                }, status=400)

            account.state = state


        # =============================
        # Save Profile Picture
        # =============================

        if profile_picture:

            account.profile_picture = (
                profile_picture
            )


        # =============================
        # Save Account
        # =============================

        account.save()


        # =============================
        # Profile Picture URL
        # =============================

        profile_picture_url = ''

        if account.profile_picture:

            profile_picture_url = (
                request.build_absolute_uri(
                    account.profile_picture.url
                )
            )


        return Response({

            'message':
                'Profile updated successfully',

            'account': {

                'id':
                    account.id,

                'name':
                    account.name,

                'gmail':
                    account.gmail,

                'role':
                    account.role,

                'city':
                    account.city,

                'state':
                    account.state,

                'mobile_number':
                    account.mobile_number,

                'profile_picture':
                    profile_picture_url,

            }

        }, status=200)


class ResendOTPView(APIView):

    def post(self, request):

        gmail = request.data.get(
            'gmail'
        )

        if gmail:
            gmail = gmail.strip().lower()

        if not gmail:

            return Response({
                'message':
                    'Gmail is required'
            }, status=400)


        success, message = resend_otp(
            gmail
        )


        if not success:

            return Response({
                'message':
                    message
            }, status=400)


        return Response({

            'message':
                message

        }, status=200)