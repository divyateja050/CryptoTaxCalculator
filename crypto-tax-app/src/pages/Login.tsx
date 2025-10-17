import { useState, useEffect } from "react"; // Add useEffect
import { useNavigate } from "react-router-dom"; // Keep useNavigate
import { useAuth } from "../context/AuthContext"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Get everything we need from the context, including the token itself
  const { login, isLoading, authToken } = useAuth();
  const navigate = useNavigate();

  // This `useEffect` hook will run whenever the authToken changes.
  // It provides a reliable way to redirect AFTER a successful login.
  useEffect(() => {
    // If a token exists, it means the user is logged in, so navigate away.
    if (authToken) {
      navigate("/dashboard");
    }
  }, [authToken, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // The login function now only handles authentication.
      // The useEffect above will handle the navigation.
      await login(username, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-card border-border">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">CryptoTax</CardTitle>
            <CardDescription className="text-base mt-2">
              Professional Cryptocurrency Tax Calculator
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-secondary border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary border-border focus:ring-primary"
              />
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-smooth text-primary-foreground font-medium shadow-glow"
              disabled={isLoading} // Use the loading state from the context
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Enter the credentials you created with `createsuperuser`.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


