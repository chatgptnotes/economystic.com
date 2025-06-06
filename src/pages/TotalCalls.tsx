
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Phone, ArrowLeft, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCallAPI } from "@/hooks/useCallAPI";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CallRecord {
  id: string;
  patient_name: string;
  phone_number: string;
  call_type: string;
  call_duration: number;
  call_status: string;
  call_time: string;
  call_direction: string;
  notes: string;
}

const TotalCalls = () => {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showDateFilter, setShowDateFilter] = useState(false);
  const { makeCall, isLoading } = useCallAPI();

  const fetchCalls = async () => {
    try {
      console.log('Fetching call records...');
      const { data, error } = await supabase
        .from('call_records')
        .select('*')
        .order('call_time', { ascending: false });

      if (error) {
        console.error('Error fetching call records:', error);
        return;
      }

      console.log('Call records fetched:', data?.length || 0);
      setCalls(data || []);
      setFilteredCalls(data || []); // Show all data by default
    } catch (error) {
      console.error('Error in fetchCalls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCallsByDateRange = (callsData: CallRecord[]) => {
    if (!dateFrom && !dateTo) {
      setFilteredCalls(callsData);
      return;
    }

    const filtered = callsData.filter(call => {
      if (!call.call_time) return false;
      
      try {
        const callDate = new Date(call.call_time);
        
        if (dateFrom && dateTo) {
          return callDate >= dateFrom && callDate <= dateTo;
        } else if (dateFrom) {
          return callDate >= dateFrom;
        } else if (dateTo) {
          return callDate <= dateTo;
        }
        
        return true;
      } catch {
        return false;
      }
    });
    
    console.log('Filtered calls count:', filtered.length);
    setFilteredCalls(filtered);
  };

  const clearDateFilter = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setFilteredCalls(calls);
  };

  useEffect(() => {
    fetchCalls();

    // Set up real-time subscription for new call records
    const callRecordsSubscription = supabase
      .channel('call_records_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'call_records' }, 
        () => {
          console.log('Call records changed, refreshing...');
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callRecordsSubscription);
    };
  }, []);

  useEffect(() => {
    if (calls.length > 0) {
      filterCallsByDateRange(calls);
    }
  }, [calls, dateFrom, dateTo]);

  const handleCallBack = async (phoneNumber: string, patientName: string) => {
    console.log(`Calling back ${patientName} at ${phoneNumber}`);
    await makeCall({ phoneNumber });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "missed": return "bg-red-100 text-red-800";
      case "ongoing": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

  const formatDate = (callTime: string) => {
    if (!callTime) return "N/A";
    try {
      return new Date(callTime).toLocaleDateString('en-US');
    } catch {
      return "N/A";
    }
  };

  const getDateRangeText = () => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, 'MMM dd')} - ${format(dateTo, 'MMM dd, yyyy')}`;
    } else if (dateFrom) {
      return `From ${format(dateFrom, 'MMM dd, yyyy')}`;
    } else if (dateTo) {
      return `Until ${format(dateTo, 'MMM dd, yyyy')}`;
    }
    return 'All time';
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
              <h1 className="text-2xl font-bold text-gray-900">Total Calls</h1>
              <p className="text-gray-600">
                {filteredCalls.length} calls found ({getDateRangeText()})
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {(dateFrom || dateTo) && (
              <Button variant="outline" size="sm" onClick={clearDateFilter}>
                <X className="h-4 w-4 mr-1" />
                Clear Filter
              </Button>
            )}
            <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                  <Filter className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">From Date:</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">To Date:</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button 
                    onClick={() => setShowDateFilter(false)} 
                    className="w-full"
                  >
                    Apply Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              Call Records ({getDateRangeText()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading call records...</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {calls.length === 0 
                    ? 'No call records found. Upload reports to see call data here.'
                    : 'No call records found for the selected date range. Try adjusting your filter.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCalls.map((call) => (
                  <div key={call.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {call.patient_name || 'Unknown Patient'}
                          </h3>
                          <Badge className={getStatusColor(call.call_status)}>
                            {call.call_status || 'unknown'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{call.phone_number || 'No phone number'}</p>
                        <p className="text-sm text-gray-500">{call.call_type || 'Unknown type'}</p>
                        {call.notes && (
                          <p className="text-sm text-gray-500 mt-1">{call.notes}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Duration: {formatDuration(call.call_duration)}</span>
                          <span>Time: {formatCallTime(call.call_time)}</span>
                          <span>Date: {formatDate(call.call_time)}</span>
                          <span>Direction: {call.call_direction || 'unknown'}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCallBack(call.phone_number, call.patient_name)}
                          disabled={isLoading || !call.phone_number}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          {isLoading ? 'Calling...' : 'Call Back'}
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

export default TotalCalls;
