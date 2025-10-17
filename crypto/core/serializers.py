from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    """
    This class acts as the "data translator". It converts the Python-based
    Transaction model into JSON format to be sent to the frontend, and
    vice-versa.
    """
    class Meta:
        # Specifies which model this serializer is for.
        model = Transaction
        
        # Lists all the fields from the model that should be included
        # in the JSON representation. The 'user' field is handled
        # automatically by the view based on the authenticated user,
        # so we don't need to explicitly include it here for creation.
        fields = ['id', 'asset_name', 'transaction_type', 'date', 'amount', 'price']

