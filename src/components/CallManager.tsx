
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Ambulance, User, MessageSquare, Calendar, Bell } from "lucide-react";
import { useCallAPI } from "@/hooks/useCallAPI";
import { supabase } from "@/integrations/supabase/client";

interface CallRecord {
  id: string;
  patient_name: string;
  phone_number: string;
  call_type: string;
  call_status: "pending" | "completed" | "follow-up";
  call_duration: number;
  call_time: string;
  call_direction: string;
  notes: string;
}

const CallManager = () => {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { makeCall, isLoading } = useCallAPI();

  const fetchCalls = async () => {
    try {
      console.log('Fetching call records for CallManager...');
      const { data, error } = await supabase
        .from('call_records')
        .select('*')
        .order('call_time', { ascending: false });

      if (error) {
        console.error('Error fetching call records:', error);
        return;
      }

      console.log('Call records fetched for CallManager:', data?.length || 0);
      setCalls(data || []);
    } catch (error) {
      console.error('Error in fetchCalls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();

    // Set up real-time subscription for new call records
    const callRecordsSubscription = supabase
      .channel('call_manager_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'call_records' }, 
        () => {
          console.log('Call records changed, refreshing CallManager...');
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callRecordsSubscription);
    };
  }, []);

  const handleMakeCall = async (phoneNumber: string, patientName: string) => {
    console.log(`Initiating call to ${patientName} at ${phoneNumber}`);
    await makeCall({ phoneNumber });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "missed": case "failed": return "bg-red-100 text-red-800";
      case "ongoing": case "processing": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (duration: number) => {
    if (duration > 300) return "bg-green-100 text-green-800"; // long calls
    if (duration > 60) return "bg-orange-100 text-orange-800"; // medium calls
    return "bg-red-100 text-red-800"; // short calls
  };

  const getCallTypeIcon = (callType: string) => {
    const type = callType?.toLowerCase() || '';
    if (type.includes('ambulance')) return <Ambulance className="h-4 w-4" />;
    if (type.includes('patient')) return <User className="h-4 w-4" />;
    if (type.includes('lead') || type.includes('inquiry')) return <MessageSquare className="h-4 w-4" />;
    if (type.includes('appointment')) return <Calendar className="h-4 w-4" />;
    return <Phone className="h-4 w-4" />;
  };

  const filterCallsByType = (type: string) => {
    if (type === "all") return calls;
    return calls.filter(call => 
      call.call_type?.toLowerCase().includes(type.toLowerCase()) ||
      call.notes?.toLowerCase().includes(type.toLowerCase())
    );
  };

  const formatDuration = (duration: number) => {
    if (!duration || duration === 0) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCallTime = (callTime: string) => {
    if (!callTime) return "N/A";
    try {
      return new Date(callTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return "N/A";
    }
  };

  const CallList = ({ callData }: { callData: CallRecord[] }) => (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading call records...</p>
        </div>
      ) : callData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No call records found. Upload reports to see call data here.</p>
        </div>
      ) : (
        callData.map((call) => (
          <Card key={call.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 mt-1">
                    {getCallTypeIcon(call.call_type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {call.patient_name || 'Unknown Patient'}
                    </h3>
                    <p className="text-sm text-gray-600">{call.phone_number || 'No phone number'}</p>
                    <p className="text-sm text-gray-500 mt-1">{call.notes || 'No notes available'}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(call.call_status)}>
                        {call.call_status || 'unknown'}
                      </Badge>
                      <Badge className={getPriorityColor(call.call_duration)}>
                        {formatDuration(call.call_duration)}
                      </Badge>
                      <span className="text-xs text-gray-500">{call.call_type || 'Unknown type'}</span>
                      <span className="text-xs text-gray-500">
                        {formatCallTime(call.call_time)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {call.call_direction || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMakeCall(call.phone_number, call.patient_name)}
                    disabled={isLoading || !call.phone_number}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {isLoading ? 'Calling...' : 'Call Back'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
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
