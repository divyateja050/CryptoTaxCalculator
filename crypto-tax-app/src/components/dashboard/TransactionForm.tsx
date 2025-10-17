import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    asset: string;
    type: "buy" | "sell";
    date: string;
    amount: number;
    price: number;
  }) => void;
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [asset, setAsset] = useState("");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!asset || !date || !amount || !price) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddTransaction({
      asset,
      type,
      date,
      amount: parseFloat(amount),
      price: parseFloat(price),
    });

    // Reset form
    setAsset("");
    setType("buy");
    setDate("");
    setAmount("");
    setPrice("");

    toast.success("Transaction added successfully!");
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add Transaction
        </CardTitle>
        <CardDescription>Enter your cryptocurrency transaction details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset Name</Label>
            <Input
              id="asset"
              type="text"
              placeholder="e.g., Bitcoin, Ethereum"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="bg-secondary border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={type} onValueChange={(value: "buy" | "sell") => setType(value)}>
              <SelectTrigger className="bg-secondary border-border focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary border-border focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-secondary border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-secondary border-border focus:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth text-primary-foreground font-medium shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
