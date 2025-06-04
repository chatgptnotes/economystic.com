
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, Calendar, Eye, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BusinessSelector from "./BusinessSelector";
import SocialMediaManager from "./SocialMediaManager";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface AnalyticsData {
  totalFollowers: number;
  totalPosts: number;
  totalViews: number;
  totalEngagement: number;
  platformData: Array<{
    platform: string;
    followers: number;
    posts: number;
    engagement: number;
  }>;
  weeklyData: Array<{
    date: string;
    posts: number;
    engagement: number;
  }>;
}

const SocialMediaDashboard = () => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalFollowers: 0,
    totalPosts: 0,
    totalViews: 0,
    totalEngagement: 0,
    platformData: [],
    weeklyData: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchAnalytics();
    }
  }, [selectedBusinessId]);

  const fetchAnalytics = async () => {
    if (!selectedBusinessId) return;
    
    setLoading(true);
    try {
      // Fetch social accounts with follower counts
      const { data: accounts } = await supabase
        .from('business_social_accounts')
        .select(`
          followers_count,
          platform:social_media_platforms(name)
        `)
        .eq('business_id', selectedBusinessId)
        .eq('is_active', true);

      // Fetch posts data
      const { data: posts } = await supabase
        .from('social_media_posts')
        .select(`
          views_count,
          likes_count,
          shares_count,
          comments_count,
          created_at,
          platform:social_media_platforms(name)
        `)
        .eq('business_id', selectedBusinessId);

      // Calculate analytics
      const totalFollowers = accounts?.reduce((sum, acc) => sum + acc.followers_count, 0) || 0;
      const totalPosts = posts?.length || 0;
      const totalViews = posts?.reduce((sum, post) => sum + post.views_count, 0) || 0;
      const totalEngagement = posts?.reduce((sum, post) => 
        sum + post.likes_count + post.shares_count + post.comments_count, 0) || 0;

      // Group by platform
      const platformMap = new Map();
      accounts?.forEach(acc => {
        const platformName = acc.platform.name;
        if (!platformMap.has(platformName)) {
          platformMap.set(platformName, { platform: platformName, followers: 0, posts: 0, engagement: 0 });
        }
        platformMap.get(platformName).followers += acc.followers_count;
      });

      posts?.forEach(post => {
        const platformName = post.platform.name;
        if (!platformMap.has(platformName)) {
          platformMap.set(platformName, { platform: platformName, followers: 0, posts: 0, engagement: 0 });
        }
        const platform = platformMap.get(platformName);
        platform.posts += 1;
        platform.engagement += post.likes_count + post.shares_count + post.comments_count;
      });

      const platformData = Array.from(platformMap.values());

      // Generate weekly data (mock data for now)
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          posts: Math.floor(Math.random() * 5) + 1,
          engagement: Math.floor(Math.random() * 100) + 50
        };
      }).reverse();

      setAnalytics({
        totalFollowers,
        totalPosts,
        totalViews,
        totalEngagement,
        platformData,
        weeklyData
      });

      console.log('Analytics calculated:', {
        totalFollowers,
        totalPosts,
        totalViews,
        totalEngagement,
        platformData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BusinessSelector 
        selectedBusinessId={selectedBusinessId}
        onBusinessSelect={setSelectedBusinessId}
      />

      {selectedBusinessId && (
        <>
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Followers</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalFollowers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalEngagement.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Followers by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.platformData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.platformData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="followers" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No platform data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="posts" stroke="#10b981" name="Posts" />
                    <Line type="monotone" dataKey="engagement" stroke="#f59e0b" name="Engagement" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Social Media Management */}
          <SocialMediaManager businessId={selectedBusinessId} />
        </>
      )}
    </div>
  );
};

export default SocialMediaDashboard;
