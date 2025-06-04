
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, ArrowLeft, Phone, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface NewPatient {
  id: string;
  name: string;
  phone: string;
  email: string;
  registrationDate: string;
  source: "Walk-in" | "Google Ads" | "JustDial" | "Referral";
  status: "registered" | "appointment-scheduled" | "contacted";
  service: string;
}

const NewPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState<NewPatient[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "john.doe@email.com",
      registrationDate: "2024-06-04",
      source: "Google Ads",
      status: "registered",
      service: "General Consultation"
    },
    {
      id: "2",
      name: "Sarah Smith",
      phone: "+91 87654 32109",
      email: "sarah.smith@email.com",
      registrationDate: "2024-06-04",
      source: "JustDial",
      status: "appointment-scheduled",
      service: "Cardiology Checkup"
    },
    {
      id: "3",
      name: "Mike Johnson",
      phone: "+91 76543 21098",
      email: "mike.johnson@email.com",
      registrationDate: "2024-06-04",
      source: "Walk-in",
      status: "contacted",
      service: "Dental Consultation"
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered": return "bg-blue-100 text-blue-800";
      case "appointment-scheduled": return "bg-green-100 text-green-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Google Ads": return "bg-red-100 text-red-800";
      case "JustDial": return "bg-orange-100 text-orange-800";
      case "Referral": return "bg-purple-100 text-purple-800";
      case "Walk-in": return "bg-teal-100 text-teal-800";
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
              <h1 className="text-2xl font-bold text-gray-900">New Patients</h1>
              <p className="text-gray-600">34 new patients today (+8% from yesterday)</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Today's New Patients
              </div>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search new patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getSourceColor(patient.source)}>
                          {patient.source}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Phone:</strong> {patient.phone}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Service:</strong> {patient.service}</p>
                        <p><strong>Registered:</strong> {patient.registrationDate}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Appointment
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

export default NewPatients;
