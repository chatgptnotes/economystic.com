
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";

interface CallRecord {
  id: string;
  patientName: string;
  phoneNumber: string;
  callType: string;
  duration: string;
  status: "completed" | "missed" | "ongoing";
  time: string;
}

const TotalCalls = () => {
  const [calls] = useState<CallRecord[]>([
    {
      id: "1",
      patientName: "John Doe",
      phoneNumber: "+91 98765 43210",
      callType: "Rseva Testing",
      duration: "5:23",
      status: "completed",
      time: "09:15 AM"
    },
    {
      id: "2",
      patientName: "Sarah Smith",
      phoneNumber: "+91 87654 32109",
      callType: "Ambulance Booking",
      duration: "12:45",
      status: "completed",
      time: "10:30 AM"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      phoneNumber: "+91 76543 21098",
      callType: "Patient Inquiry",
      duration: "3:12",
      status: "completed",
      time: "11:45 AM"
    },
    {
      id: "4",
      patientName: "Emily Davis",
      phoneNumber: "+91 65432 10987",
      callType: "Follow-up",
      duration: "0:00",
      status: "missed",
      time: "02:15 PM"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "missed": return "bg-red-100 text-red-800";
      case "ongoing": return "bg-blue-100 text-blue-800";
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
              <h1 className="text-2xl font-bold text-gray-900">Total Calls Today</h1>
              <p className="text-gray-600">247 calls made today (+12% from yesterday)</p>
            </div>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              All Calls Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calls.map((call) => (
                <div key={call.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{call.patientName}</h3>
                        <Badge className={getStatusColor(call.status)}>
                          {call.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{call.phoneNumber}</p>
                      <p className="text-sm text-gray-500">{call.callType}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Duration: {call.duration}</span>
                        <span>Time: {call.time}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Back
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

export default TotalCalls;
