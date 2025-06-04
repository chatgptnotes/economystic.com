
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Check, CheckCheck, Clock } from "lucide-react";

interface WhatsAppMessage {
  id: string;
  patientName: string;
  phoneNumber: string;
  messageType: string;
  content: string;
  sentTime: string;
  status: "sent" | "delivered" | "read" | "pending";
  followUpRequired: boolean;
}

const WhatsAppTracker = () => {
  const messages: WhatsAppMessage[] = [
    {
      id: "1",
      patientName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
      messageType: "Appointment Reminder",
      content: "Your appointment is scheduled for tomorrow at 10 AM",
      sentTime: "2 hours ago",
      status: "read",
      followUpRequired: false
    },
    {
      id: "2",
      patientName: "Priya Sharma",
      phoneNumber: "+91 87654 32109",
      messageType: "Test Results",
      content: "Your blood test results are ready for collection",
      sentTime: "4 hours ago",
      status: "delivered",
      followUpRequired: true
    },
    {
      id: "3",
      patientName: "Arjun Patel",
      phoneNumber: "+91 76543 21098",
      messageType: "Payment Reminder",
      content: "Gentle reminder: Your payment of ₹2,500 is pending",
      sentTime: "6 hours ago",
      status: "sent",
      followUpRequired: true
    },
    {
      id: "4",
      patientName: "Kavya Nair",
      phoneNumber: "+91 65432 10987",
      messageType: "Prescription Ready",
      content: "Your prescription is ready for pickup at pharmacy",
      sentTime: "1 day ago",
      status: "pending",
      followUpRequired: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Check className="h-4 w-4 text-gray-500" />;
      case "delivered": return <CheckCheck className="h-4 w-4 text-gray-500" />;
      case "read": return <CheckCheck className="h-4 w-4 text-blue-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read": return "bg-green-100 text-green-800";
      case "delivered": return "bg-blue-100 text-blue-800";
      case "sent": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
            WhatsApp Message Tracking
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {messages.filter(m => m.followUpRequired).length} need follow-up
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{message.patientName}</h3>
                    <Badge className={getStatusColor(message.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(message.status)}
                        <span className="capitalize">{message.status}</span>
                      </div>
                    </Badge>
                    {message.followUpRequired && (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Follow-up Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{message.phoneNumber}</p>
                  <p className="text-sm font-medium text-gray-700 mb-2">{message.messageType}</p>
                  <p className="text-sm text-gray-600 mb-2">"{message.content}"</p>
                  <p className="text-xs text-gray-500">{message.sentTime}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {message.followUpRequired && (
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Now
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppTracker;
