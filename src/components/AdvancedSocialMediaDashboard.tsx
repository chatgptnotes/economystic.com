
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Calendar, BarChart3, Globe, Users, Settings } from "lucide-react";
import BusinessSelector from "./BusinessSelector";
import SocialMediaDashboard from "./SocialMediaDashboard";
import PlatformCredentials from "./PlatformCredentials";
import ContentCalendar from "./ContentCalendar";
import PlatformMonitoring from "./PlatformMonitoring";

const AdvancedSocialMediaDashboard = () => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <BusinessSelector 
        selectedBusinessId={selectedBusinessId}
        onBusinessSelect={setSelectedBusinessId}
      />

      {selectedBusinessId && (
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Content Calendar
            </TabsTrigger>
            <TabsTrigger value="credentials" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SocialMediaDashboard />
          </TabsContent>

          <TabsContent value="monitoring">
            <PlatformMonitoring businessId={selectedBusinessId} />
          </TabsContent>

          <TabsContent value="calendar">
            <ContentCalendar businessId={selectedBusinessId} />
          </TabsContent>

          <TabsContent value="credentials">
            <PlatformCredentials businessId={selectedBusinessId} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Monthly performance analytics and campaign tracking coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedSocialMediaDashboard;
