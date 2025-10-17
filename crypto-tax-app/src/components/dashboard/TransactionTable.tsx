import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

interface Transaction {
  id: string;
  asset: string;
  type: "buy" | "sell";
  date: string;
  amount: number;
  price: number;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>All your recorded cryptocurrency transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Asset</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground text-right">Price</TableHead>
                <TableHead className="text-muted-foreground text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No transactions yet. Add your first transaction above.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-border hover:bg-secondary/50 transition-smooth">
                    <TableCell className="font-medium">{transaction.asset}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === "buy" ? "default" : "destructive"}
                        className={
                          transaction.type === "buy"
                            ? "bg-success/20 text-success hover:bg-success/30 border-success/40"
                            : "bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/40"
                        }
                      >
                        {transaction.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="text-right">{transaction.amount}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.price)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount * transaction.price)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
