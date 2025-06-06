
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowLeft, Phone, Check, CheckCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
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
  responseReceived: boolean;
}

const WhatsAppResponses = () => {
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['whatsapp-messages'],
    queryFn: async () => {
      console.log('Fetching WhatsApp messages from Supabase...');
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching WhatsApp messages:', error);
        throw error;
      }

      console.log('Fetched WhatsApp messages:', data);

      return data?.map(msg => ({
        id: msg.id,
        patientName: msg.patient_name || 'Unknown Patient',
        phoneNumber: msg.phone_number || 'No Phone',
        messageType: msg.message_type || 'General',
        content: msg.message_content || 'No content',
        sentTime: msg.sent_time ? new Date(msg.sent_time).toLocaleString() : 'Unknown time',
        status: mapDeliveryStatus(msg.delivery_status),
        responseReceived: !!msg.response
      })) || [];
    }
  });

  const mapDeliveryStatus = (status: string | null): "sent" | "delivered" | "read" | "pending" => {
    if (!status) return "pending";
    switch (status.toLowerCase()) {
      case 'sent': return 'sent';
      case 'delivered': return 'delivered';
      case 'read': return 'read';
      default: return 'pending';
    }
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

  const totalMessages = messages.length;
  const responsesReceived = messages.filter(m => m.responseReceived).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading WhatsApp messages...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error loading messages: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-600">
                {totalMessages} messages total • {responsesReceived} responses received
              </p>
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
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No WhatsApp messages found. Upload reports or add messages to see data here.
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppResponses;
