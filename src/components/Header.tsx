
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Phone, MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HealthCare CRM</h1>
          <p className="text-sm text-gray-600">Telecaller Dashboard & Patient Management</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
            </Badge>
          </div>
          
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Quick Call
          </Button>
          
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 min-w-0 h-5">
              3
            </Badge>
          </Button>
          
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Dr. Admin
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
