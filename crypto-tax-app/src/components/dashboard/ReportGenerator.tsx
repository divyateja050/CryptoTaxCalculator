import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface Transaction {
  id: string;
  asset: string;
  type: "buy" | "sell";
  date: string;
  amount: number;
  price: number;
}

interface TaxSummary {
  capitalGains: number;
  estimatedTax: number;
  totalTransactions: number;
  stcg: number;
  ltcg: number;
  gst: number;
}

interface ReportGeneratorProps {
  transactions: Transaction[];
  taxSummary: TaxSummary;
}

const ReportGenerator = ({ transactions, taxSummary }: ReportGeneratorProps) => {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(158, 90, 240); // Primary color
      doc.text("CryptoTax Pro - Tax Report", 105, 20, { align: "center" });
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });
      
      // Tax Summary Section
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Tax Summary", 20, 45);
      
      doc.setFontSize(11);
      doc.setTextColor(60);
      const summaryY = 55;
      doc.text(`Total Capital Gains: ₹${taxSummary.capitalGains.toLocaleString("en-IN")}`, 20, summaryY);
      doc.text(`STCG (Short-Term): ₹${taxSummary.stcg.toLocaleString("en-IN")}`, 20, summaryY + 8);
      doc.text(`LTCG (Long-Term): ₹${taxSummary.ltcg.toLocaleString("en-IN")}`, 20, summaryY + 16);
      doc.text(`GST Applicable: ₹${taxSummary.gst.toLocaleString("en-IN")}`, 20, summaryY + 24);
      doc.text(`Estimated Tax (30%): ₹${taxSummary.estimatedTax.toLocaleString("en-IN")}`, 20, summaryY + 32);
      doc.text(`Total Transactions: ${taxSummary.totalTransactions}`, 20, summaryY + 40);
      
      // Transactions Section
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Transaction Details", 20, summaryY + 55);
      
      // Table headers
      doc.setFontSize(10);
      doc.setTextColor(100);
      let yPos = summaryY + 65;
      doc.text("Asset", 20, yPos);
      doc.text("Type", 60, yPos);
      doc.text("Date", 80, yPos);
      doc.text("Amount", 120, yPos);
      doc.text("Price", 150, yPos);
      doc.text("Total", 175, yPos);
      
      // Table rows
      doc.setTextColor(60);
      yPos += 8;
      
      transactions.slice(0, 15).forEach((tx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(tx.asset.substring(0, 15), 20, yPos);
        doc.text(tx.type.toUpperCase(), 60, yPos);
        doc.text(new Date(tx.date).toLocaleDateString(), 80, yPos);
        doc.text(tx.amount.toString(), 120, yPos);
        doc.text(`₹${tx.price.toLocaleString("en-IN")}`, 150, yPos);
        doc.text(`₹${(tx.amount * tx.price).toLocaleString("en-IN")}`, 175, yPos);
        yPos += 7;
      });
      
      if (transactions.length > 15) {
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`...and ${transactions.length - 15} more transactions`, 20, yPos);
      }
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("This is an automated report. For audit purposes, please verify all calculations.", 105, 285, { align: "center" });
      
      doc.save("cryptotax-report.pdf");
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  const generateExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ["CryptoTax Pro - Tax Report"],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [],
        ["Tax Summary"],
        ["Total Capital Gains", `₹${taxSummary.capitalGains.toLocaleString("en-IN")}`],
        ["STCG (Short-Term)", `₹${taxSummary.stcg.toLocaleString("en-IN")}`],
        ["LTCG (Long-Term)", `₹${taxSummary.ltcg.toLocaleString("en-IN")}`],
        ["GST Applicable", `₹${taxSummary.gst.toLocaleString("en-IN")}`],
        ["Estimated Tax (30%)", `₹${taxSummary.estimatedTax.toLocaleString("en-IN")}`],
        ["Total Transactions", taxSummary.totalTransactions],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
      
      // Transactions sheet
      const transactionData = transactions.map((tx) => ({
        Asset: tx.asset,
        Type: tx.type.toUpperCase(),
        Date: tx.date,
        Amount: tx.amount,
        Price: tx.price,
        "Total Value": tx.amount * tx.price,
      }));
      const txSheet = XLSX.utils.json_to_sheet(transactionData);
      XLSX.utils.book_append_sheet(wb, txSheet, "Transactions");
      
      XLSX.writeFile(wb, "cryptotax-report.xlsx");
      toast.success("Excel report downloaded successfully");
    } catch (error) {
      console.error("Excel generation error:", error);
      toast.error("Failed to generate Excel report");
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
        <CardDescription>Download audit-ready reports for tax filing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={generatePDF}
          className="w-full bg-gradient-primary hover:opacity-90 transition-smooth text-primary-foreground font-medium"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Download PDF Report
        </Button>
        <Button
          onClick={generateExcel}
          variant="outline"
          className="w-full border-border hover:bg-secondary transition-smooth"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Download Excel Report
        </Button>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Report includes:</p>
          <ul className="space-y-1 text-xs">
            <li>• Complete tax summary with STCG, LTCG, and GST</li>
            <li>• Detailed transaction history</li>
            <li>• Capital gains calculations</li>
            <li>• Ready for tax filing and audits</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
