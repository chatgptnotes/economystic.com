
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
    completedReports: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch call records
        const { data: callRecords } = await supabase
          .from('call_records')
          .select('id');
        
        // Fetch ambulance bookings
        const { data: ambulanceBookings } = await supabase
          .from('ambulance_bookings')
          .select('id');
        
        // Fetch WhatsApp messages
        const { data: whatsappMessages } = await supabase
          .from('whatsapp_messages')
          .select('id');
        
        // Fetch completed reports
        const { data: reports } = await supabase
          .from('reports')
          .select('id')
          .eq('analysis_status', 'completed');

        setStats({
          totalCalls: callRecords?.length || 0,
          ambulanceBookings: ambulanceBookings?.length || 0,
          whatsappMessages: whatsappMessages?.length || 0,
          completedReports: reports?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    {
      title: "Total Calls",
      value: stats.totalCalls,
      icon: <Phone className="h-4 w-4" />,
      change: stats.totalCalls > 0 ? "From uploaded reports" : "No data yet",
      trend: "neutral" as const,
      link: "/total-calls"
    },
    {
      title: "Ambulance Bookings",
      value: stats.ambulanceBookings,
      icon: <Ambulance className="h-4 w-4" />,
      change: stats.ambulanceBookings > 0 ? "From uploaded reports" : "No data yet",
      trend: "neutral" as const,
      link: "/ambulance-bookings"
    },
    {
      title: "WhatsApp Messages",
      value: stats.whatsappMessages,
      icon: <MessageSquare className="h-4 w-4" />,
      change: stats.whatsappMessages > 0 ? "From uploaded reports" : "No data yet",
      trend: "neutral" as const,
      link: "/whatsapp-responses"
    },
    {
      title: "Completed Reports",
      value: stats.completedReports,
      icon: <FileText className="h-4 w-4" />,
      change: stats.completedReports > 0 ? "Successfully analyzed" : "Upload reports to analyze",
      trend: "neutral" as const,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {dashboardStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
