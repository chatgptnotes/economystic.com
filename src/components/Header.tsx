
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Activity, FileText, Table, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HealthCare Analytics</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/data-tables">
              <Button 
                variant={isActive("/data-tables") ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Table className="h-4 w-4" />
                <span>Data Tables</span>
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button 
                variant={isActive("/reports") ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
