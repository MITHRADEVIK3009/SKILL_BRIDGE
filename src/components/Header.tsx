
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(!!loggedInStatus);
  }, []);

  const handleSignIn = () => {
    console.log("Sign in clicked");
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="text-2xl font-bold gradient-text cursor-pointer" 
              onClick={() => navigate("/")}
            >
              SkillBridge
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              aria-expanded="false"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/courses" className="text-foreground hover:text-primary transition-colors">Courses</Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
            )}
            <Link to="/leaderboard" className="text-foreground hover:text-primary transition-colors">Leaderboard</Link>
          </nav>
          
          <div className="hidden md:flex">
            {isLoggedIn ? (
              <Button className="gradient-bg" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button className="gradient-bg" onClick={handleSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent transition-colors">Home</Link>
            <Link to="/courses" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent transition-colors">Courses</Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent transition-colors">Dashboard</Link>
            )}
            <Link to="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent transition-colors">Leaderboard</Link>
            <div className="pt-2">
              {isLoggedIn ? (
                <Button className="w-full gradient-bg" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Button className="w-full gradient-bg" onClick={handleSignIn}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
