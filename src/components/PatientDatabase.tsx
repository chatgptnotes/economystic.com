import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Phone, Calendar, FileText, Edit } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  status: "active" | "inactive" | "new";
  totalVisits: number;
  lastService: string;
  source: "Walk-in" | "Google Ads" | "JustDial" | "Referral";
}

const PatientDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      lastVisit: "2024-06-01",
      status: "active",
      totalVisits: 8,
      lastService: "Rseva COVID Testing",
      source: "Google Ads"
    },
    {
      id: "2",
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com",
      lastVisit: "2024-05-28",
      status: "active",
      totalVisits: 3,
      lastService: "Cardiology Consultation",
      source: "JustDial"
    },
    {
      id: "3",
      name: "Arjun Patel",
      phone: "+91 76543 21098",
      email: "arjun.patel@email.com",
      lastVisit: "2024-05-15",
      status: "inactive",
      totalVisits: 12,
      lastService: "Orthopedic Surgery Follow-up",
      source: "Referral"
    },
    {
      id: "4",
      name: "Kavya Nair",
      phone: "+91 65432 10987",
      email: "kavya.nair@email.com",
      lastVisit: "2024-06-03",
      status: "new",
      totalVisits: 1,
      lastService: "Dental Consultation",
      source: "Walk-in"
    },
    {
      id: "5",
      name: "Vikram Singh",
      phone: "+91 54321 09876",
      email: "vikram.singh@email.com",
      lastVisit: "2024-05-30",
      status: "active",
      totalVisits: 5,
      lastService: "General Health Checkup",
      source: "Google Ads"
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "new": return "bg-blue-100 text-blue-800";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Patient Database
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {patients.length} total patients
          </Badge>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <User className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
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
                      {patient.status}
                    </Badge>
                    <Badge className={getSourceColor(patient.source)}>
                      {patient.source}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {patient.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Last visit: {patient.lastVisit}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {patient.totalVisits} total visits
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Last service: {patient.lastService}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Book
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
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

export default PatientDatabase;
