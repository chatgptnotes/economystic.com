
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface FollowUpCall {
  id: string;
  patientName: string;
  phoneNumber: string;
  lastVisit: string;
  reason: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "scheduled";
  notes: string;
}

const FollowUpCalls = () => {
  const [followUps] = useState<FollowUpCall[]>([
    {
      id: "1",
      patientName: "John Doe",
      phoneNumber: "+91 98765 43210",
      lastVisit: "2024-05-30",
      reason: "Post-surgery checkup",
      priority: "high",
      status: "pending",
      notes: "Patient had minor surgery last week"
    },
    {
      id: "2",
      patientName: "Sarah Smith",
      phoneNumber: "+91 87654 32109",
      lastVisit: "2024-05-28",
      reason: "Medication side effects",
      priority: "medium",
      status: "completed",
      notes: "Patient reported mild side effects"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      phoneNumber: "+91 76543 21098",
      lastVisit: "2024-05-25",
      reason: "Test results discussion",
      priority: "high",
      status: "scheduled",
      notes: "Blood work results are ready"
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
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
              <h1 className="text-2xl font-bold text-gray-900">Follow-up Calls</h1>
              <p className="text-gray-600">42 follow-up calls today (+5 from yesterday)</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Pending Follow-up Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUps.map((followUp) => (
                <div key={followUp.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{followUp.patientName}</h3>
                        <Badge className={getPriorityColor(followUp.priority)}>
                          {followUp.priority} priority
                        </Badge>
                        <Badge className={getStatusColor(followUp.status)}>
                          {followUp.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Phone:</strong> {followUp.phoneNumber}</p>
                        <p><strong>Last Visit:</strong> {followUp.lastVisit}</p>
                        <p><strong>Reason:</strong> {followUp.reason}</p>
                        <p><strong>Notes:</strong> {followUp.notes}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
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

export default FollowUpCalls;
