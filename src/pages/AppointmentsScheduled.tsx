
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Appointment {
  id: string;
  patientName: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  doctor: string;
  status: "confirmed" | "pending" | "cancelled";
}

const AppointmentsScheduled = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Doe",
      phoneNumber: "+91 98765 43210",
      appointmentDate: "2024-06-05",
      appointmentTime: "10:00 AM",
      service: "General Consultation",
      doctor: "Dr. Smith",
      status: "confirmed"
    },
    {
      id: "2",
      patientName: "Sarah Smith",
      phoneNumber: "+91 87654 32109",
      appointmentDate: "2024-06-05",
      appointmentTime: "11:30 AM",
      service: "Cardiology Checkup",
      doctor: "Dr. Johnson",
      status: "confirmed"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      phoneNumber: "+91 76543 21098",
      appointmentDate: "2024-06-06",
      appointmentTime: "02:00 PM",
      service: "Dental Cleaning",
      doctor: "Dr. Brown",
      status: "pending"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
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
              <h1 className="text-2xl font-bold text-gray-900">Appointments Scheduled</h1>
              <p className="text-gray-600">89 appointments scheduled (+15% from yesterday)</p>
            </div>
          </div>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Phone:</strong> {appointment.phoneNumber}</p>
                        <p><strong>Service:</strong> {appointment.service}</p>
                        <p><strong>Doctor:</strong> {appointment.doctor}</p>
                        <p><strong>Date & Time:</strong> {appointment.appointmentDate} at {appointment.appointmentTime}</p>
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

export default AppointmentsScheduled;
