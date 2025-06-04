
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, Calendar, MessageSquare, Ambulance, User, Bell } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, icon, change, trend = "neutral" }: StatCardProps) => {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-blue-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className={`text-xs ${trendColor} mt-1`}>
            {change} from yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: "Total Calls Today",
      value: 247,
      icon: <Phone className="h-4 w-4" />,
      change: "+12%",
      trend: "up" as const
    },
    {
      title: "Ambulance Bookings",
      value: 18,
      icon: <Ambulance className="h-4 w-4" />,
      change: "+3",
      trend: "up" as const
    },
    {
      title: "New Patients",
      value: 34,
      icon: <Users className="h-4 w-4" />,
      change: "+8%",
      trend: "up" as const
    },
    {
      title: "Appointments Scheduled",
      value: 89,
      icon: <Calendar className="h-4 w-4" />,
      change: "+15%",
      trend: "up" as const
    },
    {
      title: "WhatsApp Responses",
      value: 156,
      icon: <MessageSquare className="h-4 w-4" />,
      change: "-2%",
      trend: "down" as const
    },
    {
      title: "Follow-up Calls",
      value: 42,
      icon: <Bell className="h-4 w-4" />,
      change: "+5",
      trend: "up" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
