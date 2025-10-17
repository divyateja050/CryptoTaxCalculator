from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Transaction(models.Model):
    """
    Represents a single cryptocurrency transaction for a user.
    """
    # Choices for the transaction type
    TRANSACTION_TYPES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
    ]

    # Link each transaction to a specific user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    
    # Core transaction fields
    asset_name = models.CharField(max_length=50, help_text="Name of the cryptocurrency (e.g., Bitcoin)")
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPES)
    date = models.DateField()
    amount = models.FloatField(help_text="Quantity of the asset")
    price = models.FloatField(help_text="Price per unit in your local currency (e.g., INR)")

    # Timestamps for record-keeping
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type.upper()} {self.amount} {self.asset_name} on {self.date}"
