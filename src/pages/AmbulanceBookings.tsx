
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ambulance, ArrowLeft, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface AmbulanceBooking {
  id: string;
  patientName: string;
  phoneNumber: string;
  pickupLocation: string;
  destination: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  bookingTime: string;
  scheduledTime: string;
}

const AmbulanceBookings = () => {
  const [bookings] = useState<AmbulanceBooking[]>([
    {
      id: "1",
      patientName: "John Doe",
      phoneNumber: "+91 98765 43210",
      pickupLocation: "123 Main St, Mumbai",
      destination: "City Hospital",
      status: "confirmed",
      bookingTime: "09:15 AM",
      scheduledTime: "10:00 AM"
    },
    {
      id: "2",
      patientName: "Sarah Smith",
      phoneNumber: "+91 87654 32109",
      pickupLocation: "456 Park Ave, Mumbai",
      destination: "Emergency Care Center",
      status: "completed",
      bookingTime: "08:30 AM",
      scheduledTime: "09:15 AM"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      phoneNumber: "+91 76543 21098",
      pickupLocation: "789 Oak St, Mumbai",
      destination: "Specialty Clinic",
      status: "pending",
      bookingTime: "11:20 AM",
      scheduledTime: "12:30 PM"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
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
              <h1 className="text-2xl font-bold text-gray-900">Ambulance Bookings</h1>
              <p className="text-gray-600">18 bookings today (+3 from yesterday)</p>
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
              Today's Ambulance Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.patientName}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{booking.phoneNumber}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                        <p><strong>Destination:</strong> {booking.destination}</p>
                        <p><strong>Booked at:</strong> {booking.bookingTime}</p>
                        <p><strong>Scheduled for:</strong> {booking.scheduledTime}</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmbulanceBookings;
