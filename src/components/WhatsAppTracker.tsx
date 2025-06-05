
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Check, CheckCheck, Clock } from "lucide-react";
import { useCallAPI } from "@/hooks/useCallAPI";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  const { makeCall, isLoading } = useCallAPI();

  const { data: messages = [] } = useQuery({
    queryKey: ['whatsapp-tracker-messages'],
    queryFn: async () => {
      console.log('Fetching WhatsApp messages for tracker...');
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4); // Show only latest 4 messages in tracker

      if (error) {
        console.error('Error fetching WhatsApp messages for tracker:', error);
        throw error;
      }

      console.log('Fetched WhatsApp tracker messages:', data);

      return data?.map(msg => ({
        id: msg.id,
        patientName: msg.patient_name || 'Unknown Patient',
        phoneNumber: msg.phone_number || 'No Phone',
        messageType: msg.message_type || 'General',
        content: msg.message_content || 'No content',
        sentTime: msg.sent_time ? formatTimeAgo(new Date(msg.sent_time)) : 'Unknown time',
        status: mapDeliveryStatus(msg.delivery_status),
        followUpRequired: !msg.response && msg.delivery_status !== 'read'
      })) || [];
    }
  });

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const mapDeliveryStatus = (status: string | null): "sent" | "delivered" | "read" | "pending" => {
    if (!status) return "pending";
    switch (status.toLowerCase()) {
      case 'sent': return 'sent';
      case 'delivered': return 'delivered';
      case 'read': return 'read';
      default: return 'pending';
    }
  };

  const handleCallNow = async (phoneNumber: string, patientName: string) => {
    console.log(`Making follow-up call to ${patientName} at ${phoneNumber}`);
    await makeCall({ phoneNumber });
  };

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

  const followUpCount = messages.filter(m => m.followUpRequired).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
            WhatsApp Message Tracking
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {followUpCount} need follow-up
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No WhatsApp messages found. Upload reports to see tracking data.
          </div>
        ) : (
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCallNow(message.phoneNumber, message.patientName)}
                        disabled={isLoading}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {isLoading ? 'Calling...' : 'Call Now'}
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
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppTracker;
