from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ['id', 'name', 'gmail', 'role', 'created_at']
        extra_kwargs = {
            'gmail': {
                'validators': []
            }
        }

    def validate(self, data):
        gmail = data.get('gmail')
        role = data.get('role')

        try:
            existing_account = Account.objects.get(gmail=gmail)
        except Account.DoesNotExist:
            return data

        if existing_account.role == role:
            raise serializers.ValidationError(
                'Account already exists. Try logging in.'
            )

        raise serializers.ValidationError(
            'Registration failed. This account is already registered under another role.'
        )