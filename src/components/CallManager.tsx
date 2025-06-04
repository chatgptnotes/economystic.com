
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Ambulance, User, MessageSquare, Calendar, Bell } from "lucide-react";

interface CallRecord {
  id: string;
  patientName: string;
  phoneNumber: string;
  callType: string;
  status: "pending" | "completed" | "follow-up";
  priority: "high" | "medium" | "low";
  notes: string;
  scheduledTime?: string;
}

const CallManager = () => {
  const [calls] = useState<CallRecord[]>([
    {
      id: "1",
      patientName: "John Doe",
      phoneNumber: "+91 98765 43210",
      callType: "Rseva Testing",
      status: "pending",
      priority: "high",
      notes: "Follow-up on COVID test results"
    },
    {
      id: "2",
      patientName: "Sarah Smith",
      phoneNumber: "+91 87654 32109",
      callType: "Ambulance Booking",
      status: "completed",
      priority: "high",
      notes: "Emergency pickup confirmed for 2 PM"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      phoneNumber: "+91 76543 21098",
      callType: "JustDial Lead",
      status: "follow-up",
      priority: "medium",
      notes: "Interested in cardiology consultation"
    },
    {
      id: "4",
      patientName: "Emily Davis",
      phoneNumber: "+91 65432 10987",
      callType: "Google Ads Inquiry",
      status: "pending",
      priority: "medium",
      notes: "Dental implant inquiry from Google Ads"
    },
    {
      id: "5",
      patientName: "Robert Wilson",
      phoneNumber: "+91 54321 09876",
      callType: "Patient Call",
      status: "completed",
      priority: "low",
      notes: "General inquiry about visiting hours"
    },
    {
      id: "6",
      patientName: "Lisa Brown",
      phoneNumber: "+91 43210 98765",
      callType: "Camp Registration",
      status: "pending",
      priority: "medium",
      notes: "Health camp registration for diabetes screening"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "follow-up": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCallTypeIcon = (callType: string) => {
    switch (callType) {
      case "Ambulance Booking": return <Ambulance className="h-4 w-4" />;
      case "Patient Call": return <User className="h-4 w-4" />;
      case "JustDial Lead": case "Google Ads Inquiry": return <MessageSquare className="h-4 w-4" />;
      case "Camp Registration": return <Calendar className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const filterCallsByType = (type: string) => {
    if (type === "all") return calls;
    return calls.filter(call => call.callType.toLowerCase().includes(type.toLowerCase()));
  };

  const CallList = ({ callData }: { callData: CallRecord[] }) => (
    <div className="space-y-4">
      {callData.map((call) => (
        <Card key={call.id} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-1">
                  {getCallTypeIcon(call.callType)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{call.patientName}</h3>
                  <p className="text-sm text-gray-600">{call.phoneNumber}</p>
                  <p className="text-sm text-gray-500 mt-1">{call.notes}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                    <Badge className={getPriorityColor(call.priority)}>{call.priority}</Badge>
                    <span className="text-xs text-gray-500">{call.callType}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="h-5 w-5 mr-2 text-blue-600" />
          Call Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all">All Calls</TabsTrigger>
            <TabsTrigger value="rseva">Rseva</TabsTrigger>
            <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
            <TabsTrigger value="justdial">JustDial</TabsTrigger>
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="camp">Camps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <CallList callData={calls} />
          </TabsContent>
          
          <TabsContent value="rseva" className="mt-6">
            <CallList callData={filterCallsByType("rseva")} />
          </TabsContent>
          
          <TabsContent value="ambulance" className="mt-6">
            <CallList callData={filterCallsByType("ambulance")} />
          </TabsContent>
          
          <TabsContent value="justdial" className="mt-6">
            <CallList callData={filterCallsByType("justdial")} />
          </TabsContent>
          
          <TabsContent value="google" className="mt-6">
            <CallList callData={filterCallsByType("google")} />
          </TabsContent>
          
          <TabsContent value="patient" className="mt-6">
            <CallList callData={filterCallsByType("patient")} />
          </TabsContent>
          
          <TabsContent value="camp" className="mt-6">
            <CallList callData={filterCallsByType("camp")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CallManager;
