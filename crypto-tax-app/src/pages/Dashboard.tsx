import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TaxSummary from "@/components/dashboard/TaxSummary";
import TransactionForm from "@/components/dashboard/TransactionForm";
import TransactionTable from "@/components/dashboard/TransactionTable";
import FileUpload from "@/components/dashboard/FileUpload";
import TaxAnalytics from "@/components/dashboard/TaxAnalytics";
import ReportGenerator from "@/components/dashboard/ReportGenerator";

// --- Type Definitions ---

// Data from Django Backend (snake_case)
export interface ApiTransaction {
  id: number;
  asset_name: string;
  transaction_type: "buy" | "sell";
  date: string;
  amount: number;
  price: number;
}

// Data shape for child components (camelCase)
export interface FrontendTransaction {
  id: string;
  asset: string;
  type: "buy" | "sell";
  date: string;
  amount: number;
  price: number;
}

export type NewApiTransaction = Omit<ApiTransaction, "id">;

// Data from Django TaxSummaryView (snake_case)
export interface TaxSummaryData {
  total_gains: number;
  estimated_tax: number;
  total_transactions: number;
  stcg: number;
  ltcg: number;
  gst_applicable: number;
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Dashboard = () => {
  const { authToken, logout } = useAuth();
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([]);
  const [summaryData, setSummaryData] = useState<TaxSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!authToken) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Token ${authToken}` } };
      const [txResponse, summaryResponse] = await Promise.all([
        axios.get<ApiTransaction[]>(`${API_BASE_URL}/transactions/`, config),
        axios.get<TaxSummaryData>(`${API_BASE_URL}/summary/`, config),
      ]);
      setApiTransactions(txResponse.data);
      setSummaryData(summaryResponse.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const frontendTransactions: FrontendTransaction[] = useMemo(() => {
    return apiTransactions.map(tx => ({
      id: tx.id.toString(),
      asset: tx.asset_name,
      type: tx.transaction_type,
      date: tx.date,
      amount: tx.amount,
      price: tx.price,
    }));
  }, [apiTransactions]);

  const handleAddTransaction = async (transaction: Omit<FrontendTransaction, "id">) => {
    const newApiTx: NewApiTransaction = {
      asset_name: transaction.asset,
      transaction_type: transaction.type,
      date: transaction.date,
      amount: transaction.amount,
      price: transaction.price,
    };
    try {
      const config = { headers: { Authorization: `Token ${authToken}` } };
      await axios.post(`${API_BASE_URL}/transactions/`, newApiTx, config);
      await fetchData();
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  const handleBulkUpload = async (newTransactions: Omit<FrontendTransaction, "id">[]) => {
  const newApiTxs: NewApiTransaction[] = newTransactions.map(tx => ({
    asset_name: tx.asset,
    transaction_type: tx.type,
    date: tx.date,
    amount: tx.amount,
    price: tx.price,
  }));

  console.log("Bulk upload payload:", newApiTxs); // <-- This logs the bulk data from the CSV
  const isValid = newApiTxs.every(tx =>
  typeof tx.asset_name === "string" &&
  (tx.transaction_type === "buy" || tx.transaction_type === "sell") &&
  /^\d{4}-\d{2}-\d{2}$/.test(tx.date) &&
  typeof tx.amount === "number" &&
  typeof tx.price === "number"
);

if (!isValid) {
  console.warn("Some transactions are invalid:", newApiTxs);
  return;
}

  try {
    const config = { headers: { Authorization: `Token ${authToken}` } };
    await axios.post(`${API_BASE_URL}/transactions/bulk_upload/`, newApiTxs, config);
    await fetchData();
  } catch (err) {
    console.error("Failed to bulk upload transactions:", err);
  }
};

  
  const reportSummary = useMemo(() => {
    if (!summaryData) return null;
    return {
      capitalGains: summaryData.total_gains,
      estimatedTax: summaryData.estimated_tax,
      totalTransactions: summaryData.total_transactions,
      stcg: summaryData.stcg,
      ltcg: summaryData.ltcg,
      gst: summaryData.gst_applicable
    };
  }, [summaryData]);


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading Dashboard...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onLogout={logout} />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {error && <div className="p-4 bg-destructive/10 text-destructive text-center rounded-lg">{error}</div>}
        {summaryData && (
          <TaxSummary
            capitalGains={summaryData.total_gains}
            estimatedTax={summaryData.estimated_tax}
            totalTransactions={summaryData.total_transactions}
            stcg={summaryData.stcg}
            ltcg={summaryData.ltcg}
            gst={summaryData.gst_applicable}
          />
        )}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-secondary border border-border">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <TransactionForm onAddTransaction={handleAddTransaction} />
                <FileUpload onTransactionsUploaded={handleBulkUpload} />
              </div>
              <TransactionTable transactions={frontendTransactions} />
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-8">
            <TaxAnalytics transactions={frontendTransactions} />
          </TabsContent>
          <TabsContent value="reports" className="mt-8">
            <div className="max-w-2xl mx-auto">
              {reportSummary && <ReportGenerator transactions={frontendTransactions} taxSummary={reportSummary} />}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

