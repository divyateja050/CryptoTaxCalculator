from django.urls import path
from .views import (
    TransactionListCreateView, 
    TaxSummaryView, 
    TransactionBulkUploadView
)

urlpatterns = [
    # This URL handles listing all transactions (GET request) and
    # creating a single new transaction (POST request).
    # Full path will be: /api/transactions/
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    
    # This is the new URL for handling bulk CSV uploads (POST request).
    # Full path will be: /api/transactions/bulk_upload/
    path('transactions/bulk_upload/', TransactionBulkUploadView.as_view(), name='transaction-bulk-upload'),
    
    # This URL handles fetching the detailed tax summary (GET request).
    # Full path will be: /api/summary/
    path('summary/', TaxSummaryView.as_view(), name='tax-summary'),
]

