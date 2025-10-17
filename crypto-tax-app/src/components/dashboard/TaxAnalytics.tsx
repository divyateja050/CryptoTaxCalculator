import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  asset: string;
  type: "buy" | "sell";
  date: string;
  amount: number;
  price: number;
}

interface TaxAnalyticsProps {
  transactions: Transaction[];
}

const COLORS = ["hsl(280 85% 65%)", "hsl(330 80% 65%)", "hsl(45 95% 60%)", "hsl(142 70% 50%)", "hsl(213 100% 67%)"];

const TaxAnalytics = ({ transactions }: TaxAnalyticsProps) => {
  // Portfolio distribution by asset
  const portfolioData = transactions.reduce((acc: any[], tx) => {
    const existing = acc.find((item) => item.name === tx.asset);
    const value = tx.amount * tx.price;
    
    if (existing) {
      existing.value += tx.type === "buy" ? value : -value;
    } else {
      acc.push({ name: tx.asset, value: tx.type === "buy" ? value : -value });
    }
    return acc;
  }, []).filter(item => item.value > 0);

  // Monthly transaction trends
  const monthlyData = transactions.reduce((acc: any[], tx) => {
    const month = new Date(tx.date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const existing = acc.find((item) => item.month === month);
    const value = tx.amount * tx.price;
    
    if (existing) {
      if (tx.type === "buy") {
        existing.buys += value;
      } else {
        existing.sells += value;
      }
    } else {
      acc.push({
        month,
        buys: tx.type === "buy" ? value : 0,
        sells: tx.type === "sell" ? value : 0,
      });
    }
    return acc;
  }, []);

  // Tax liability by asset
  const taxByAsset = transactions.reduce((acc: any[], tx) => {
    if (tx.type === "sell") {
      const existing = acc.find((item) => item.asset === tx.asset);
      const value = tx.amount * tx.price;
      const estimatedTax = value * 0.3; // Simplified tax calculation
      
      if (existing) {
        existing.tax += estimatedTax;
      } else {
        acc.push({ asset: tx.asset, tax: estimatedTax });
      }
    }
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Distribution */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Portfolio Distribution
          </CardTitle>
          <CardDescription>Asset allocation by current value</CardDescription>
        </CardHeader>
        <CardContent>
          {portfolioData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  formatter={(value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No portfolio data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle>Monthly Transaction Trends</CardTitle>
          <CardDescription>Buy vs Sell activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  formatter={(value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                />
                <Legend />
                <Bar dataKey="buys" fill="hsl(142 70% 50%)" name="Buys" />
                <Bar dataKey="sells" fill="hsl(0 85% 60%)" name="Sells" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No transaction data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Liability by Asset */}
      <Card className="shadow-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>Tax Liability by Asset</CardTitle>
          <CardDescription>Estimated tax on capital gains (30% rate)</CardDescription>
        </CardHeader>
        <CardContent>
          {taxByAsset.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taxByAsset}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="asset" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  formatter={(value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="tax" 
                  stroke="hsl(280 85% 65%)" 
                  strokeWidth={3}
                  name="Estimated Tax"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No tax liability data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxAnalytics;
