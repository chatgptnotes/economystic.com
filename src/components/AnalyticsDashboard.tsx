
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Phone, Users, MessageSquare, Ambulance, Calendar, Clock } from "lucide-react";

const AnalyticsDashboard = () => {
  // Sample data - in a real app, this would come from your database
  const callVolumeData = [
    { day: "Mon", calls: 45, successful: 38 },
    { day: "Tue", calls: 52, successful: 44 },
    { day: "Wed", calls: 38, successful: 32 },
    { day: "Thu", calls: 61, successful: 55 },
    { day: "Fri", calls: 73, successful: 68 },
    { day: "Sat", calls: 29, successful: 25 },
    { day: "Sun", calls: 34, successful: 28 }
  ];

  const responseTimeData = [
    { hour: "8AM", avgTime: 45 },
    { hour: "10AM", avgTime: 52 },
    { hour: "12PM", avgTime: 38 },
    { hour: "2PM", avgTime: 41 },
    { hour: "4PM", avgTime: 35 },
    { hour: "6PM", avgTime: 48 },
    { hour: "8PM", avgTime: 42 }
  ];

  const ambulanceStatusData = [
    { name: "Available", value: 12, color: "#22c55e" },
    { name: "En Route", value: 8, color: "#f59e0b" },
    { name: "At Hospital", value: 3, color: "#3b82f6" },
    { name: "Maintenance", value: 2, color: "#ef4444" }
  ];

  const whatsappEngagementData = [
    { type: "Delivered", count: 156, color: "#22c55e" },
    { type: "Read", count: 134, color: "#3b82f6" },
    { type: "Replied", count: 89, color: "#8b5cf6" },
    { type: "Pending", count: 23, color: "#f59e0b" }
  ];

  const MetricCard = ({ title, value, change, icon, trend }: {
    title: string;
    value: string | number;
    change: string;
    icon: React.ReactNode;
    trend: "up" | "down";
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-blue-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {change}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Call Success Rate"
          value="89.2%"
          change="+5.2% from last week"
          icon={<Phone className="h-4 w-4" />}
          trend="up"
        />
        <MetricCard
          title="Avg Response Time"
          value="42 sec"
          change="-8 sec from last week"
          icon={<Clock className="h-4 w-4" />}
          trend="up"
        />
        <MetricCard
          title="Patient Satisfaction"
          value="4.6/5"
          change="+0.3 from last month"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <MetricCard
          title="WhatsApp Engagement"
          value="78.4%"
          change="+12.1% from last week"
          icon={<MessageSquare className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Call Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
                <Bar dataKey="successful" fill="#22c55e" name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ambulance Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ambulanceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ambulanceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">WhatsApp Message Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={whatsappEngagementData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill={(entry) => entry.color} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Today's Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">247</div>
              <div className="text-sm text-gray-600">Total Calls Today</div>
            </div>
            <div className="text-center">
              <Ambulance className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">18</div>
              <div className="text-sm text-gray-600">Ambulance Dispatched</div>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-600">Appointments Booked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
