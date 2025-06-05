
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ambulance, ArrowLeft, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AmbulanceBooking {
  id: string;
  patient_name: string;
  phone_number: string;
  pickup_location: string;
  destination: string;
  status: string;
  booking_time: string;
  ambulance_type: string;
  driver_name: string;
  created_at: string;
}

const AmbulanceBookings = () => {
  const [bookings, setBookings] = useState<AmbulanceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      console.log('Fetching ambulance bookings...');
      const { data, error } = await supabase
        .from('ambulance_bookings')
        .select('*')
        .order('booking_time', { ascending: false });

      if (error) {
        console.error('Error fetching ambulance bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load ambulance bookings",
          variant: "destructive",
        });
        return;
      }

      console.log('Ambulance bookings fetched:', data?.length || 0);
      setBookings(data || []);
    } catch (error) {
      console.error('Error in fetchBookings:', error);
      toast({
        title: "Error",
        description: "Failed to load ambulance bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up real-time subscription
    const subscription = supabase
      .channel('ambulance_bookings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ambulance_bookings' }, 
        () => {
          console.log('Ambulance booking data changed, refreshing...');
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (timeString: string) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(timeString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Loading ambulance bookings...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">Ambulance Bookings</h1>
              <p className="text-gray-600">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          <Button>
            <Ambulance className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="h-5 w-5 mr-2 text-blue-600" />
              Ambulance Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Ambulance className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  Upload ambulance booking reports to see data here.
                </p>
                <Link to="/" className="mt-4 inline-block">
                  <Button variant="outline">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.patient_name || 'Unknown Patient'}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status || 'pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {booking.phone_number || 'No phone number'}
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Pickup:</strong> {booking.pickup_location || 'Not specified'}</p>
                          <p><strong>Destination:</strong> {booking.destination || 'Not specified'}</p>
                          <p><strong>Ambulance Type:</strong> {booking.ambulance_type || 'Standard'}</p>
                          <p><strong>Driver:</strong> {booking.driver_name || 'Not assigned'}</p>
                          <p><strong>Booking Time:</strong> {formatDate(booking.booking_time)} at {formatTime(booking.booking_time)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
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

export default AmbulanceBookings;
