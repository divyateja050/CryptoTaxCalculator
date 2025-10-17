from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated

from .models import Transaction
from .serializers import TransactionSerializer
from datetime import date, timedelta

# --- TransactionListCreateView and TaxSummaryView remain unchanged ---

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaxSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = self.request.user
        transactions = Transaction.objects.filter(user=user)
        one_year_ago = date.today() - timedelta(days=365)
        total_gains = stcg = ltcg = total_transaction_value_for_gst = 0
        for tx in transactions:
            value = tx.amount * tx.price
            total_transaction_value_for_gst += value
            if tx.transaction_type == 'sell': total_gains += value
            else: total_gains -= value
            if tx.date > one_year_ago:
                if tx.transaction_type == 'sell': stcg += value
                else: stcg -= value
            else:
                if tx.transaction_type == 'sell': ltcg += value
                else: ltcg -= value
        ltcg_tax = ltcg * 0.20 if ltcg > 0 else 0
        stcg_tax = stcg * 0.30 if stcg > 0 else 0
        estimated_tax = ltcg_tax + stcg_tax
        simulated_fees = total_transaction_value_for_gst * 0.01
        gst_applicable = simulated_fees * 0.18
        summary = { "total_gains": total_gains, "estimated_tax": estimated_tax, "total_transactions": transactions.count(), "stcg": stcg, "ltcg": ltcg, "gst_applicable": gst_applicable, }
        return Response(summary, status=status.HTTP_200_OK)


# --- THIS IS THE FINAL, MOST DEFENSIVE FIX FOR THE BULK UPLOAD VIEW ---
class TransactionBulkUploadView(APIView):
    """
    Handles bulk creation of transactions. This version is extremely defensive,
    manually checking for all required fields, sanitizing data, and converting
    types before passing to the serializer to provide the best possible error feedback.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        transactions_data = request.data
        #print(request.data)
        if not isinstance(transactions_data, list):
            return Response({"error": "Invalid data format. Expected a list of transaction objects."}, status=status.HTTP_400_BAD_REQUEST)

        cleaned_data_for_serializer = []
        errors = []

        # 1. Loop through each row from the frontend for manual pre-validation
        for index, item in enumerate(transactions_data):
            row_num = index + 1
            # --- Field Presence Check ---
            asset = item.get('asset_name')
            trans_type = item.get('transaction_type')
            date_str = item.get('date')
            amount = item.get('amount')
            price = item.get('price')

            if not all([asset, trans_type, date_str, amount is not None, price is not None]):
                errors.append(f"Row {row_num}: Missing one or more required fields (asset, type, date, amount, price).")
                continue # Skip to the next row

            # --- Data Sanitization & Type Conversion ---
            try:
                # Sanitize transaction type (convert to lowercase, remove whitespace)
                sanitized_type = str(trans_type).lower().strip()
                if sanitized_type not in ['buy', 'sell']:
                    raise ValueError(f"'{trans_type}' is not a valid type. Must be 'buy' or 'sell'.")

                # Defensively convert amount and price to float, handling various formats
                cleaned_amount = float(str(amount).replace(',', ''))
                cleaned_price = float(str(price).replace(',', ''))
                # cleaned_amount = amount
                # cleaned_price = price
                # If all checks pass, build the dictionary for the serializer
                cleaned_item = {
                    'asset_name': str(asset).strip(),
                    'transaction_type': sanitized_type,
                    'date': date_str, # Let the serializer handle final date validation
                    'amount': cleaned_amount,
                    'price': cleaned_price,
                }
                cleaned_data_for_serializer.append(cleaned_item)

            except (ValueError, TypeError) as e:
                # If any conversion or validation fails, add a specific, helpful error message
                errors.append(f"Row {row_num}: Invalid data. Check number formats (e.g., use '1200.50' not '1,200.50') and ensure type is 'buy' or 'sell'. Error: {e}")
                continue # Skip this row and proceed to the next
        print(cleaned_data_for_serializer)
        # 2. If any rows had errors during our manual check, stop and return them.
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        # 3. If all data is clean, proceed with the final serializer validation
        serializer = TransactionSerializer(data=cleaned_data_for_serializer, many=True)
        if serializer.is_valid():
            transactions_to_create = [
                Transaction(user=request.user, **data) for data in serializer.validated_data
            ]
            Transaction.objects.bulk_create(transactions_to_create)
            return Response({"status": f"{len(transactions_to_create)} transactions uploaded successfully."}, status=status.HTTP_201_CREATED)
        else:
            # This will catch any remaining issues, like invalid date formats (e.g., "18-10-2025")
            return Response({"serializer_errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



def login_view(request):
    """Renders the login page."""
    return render(request, 'login.html')

def dashboard_view(request):
    """Renders the dashboard page."""
    return render(request, 'dashboard.html')