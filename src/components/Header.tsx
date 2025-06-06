import { Button } from "@/components/ui/button";
import { Activity, FileText, Table, Home, Search, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const Header = () => {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                economystic.ai
              </h1>
              <p className="text-sm text-slate-500 font-medium">Analytics Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <Link to="/dashboard">
                <Button 
                  variant={isActive("/dashboard") ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 rounded-xl transition-all duration-200 ${
                    isActive("/dashboard") 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700" 
                      : "hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              
              <Link to="/intelligent-search">
                <Button 
                  variant={isActive("/intelligent-search") ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 rounded-xl transition-all duration-200 ${
                    isActive("/intelligent-search") 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700" 
                      : "hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>AI Search</span>
                </Button>
              </Link>
              
              <Link to="/data-tables">
                <Button 
                  variant={isActive("/data-tables") ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 rounded-xl transition-all duration-200 ${
                    isActive("/data-tables") 
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:from-purple-600 hover:to-purple-700" 
                      : "hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <Table className="h-4 w-4" />
                  <span>Data Tables</span>
                </Button>
              </Link>
              
              <Link to="/reports">
                <Button 
                  variant={isActive("/reports") ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 rounded-xl transition-all duration-200 ${
                    isActive("/reports") 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:from-orange-600 hover:to-orange-700" 
                      : "hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Reports</span>
                </Button>
              </Link>

              <Link to="/audit">
                <Button 
                  variant={isActive("/audit") ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 rounded-xl transition-all duration-200 ${
                    isActive("/audit") 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700" 
                      : "hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Audit</span>
                </Button>
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <SignedIn>
                {user && (
                  <span className="text-sm text-gray-700 font-medium">
                    {user.fullName || user.primaryEmailAddress?.emailAddress}
                  </span>
                )}
                <UserButton afterSignOutUrl="/login" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
