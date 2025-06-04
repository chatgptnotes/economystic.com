
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { toast } = useToast();

  const handleQuickCall = () => {
    toast({
      title: "Quick Call",
      description: "Initiating quick call feature...",
    });
  };

  const handleWhatsApp = () => {
    toast({
      title: "WhatsApp",
      description: "Opening WhatsApp interface...",
    });
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };

  const handleProfile = () => {
    toast({
      title: "Profile",
      description: "Opening user profile...",
    });
  };

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
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleQuickCall}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <Phone className="h-4 w-4 mr-2" />
            Quick Call
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleWhatsApp}
            className="hover:bg-green-50 hover:border-green-300"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="relative hover:bg-red-50 hover:border-red-300" 
            onClick={handleNotifications}
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 min-w-0 h-5">
              3
            </Badge>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleProfile}
            className="hover:bg-gray-50 hover:border-gray-300"
          >
            <User className="h-4 w-4 mr-2" />
            Dr. Admin
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
