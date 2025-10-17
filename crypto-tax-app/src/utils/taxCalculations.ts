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

/**
 * Calculate comprehensive tax summary based on Indian tax rules
 * STCG: Short-term capital gains (held < 3 years) - taxed at 30%
 * LTCG: Long-term capital gains (held >= 3 years) - taxed at 20%
 * GST: 18% on transaction fees (simplified as 1% of transaction value)
 */
export const calculateIndianTax = (transactions: Transaction[]): TaxSummary => {
  let totalBuys = 0;
  let totalSells = 0;
  let stcgAmount = 0;
  let ltcgAmount = 0;
  let gstAmount = 0;

  // Group transactions by asset to track holding period
  const assetHoldings: Record<string, { buyDate: string; buyPrice: number; amount: number }[]> = {};

  transactions.forEach((tx) => {
    const total = tx.amount * tx.price;
    
    if (tx.type === "buy") {
      totalBuys += total;
      
      // Track buy transactions for FIFO calculation
      if (!assetHoldings[tx.asset]) {
        assetHoldings[tx.asset] = [];
      }
      assetHoldings[tx.asset].push({
        buyDate: tx.date,
        buyPrice: tx.price,
        amount: tx.amount,
      });
      
      // GST on buy transactions (1% simplified)
      gstAmount += total * 0.01;
    } else {
      totalSells += total;
      
      // Calculate capital gains using FIFO
      if (assetHoldings[tx.asset] && assetHoldings[tx.asset].length > 0) {
        let remainingAmount = tx.amount;
        
        while (remainingAmount > 0 && assetHoldings[tx.asset].length > 0) {
          const oldestBuy = assetHoldings[tx.asset][0];
          const amountToSell = Math.min(remainingAmount, oldestBuy.amount);
          
          // Calculate holding period in years
          const buyDate = new Date(oldestBuy.buyDate);
          const sellDate = new Date(tx.date);
          const holdingYears = (sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          
          // Calculate gain/loss
          const costBasis = amountToSell * oldestBuy.buyPrice;
          const saleProceeds = amountToSell * tx.price;
          const gain = saleProceeds - costBasis;
          
          // Categorize as STCG or LTCG
          if (holdingYears < 3) {
            stcgAmount += gain;
          } else {
            ltcgAmount += gain;
          }
          
          // Update holdings
          oldestBuy.amount -= amountToSell;
          if (oldestBuy.amount <= 0) {
            assetHoldings[tx.asset].shift();
          }
          
          remainingAmount -= amountToSell;
        }
      }
      
      // GST on sell transactions (1% simplified)
      gstAmount += total * 0.01;
    }
  });

  // Calculate taxes
  // STCG taxed at 30%
  const stcgTax = Math.max(0, stcgAmount * 0.30);
  // LTCG taxed at 20% (with indexation benefit in reality, simplified here)
  const ltcgTax = Math.max(0, ltcgAmount * 0.20);
  
  const totalCapitalGains = stcgAmount + ltcgAmount;
  const totalEstimatedTax = stcgTax + ltcgTax;

  return {
    capitalGains: totalCapitalGains,
    estimatedTax: totalEstimatedTax,
    totalTransactions: transactions.length,
    stcg: stcgAmount,
    ltcg: ltcgAmount,
    gst: gstAmount,
  };
};
