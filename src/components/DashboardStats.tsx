
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, Calendar, MessageSquare, Ambulance, User, Bell, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  link?: string;
}

const StatCard = ({ title, value, icon, change, trend = "neutral", link }: StatCardProps) => {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";
  
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (link) {
      return (
        <Link to={link} className="block">
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer hover:bg-gray-50">
            {children}
          </Card>
        </Link>
      );
    }
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        {children}
      </Card>
    );
  };

  return (
    <CardWrapper>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-blue-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className={`text-xs ${trendColor} mt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </CardWrapper>
  );
};

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    ambulanceBookings: 0,
    whatsappMessages: 0,
    completedReports: 0,
    recentReports: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch call records with report relationships
        const { data: callRecords } = await supabase
          .from('call_records')
          .select(`
            id,
            patient_name,
            call_type,
            call_status,
            reports (name, type)
          `);
        
        // Fetch ambulance bookings with report relationships
        const { data: ambulanceBookings } = await supabase
          .from('ambulance_bookings')
          .select(`
            id,
            patient_name,
            status,
            reports (name, type)
          `);
        
        // Fetch WhatsApp messages with report relationships
        const { data: whatsappMessages } = await supabase
          .from('whatsapp_messages')
          .select(`
            id,
            patient_name,
            message_type,
            delivery_status,
            reports (name, type)
          `);
        
        // Fetch completed reports
        const { data: reports } = await supabase
          .from('reports')
          .select('*')
          .eq('analysis_status', 'completed')
          .order('uploaded_at', { ascending: false })
          .limit(5);

        setStats({
          totalCalls: callRecords?.length || 0,
          ambulanceBookings: ambulanceBookings?.length || 0,
          whatsappMessages: whatsappMessages?.length || 0,
          completedReports: reports?.length || 0,
          recentReports: reports || []
        });

        // Log the data relationships for debugging
        console.log('Call records with reports:', callRecords);
        console.log('Ambulance bookings with reports:', ambulanceBookings);
        console.log('WhatsApp messages with reports:', whatsappMessages);
        console.log('Recent reports:', reports);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    {
      title: "Total Calls",
      value: stats.totalCalls,
      icon: <Phone className="h-4 w-4" />,
      change: stats.totalCalls > 0 ? `From ${stats.completedReports} analyzed reports` : "Upload reports to see data",
      trend: "neutral" as const,
      link: "/total-calls"
    },
    {
      title: "Ambulance Bookings",
      value: stats.ambulanceBookings,
      icon: <Ambulance className="h-4 w-4" />,
      change: stats.ambulanceBookings > 0 ? `From ${stats.completedReports} analyzed reports` : "Upload reports to see data",
      trend: "neutral" as const,
      link: "/ambulance-bookings"
    },
    {
      title: "WhatsApp Messages",
      value: stats.whatsappMessages,
      icon: <MessageSquare className="h-4 w-4" />,
      change: stats.whatsappMessages > 0 ? `From ${stats.completedReports} analyzed reports` : "Upload reports to see data",
      trend: "neutral" as const,
      link: "/whatsapp-responses"
    },
    {
      title: "Analyzed Reports",
      value: stats.completedReports,
      icon: <FileText className="h-4 w-4" />,
      change: stats.completedReports > 0 ? "Successfully processed" : "Upload reports to analyze",
      trend: "up" as const,
      link: "/reports"
    },
    {
      title: "New Patients",
      value: "Coming Soon",
      icon: <Users className="h-4 w-4" />,
      change: "Feature in development",
      trend: "neutral" as const,
      link: "/new-patients"
    },
    {
      title: "Appointments Scheduled",
      value: "Coming Soon",
      icon: <Calendar className="h-4 w-4" />,
      change: "Feature in development",
      trend: "neutral" as const,
      link: "/appointments-scheduled"
    },
    {
      title: "Follow-up Calls",
      value: "Coming Soon",
      icon: <Bell className="h-4 w-4" />,
      change: "Feature in development",
      trend: "neutral" as const,
      link: "/follow-up-calls"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      {stats.recentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Recently Analyzed Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentReports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-600">Type: {report.type} • Status: {report.analysis_status}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(report.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/reports" className="block mt-4">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All Reports
              </button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
