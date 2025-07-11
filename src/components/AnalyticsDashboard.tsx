
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Phone, MessageSquare, Ambulance, Clock, TrendingUp, Users, AlertCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280', '#3b82f6', '#8b5cf6'];

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    whatsappMessages: 0,
    ambulanceBookings: 0,
    completedReports: 0
  });

  const [chartData, setChartData] = useState({
    callsByType: [],
    messagesByStatus: [],
    ambulanceByStatus: [],
    reportsByType: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch call records with detailed analytics
        const { data: callRecords } = await supabase
          .from('call_records')
          .select(`
            *,
            reports (name, type, uploaded_at)
          `);
        
        const { data: whatsappMessages } = await supabase
          .from('whatsapp_messages')
          .select(`
            *,
            reports (name, type, uploaded_at)
          `);
        
        const { data: ambulanceBookings } = await supabase
          .from('ambulance_bookings')
          .select(`
            *,
            reports (name, type, uploaded_at)
          `);
        
        const { data: reports } = await supabase
          .from('reports')
          .select('*')
          .eq('analysis_status', 'completed');

        console.log('Analytics data fetched:', {
          callRecords,
          whatsappMessages,
          ambulanceBookings,
          reports
        });

        setStats({
          totalCalls: callRecords?.length || 0,
          whatsappMessages: whatsappMessages?.length || 0,
          ambulanceBookings: ambulanceBookings?.length || 0,
          completedReports: reports?.length || 0
        });

        // Process data for charts
        if (callRecords && callRecords.length > 0) {
          const callTypeData = callRecords.reduce((acc: any, call: any) => {
            const type = call.call_type || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});

          const callsByTypeArray = Object.entries(callTypeData).map(([type, count]) => ({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            count
          }));
          
          setChartData(prev => ({
            ...prev,
            callsByType: callsByTypeArray
          }));
        }

        if (whatsappMessages && whatsappMessages.length > 0) {
          const statusData = whatsappMessages.reduce((acc: any, message: any) => {
            const status = message.delivery_status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const messagesByStatusArray = Object.entries(statusData).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count
          }));
          
          setChartData(prev => ({
            ...prev,
            messagesByStatus: messagesByStatusArray
          }));
        }

        if (ambulanceBookings && ambulanceBookings.length > 0) {
          const statusData = ambulanceBookings.reduce((acc: any, booking: any) => {
            const status = booking.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const ambulanceByStatusArray = Object.entries(statusData).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count
          }));
          
          setChartData(prev => ({
            ...prev,
            ambulanceByStatus: ambulanceByStatusArray
          }));
        }

        if (reports && reports.length > 0) {
          const typeData = reports.reduce((acc: any, report: any) => {
            const type = report.type || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});

          const reportsByTypeArray = Object.entries(typeData).map(([type, count]) => ({
            type: type.replace('_', ' ').toUpperCase(),
            count
          }));
          
          setChartData(prev => ({
            ...prev,
            reportsByType: reportsByTypeArray
          }));
        }

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCalls}</p>
                <p className="text-sm text-blue-600">From {stats.completedReports} reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">WhatsApp Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.whatsappMessages}</p>
                <p className="text-sm text-green-600">From {stats.completedReports} reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ambulance className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ambulance Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ambulanceBookings}</p>
                <p className="text-sm text-red-600">From {stats.completedReports} reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Analyzed Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedReports}</p>
                <p className="text-sm text-green-600">Successfully processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Calls by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.callsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.callsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No call data available yet</p>
                  <p className="text-sm">Upload call center reports to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Reports by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.reportsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.reportsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No report data available yet</p>
                  <p className="text-sm">Upload reports to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Message Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
              WhatsApp Message Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.messagesByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.messagesByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.messagesByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No WhatsApp data available yet</p>
                  <p className="text-sm">Upload WhatsApp reports to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ambulance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="h-5 w-5 mr-2 text-red-600" />
              Ambulance Booking Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.ambulanceByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.ambulanceByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.ambulanceByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Ambulance className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No ambulance data available yet</p>
                  <p className="text-sm">Upload ambulance reports to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Data Summary & Report Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">{stats.totalCalls}</p>
              <p className="text-sm text-gray-600">Total Calls</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">{stats.whatsappMessages}</p>
              <p className="text-sm text-gray-600">WhatsApp Messages</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Ambulance className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="font-semibold">{stats.ambulanceBookings}</p>
              <p className="text-sm text-gray-600">Ambulance Bookings</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold">{stats.completedReports}</p>
              <p className="text-sm text-gray-600">Analyzed Reports</p>
            </div>
          </div>
          
          {stats.totalCalls === 0 && stats.whatsappMessages === 0 && stats.ambulanceBookings === 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-gray-700 mb-2">No Data Available</h3>
              <p className="text-gray-600">Upload and analyze reports to see your healthcare data analytics here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
