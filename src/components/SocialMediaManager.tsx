
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin, Globe, Plus, Eye, Heart, Share, MessageCircle, Calendar, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialAccount {
  id: string;
  account_handle: string;
  account_url: string;
  followers_count: number;
  is_active: boolean;
  platform: {
    name: string;
    icon_name: string;
  };
}

interface SocialPost {
  id: string;
  title: string;
  content: string;
  status: string;
  scheduled_at: string;
  published_at: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
  comments_count: number;
  platform: {
    name: string;
    icon_name: string;
  };
}

interface SocialMediaManagerProps {
  businessId: string;
}

const getPlatformIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    'map-pin': MapPin,
    globe: Globe
  };
  return icons[iconName] || Globe;
};

const SocialMediaManager = ({ businessId }: SocialMediaManagerProps) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', platformId: '', scheduledAt: '' });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (businessId) {
      fetchSocialAccounts();
      fetchSocialPosts();
    }
  }, [businessId]);

  const fetchSocialAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('business_social_accounts')
        .select(`
          *,
          platform:social_media_platforms(name, icon_name)
        `)
        .eq('business_id', businessId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching social accounts:', error);
        return;
      }

      console.log('Fetched social accounts:', data);
      setAccounts(data || []);
    } catch (error) {
      console.error('Error in fetchSocialAccounts:', error);
    }
  };

  const fetchSocialPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select(`
          *,
          platform:social_media_platforms(name, icon_name)
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching social posts:', error);
        return;
      }

      console.log('Fetched social posts:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Error in fetchSocialPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content || !newPost.platformId) {
      toast({
        title: "Missing Information",
        description: "Please fill in content and select a platform",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .insert({
          business_id: businessId,
          platform_id: newPost.platformId,
          title: newPost.title,
          content: newPost.content,
          scheduled_at: newPost.scheduledAt || null,
          status: newPost.scheduledAt ? 'scheduled' : 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Error",
          description: "Failed to create post",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Post Created",
        description: `Post ${newPost.scheduledAt ? 'scheduled' : 'saved as draft'} successfully`
      });

      setNewPost({ title: '', content: '', platformId: '', scheduledAt: '' });
      fetchSocialPosts();
    } catch (error) {
      console.error('Error in handleCreatePost:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading social media data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="posts">Manage Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account) => {
                  const IconComponent = getPlatformIcon(account.platform.icon_name);
                  return (
                    <div key={account.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{account.platform.name}</span>
                        </div>
                        <Badge variant={account.is_active ? "default" : "secondary"}>
                          {account.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{account.account_handle}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{account.followers_count.toLocaleString()} followers</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newPost.platformId}
                  onChange={(e) => setNewPost(prev => ({ ...prev, platformId: e.target.value }))}
                >
                  <option value="">Select Platform</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.platform.name} - {account.account_handle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's happening?"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Schedule (Optional)</label>
                <Input
                  type="datetime-local"
                  value={newPost.scheduledAt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                />
              </div>

              <Button onClick={handleCreatePost} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {newPost.scheduledAt ? 'Schedule Post' : 'Save as Draft'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No posts created yet. Create your first post!
                  </div>
                ) : (
                  posts.map((post) => {
                    const IconComponent = getPlatformIcon(post.platform.icon_name);
                    return (
                      <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">{post.platform.name}</span>
                            <Badge variant={
                              post.status === 'published' ? 'default' :
                              post.status === 'scheduled' ? 'secondary' : 'outline'
                            }>
                              {post.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.published_at ? 
                              `Published ${new Date(post.published_at).toLocaleDateString()}` :
                              post.scheduled_at ?
                              `Scheduled for ${new Date(post.scheduled_at).toLocaleDateString()}` :
                              `Created ${new Date(post.created_at).toLocaleDateString()}`
                            }
                          </div>
                        </div>
                        
                        {post.title && (
                          <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                        )}
                        
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        
                        {post.status === 'published' && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{post.views_count}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{post.likes_count}</span>
                            </div>
                            <div className="flex items-center">
                              <Share className="h-4 w-4 mr-1" />
                              <span>{post.shares_count}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{post.comments_count}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaManager;
