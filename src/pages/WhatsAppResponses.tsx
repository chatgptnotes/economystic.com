import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowLeft, Phone, Check, CheckCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface WhatsAppMessage {
  id: string;
  patientName: string;
  phoneNumber: string;
  messageType: string;
  content: string;
  sentTime: string;
  status: "sent" | "delivered" | "read" | "pending";
  responseReceived: boolean;
}

const WhatsAppResponses = () => {
  const [messages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      patientName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
      messageType: "Appointment Reminder",
      content: "Your appointment is scheduled for tomorrow at 10 AM",
      sentTime: "2 hours ago",
      status: "read",
      responseReceived: true
    },
    {
      id: "2",
      patientName: "Priya Sharma",
      phoneNumber: "+91 87654 32109",
      messageType: "Test Results",
      content: "Your blood test results are ready for collection",
      sentTime: "4 hours ago",
      status: "delivered",
      responseReceived: false
    },
    {
      id: "3",
      patientName: "Arjun Patel",
      phoneNumber: "+91 76543 21098",
      messageType: "Payment Reminder",
      content: "Gentle reminder: Your payment of ₹2,500 is pending",
      sentTime: "6 hours ago",
      status: "read",
      responseReceived: true
    }
  ]);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Responses</h1>
              <p className="text-gray-600">156 messages sent today (-2% from yesterday)</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
              WhatsApp Message Status
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
                        {message.responseReceived && (
                          <Badge className="bg-green-100 text-green-800">
                            Response Received
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Phone:</strong> {message.phoneNumber}</p>
                        <p><strong>Type:</strong> {message.messageType}</p>
                        <p><strong>Message:</strong> "{message.content}"</p>
                        <p><strong>Sent:</strong> {message.sentTime}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {!message.responseReceived && (
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Follow Up Call
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
      </div>
    </div>
  );
};

export default WhatsAppResponses;
