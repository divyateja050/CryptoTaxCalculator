import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface Transaction {
  asset: string;
  type: "buy" | "sell";
  date: string;
  amount: number;
  price: number;
}

interface FileUploadProps {
  onTransactionsUploaded: (transactions: Omit<Transaction, "id">[]) => void;
}

const FileUpload = ({ onTransactionsUploaded }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const transactions = results.data
            .filter((row: any) => row.asset && row.type && row.date)
            .map((row: any) => ({
              asset: row.asset || row.Asset,
              type: (row.type || row.Type).toLowerCase() as "buy" | "sell",
              date: row.date || row.Date,
              amount: parseFloat(row.amount || row.Amount),
              price: parseFloat(row.price || row.Price),
            }));

          if (transactions.length > 0) {
            onTransactionsUploaded(transactions);
            toast.success(`Successfully uploaded ${transactions.length} transactions`);
          } else {
            toast.error("No valid transactions found in file");
          }
        } catch (error) {
          toast.error("Error parsing CSV file");
        } finally {
          setUploading(false);
        }
      },
      error: () => {
        toast.error("Failed to parse CSV file");
        setUploading(false);
      },
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const transactions = jsonData
          .filter((row) => row.asset && row.type && row.date)
          .map((row) => ({
            asset: row.asset || row.Asset,
            type: (row.type || row.Type).toLowerCase() as "buy" | "sell",
            date: row.date || row.Date,
            amount: parseFloat(row.amount || row.Amount),
            price: parseFloat(row.price || row.Price),
          }));

        if (transactions.length > 0) {
          onTransactionsUploaded(transactions);
          toast.success(`Successfully uploaded ${transactions.length} transactions`);
        } else {
          toast.error("No valid transactions found in file");
        }
      } catch (error) {
        toast.error("Error parsing Excel file");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      parseCSV(file);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      parseExcel(file);
    } else {
      toast.error("Please upload a CSV or Excel file");
      setUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          Bulk Upload Transactions
        </CardTitle>
        <CardDescription>Upload your transaction history via CSV or Excel file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth cursor-pointer bg-secondary/30">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium mb-2">
              {uploading ? "Processing..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">CSV or Excel (XLSX, XLS) up to 10MB</p>
          </label>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Required columns:</p>
              <p>• asset - Name of the cryptocurrency</p>
              <p>• type - "buy" or "sell"</p>
              <p>• date - Transaction date (YYYY-MM-DD)</p>
              <p>• amount - Quantity of crypto</p>
              <p>• price - Price per unit in INR</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-gradient-primary hover:opacity-90 transition-smooth text-primary-foreground font-medium"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Processing..." : "Select File"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
