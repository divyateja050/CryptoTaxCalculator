import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Upload, 
  FileText, 
  BarChart3, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "Automated Tax Calculation",
      description: "Instantly computes STCG, LTCG, and GST based on Indian tax rules with zero manual effort"
    },
    {
      icon: Upload,
      title: "Transaction Upload",
      description: "Upload transaction data via CSV, Excel, or manual entry - supporting all major exchanges"
    },
    {
      icon: FileText,
      title: "Audit-Ready Reports",
      description: "Generate downloadable PDF and Excel reports for filing and auditing compliance"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Visual charts and graphs for portfolio tracking, tax trends, and sector-wise analysis"
    },
    {
      icon: TrendingUp,
      title: "Transparency Dashboard",
      description: "Organization-wise and sector-wise tax insights for complete public awareness"
    },
    {
      icon: Shield,
      title: "Secure Data Management",
      description: "Enterprise-grade security ensuring privacy of your financial and transactional data"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(280_85%_65%_/_0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(330_80%_65%_/_0.15),transparent_50%)]"></div>
        
        <div className="container relative mx-auto px-4 py-20">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-20 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CryptoTax Pro
              </span>
            </div>
            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary transition-smooth"
            >
              Sign In
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-block">
              <span className="px-4 py-2 bg-gradient-primary rounded-full text-sm font-medium text-primary-foreground shadow-glow">
                🚀 India's Most Advanced Crypto Tax Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Simplify Your
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Crypto Taxes</span>
              <br />
              in Minutes
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Automated tax calculations compliant with Indian tax laws. Track STCG, LTCG, and GST 
              with precision. Generate audit-ready reports instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-smooth text-primary-foreground font-semibold shadow-glow text-lg px-8 py-6"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary transition-smooth text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto shadow-card border-border bg-gradient-secondary animate-fade-in">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">The Problem</h2>
            <div className="space-y-4 text-lg text-foreground/90 leading-relaxed">
              <p>
                Crypto taxation is <span className="text-accent font-semibold">complex and confusing</span> for 
                startups and organizations. Manual tracking of transactions often leads to calculation errors, 
                non-compliance, and delayed filings.
              </p>
              <p className="text-muted-foreground">
                There is a strong need for an <span className="text-foreground font-semibold">automated, transparent, 
                and easy-to-use</span> crypto tax platform that simplifies compliance and promotes accountability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage crypto taxes with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="shadow-card border-border hover:shadow-glow transition-smooth group animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-smooth">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card border-border bg-gradient-secondary">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose CryptoTax Pro?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Step-by-step tax guidance for compliance",
                  "Indian tax law compliant calculations",
                  "Supports CSV, Excel, and manual entry",
                  "Visual analytics for better insights",
                  "Downloadable audit reports (PDF/Excel)",
                  "Enterprise-grade data security",
                  "Organization-wise transparency",
                  "Portfolio tracking with tax trends"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                    <span className="text-foreground/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Simplify Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Crypto Taxes?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who trust CryptoTax Pro for accurate, compliant tax calculations
          </p>
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 transition-smooth text-primary-foreground font-semibold shadow-glow text-lg px-10 py-6"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 CryptoTax Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
