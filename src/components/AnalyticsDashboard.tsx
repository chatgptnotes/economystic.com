import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Phone, MessageSquare, Ambulance, Clock, TrendingUp, Users, AlertCircle } from "lucide-react";

// Sample data for charts
const callVolumeData = [
  { day: 'Mon', calls: 234 },
  { day: 'Tue', calls: 186 },
  { day: 'Wed', calls: 298 },
  { day: 'Thu', calls: 247 },
  { day: 'Fri', calls: 312 },
  { day: 'Sat', calls: 198 },
  { day: 'Sun', calls: 156 },
];

const responseTimeData = [
  { time: '8AM', responseTime: 3.2 },
  { time: '10AM', responseTime: 2.8 },
  { time: '12PM', responseTime: 4.1 },
  { time: '2PM', responseTime: 3.9 },
  { time: '4PM', responseTime: 2.3 },
  { time: '6PM', responseTime: 2.1 },
  { time: '8PM', responseTime: 1.9 },
];

const ambulanceStatusData = [
  { name: 'Available', value: 12 },
  { name: 'En Route', value: 8 },
  { name: 'At Hospital', value: 5 },
  { name: 'Maintenance', value: 2 },
];

const patientDemographicsData = [
  { ageGroup: '0-18', patients: 45 },
  { ageGroup: '19-35', patients: 123 },
  { ageGroup: '36-50', patients: 187 },
  { ageGroup: '51-65', patients: 156 },
  { ageGroup: '65+', patients: 98 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Calls Today</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
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
                <p className="text-2xl font-bold text-gray-900">1,423</p>
                <p className="text-sm text-green-600">+8% from yesterday</p>
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
                <p className="text-2xl font-bold text-gray-900">34</p>
                <p className="text-sm text-red-600">+5% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3 min</p>
                <p className="text-sm text-green-600">-15% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Call Volume (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Response Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ambulance Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="h-5 w-5 mr-2 text-red-600" />
              Ambulance Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ambulanceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ambulanceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* WhatsApp Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
              WhatsApp Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages Sent</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages Read</span>
                <span className="font-semibold">2,156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Read Rate</span>
                <span className="font-semibold text-green-600">75.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Responses</span>
                <span className="font-semibold">1,423</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-semibold text-blue-600">66.0%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="text-sm font-medium text-red-800">High Priority</p>
                <p className="text-xs text-red-600">3 ambulances at capacity</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-yellow-800">Medium Priority</p>
                <p className="text-xs text-yellow-600">Response time above average</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-medium text-blue-800">Info</p>
                <p className="text-xs text-blue-600">Peak hours: 2-4 PM today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Patient Demographics (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientDemographicsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
