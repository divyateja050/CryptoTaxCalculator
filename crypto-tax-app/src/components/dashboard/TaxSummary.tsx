import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Hash } from "lucide-react";

interface TaxSummaryProps {
  capitalGains: number;
  estimatedTax: number;
  totalTransactions: number;
  stcg: number;
  ltcg: number;
  gst: number;
}

const TaxSummary = ({ capitalGains, estimatedTax, totalTransactions, stcg, ltcg, gst }: TaxSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border hover:shadow-glow transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Capital Gains
            </CardTitle>
            <TrendingUp className={`w-5 h-5 ${capitalGains >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${capitalGains >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(capitalGains)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {capitalGains >= 0 ? 'Profit' : 'Loss'} from all transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border hover:shadow-glow transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated Tax
            </CardTitle>
            <DollarSign className="w-5 h-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {formatCurrency(estimatedTax)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on Indian tax rules
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border hover:shadow-glow transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
            <Hash className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recorded transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tax Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border bg-gradient-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              STCG (Short-Term)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(stcg)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              &lt; 3 years holding • 30% tax
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border bg-gradient-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              LTCG (Long-Term)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(ltcg)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ≥ 3 years holding • 20% tax
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border bg-gradient-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              GST Applicable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(gst)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              On transaction fees
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxSummary;
