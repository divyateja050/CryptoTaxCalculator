import { Button } from "@/components/ui/button";
import { TrendingUp, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CryptoTax</h1>
            <p className="text-xs text-muted-foreground">Tax Dashboard</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="gap-2 border-border hover:bg-secondary hover:text-foreground transition-smooth"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
