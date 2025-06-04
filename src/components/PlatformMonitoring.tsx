
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, MessageSquare, RefreshCw, ExternalLink, Globe, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlatformMonitoringData {
  id: string;
  current_rating: number;
  total_reviews: number;
  total_followers: number;
  last_checked: string;
  profile_url: string;
  platform: {
    name: string;
    platform_type: string;
    icon_name: string;
    base_url: string;
  };
}

interface PlatformMonitoringProps {
  businessId: string;
}

const PlatformMonitoring = ({ businessId }: PlatformMonitoringProps) => {
  const [monitoringData, setMonitoringData] = useState<PlatformMonitoringData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (businessId) {
      fetchMonitoringData();
    }
  }, [businessId]);

  const fetchMonitoringData = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_monitoring')
        .select(`
          *,
          platform:monitoring_platforms(name, platform_type, icon_name, base_url)
        `)
        .eq('business_id', businessId)
        .order('last_checked', { ascending: false });

      if (error) throw error;
      setMonitoringData(data || []);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const refreshPlatformData = async (platformId: string) => {
    setLoading(true);
    try {
      // In a real application, this would trigger an API call to fetch fresh data
      // For demo purposes, we'll simulate updating the last_checked timestamp
      const { data, error } = await supabase
        .from('platform_monitoring')
        .update({ last_checked: new Date().toISOString() })
        .eq('id', platformId);

      if (error) throw error;

      toast({
        title: "Data Refreshed",
        description: "Platform data has been updated"
      });

      fetchMonitoringData();
    } catch (error) {
      console.error('Error refreshing platform data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh platform data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (iconName: string) => {
    if (iconName === 'map-pin') return MapPin;
    return Globe;
  };

  const getPlatformTypeColor = (type: string) => {
    switch (type) {
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-green-100 text-green-800';
      case 'medical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Monitoring</h2>
        <Button onClick={fetchMonitoringData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitoringData.map((platform) => {
          const IconComponent = getPlatformIcon(platform.platform.icon_name);
          return (
            <Card key={platform.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                    {platform.platform.name}
                  </div>
                  <Badge className={getPlatformTypeColor(platform.platform.platform_type)}>
                    {platform.platform.platform_type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platform.current_rating && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className={`font-medium ${getRatingColor(platform.current_rating)}`}>
                        {platform.current_rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {platform.total_reviews} reviews
                    </span>
                  </div>
                )}

                {platform.total_followers > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-medium">
                        {platform.total_followers.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">followers</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last checked:</span>
                  <span>{new Date(platform.last_checked).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshPlatformData(platform.id)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>

                  {platform.profile_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(platform.profile_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {monitoringData.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No platforms being monitored</h3>
            <p className="text-gray-600">Set up platform monitoring to track ratings, reviews, and engagement.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlatformMonitoring;
