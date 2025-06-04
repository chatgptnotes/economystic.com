
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Ambulance, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface CallRecord {
  id: string;
  patient_name: string | null;
  phone_number: string | null;
  call_type: string | null;
  call_duration: number | null;
  call_status: string | null;
  call_time: string | null;
  notes: string | null;
  created_at: string;
}

interface WhatsAppMessage {
  id: string;
  patient_name: string | null;
  phone_number: string | null;
  message_content: string | null;
  message_type: string | null;
  sent_time: string | null;
  delivery_status: string | null;
  read_status: string | null;
  created_at: string;
}

interface AmbulanceBooking {
  id: string;
  patient_name: string | null;
  phone_number: string | null;
  pickup_location: string | null;
  destination: string | null;
  booking_time: string | null;
  ambulance_type: string | null;
  status: string | null;
  driver_name: string | null;
  created_at: string;
}

const DataTables = () => {
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
  const [ambulanceBookings, setAmbulanceBookings] = useState<AmbulanceBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch call records
        const { data: calls } = await supabase
          .from('call_records')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch WhatsApp messages
        const { data: messages } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch ambulance bookings
        const { data: bookings } = await supabase
          .from('ambulance_bookings')
          .select('*')
          .order('created_at', { ascending: false });

        setCallRecords(calls || []);
        setWhatsappMessages(messages || []);
        setAmbulanceBookings(bookings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading data...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Data Tables</h1>
          <p className="text-gray-600 mt-2">
            View all extracted data from uploaded reports
          </p>
        </div>

        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="calls" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Call Records ({callRecords.length})</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Messages ({whatsappMessages.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ambulance" className="flex items-center space-x-2">
              <Ambulance className="h-4 w-4" />
              <span>Ambulance Bookings ({ambulanceBookings.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Call Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {callRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No call records found</p>
                    <p className="text-sm">Upload call center reports to see data here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Call Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Call Time</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {callRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {record.patient_name || 'Unknown'}
                            </TableCell>
                            <TableCell>{record.phone_number || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {record.call_type || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDuration(record.call_duration)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={record.call_status === 'completed' ? 'default' : 'secondary'}
                              >
                                {record.call_status || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDateTime(record.call_time)}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {record.notes || 'No notes'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  WhatsApp Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {whatsappMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No WhatsApp messages found</p>
                    <p className="text-sm">Upload WhatsApp reports to see data here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Message Content</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Sent Time</TableHead>
                          <TableHead>Delivery Status</TableHead>
                          <TableHead>Read Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {whatsappMessages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">
                              {message.patient_name || 'Unknown'}
                            </TableCell>
                            <TableCell>{message.phone_number || 'N/A'}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {message.message_content || 'No content'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {message.message_type || 'text'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDateTime(message.sent_time)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={message.delivery_status === 'delivered' ? 'default' : 'secondary'}
                              >
                                {message.delivery_status || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={message.read_status === 'read' ? 'default' : 'secondary'}
                              >
                                {message.read_status || 'unread'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ambulance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ambulance className="h-5 w-5 mr-2 text-red-600" />
                  Ambulance Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ambulanceBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Ambulance className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No ambulance bookings found</p>
                    <p className="text-sm">Upload ambulance reports to see data here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Pickup Location</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Booking Time</TableHead>
                          <TableHead>Ambulance Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Driver</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ambulanceBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.patient_name || 'Unknown'}
                            </TableCell>
                            <TableCell>{booking.phone_number || 'N/A'}</TableCell>
                            <TableCell>{booking.pickup_location || 'N/A'}</TableCell>
                            <TableCell>{booking.destination || 'N/A'}</TableCell>
                            <TableCell>{formatDateTime(booking.booking_time)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {booking.ambulance_type || 'standard'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={booking.status === 'completed' ? 'default' : 'secondary'}
                              >
                                {booking.status || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>{booking.driver_name || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DataTables;
