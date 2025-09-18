import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({
        id: "1",
        email,
        name: email.split('@')[0],
        avatar: "/placeholder.svg",
        storiesContributed: 0,
        badges: []
      }));
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to Story Swap.",
      });
      
      navigate("/explore");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-10 w-10 text-white" />
            <span className="text-2xl font-bold text-white">Story Swap</span>
          </div>
          <p className="text-white/80">Welcome back to your story community</p>
        </div>

        <Card className="card-gradient border-0 shadow-hero">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Demo Credentials Section */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">🎯 Demo Credentials</h3>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-blue-800">Admin:</p>
                      <p className="text-blue-700">admin@example.com</p>
                      <p className="text-blue-700">test1234</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">User:</p>
                      <p className="text-blue-700">rita@example.com</p>
                      <p className="text-blue-700">test1234</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => { setEmail("admin@example.com"); setPassword("test1234"); }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
                    >
                      Use Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail("rita@example.com"); setPassword("test1234"); }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
                    >
                      Use Rita
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail("sam@example.com"); setPassword("test1234"); }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
                    >
                      Use Sam
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-glow" 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary-glow transition-colors"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary-glow font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;