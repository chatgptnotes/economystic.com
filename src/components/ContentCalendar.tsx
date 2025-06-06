
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, User, Heart, Stethoscope, Building, Bell, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContentCalendarItem {
  id: string;
  title: string;
  content_type: string;
  scheduled_date: string;
  platforms: string[];
  content_template: string;
  status: string;
  campaign?: {
    name: string;
    doctor_name: string;
    department: string;
  };
}

interface ContentCalendarProps {
  businessId: string;
}

const ContentCalendar = ({ businessId }: ContentCalendarProps) => {
  const [calendarItems, setCalendarItems] = useState<ContentCalendarItem[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    contentType: '',
    scheduledDate: '',
    platforms: [] as string[],
    contentTemplate: '',
    campaignId: ''
  });
  const { toast } = useToast();

  const contentTypes = [
    { id: 'birthday', label: 'Patient Birthday', icon: Heart },
    { id: 'doctor_visit', label: 'Doctor Visit', icon: User },
    { id: 'testimonial', label: 'Patient Testimonial', icon: Heart },
    { id: 'surgery_success', label: 'Surgery Success', icon: Stethoscope },
    { id: 'equipment', label: 'Equipment Highlight', icon: Building },
    { id: 'health_camp', label: 'Health Camp', icon: Bell },
    { id: 'awareness', label: 'Health Awareness', icon: BookOpen }
  ];

  const platformOptions = [
    'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'Google My Business'
  ];

  useEffect(() => {
    if (businessId) {
      fetchCalendarItems();
      fetchCampaigns();
    }
  }, [businessId]);

  const fetchCalendarItems = async () => {
    try {
      const { data, error } = await supabase
        .from('content_calendar')
        .select(`
          *,
          campaign:content_campaigns(name, doctor_name, department)
        `)
        .eq('business_id', businessId)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setCalendarItems(data || []);
    } catch (error) {
      console.error('Error fetching calendar items:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('content_campaigns')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true);

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.contentType || !newItem.scheduledDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, content type, and scheduled date",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('content_calendar')
        .insert({
          business_id: businessId,
          campaign_id: newItem.campaignId || null,
          title: newItem.title,
          content_type: newItem.contentType,
          scheduled_date: newItem.scheduledDate,
          platforms: newItem.platforms,
          content_template: newItem.contentTemplate,
          status: 'planned'
        });

      if (error) throw error;

      toast({
        title: "Content Scheduled",
        description: "Content item added to calendar successfully"
      });

      setNewItem({
        title: '',
        contentType: '',
        scheduledDate: '',
        platforms: [],
        contentTemplate: '',
        campaignId: ''
      });
      setIsAddDialogOpen(false);
      fetchCalendarItems();
    } catch (error) {
      console.error('Error adding calendar item:', error);
      toast({
        title: "Error",
        description: "Failed to add content item",
        variant: "destructive"
      });
    }
  };

  const getContentTypeIcon = (type: string) => {
    const contentType = contentTypes.find(ct => ct.id === type);
    return contentType ? contentType.icon : Calendar;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setNewItem(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Calendar</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newItem.contentType}
                  onChange={(e) => setNewItem(prev => ({ ...prev, contentType: e.target.value }))}
                >
                  <option value="">Select Content Type</option>
                  {contentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Campaign (Optional)</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newItem.campaignId}
                  onChange={(e) => setNewItem(prev => ({ ...prev, campaignId: e.target.value }))}
                >
                  <option value="">No Campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name} 
                      {campaign.doctor_name && ` - Dr. ${campaign.doctor_name}`}
                      {campaign.department && ` (${campaign.department})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scheduled Date</label>
                <Input
                  type="date"
                  value={newItem.scheduledDate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {platformOptions.map((platform) => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newItem.platforms.includes(platform)}
                        onChange={() => handlePlatformToggle(platform)}
                        className="rounded"
                      />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content Template</label>
                <Textarea
                  value={newItem.contentTemplate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, contentTemplate: e.target.value }))}
                  placeholder="Enter content template or notes"
                  rows={3}
                />
              </div>

              <Button onClick={handleAddItem} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Content
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {calendarItems.map((item) => {
          const IconComponent = getContentTypeIcon(item.content_type);
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <IconComponent className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {contentTypes.find(ct => ct.id === item.content_type)?.label}
                      </p>
                      {item.campaign && (
                        <p className="text-xs text-blue-600 mt-1">
                          Campaign: {item.campaign.name}
                          {item.campaign.doctor_name && ` - Dr. ${item.campaign.doctor_name}`}
                        </p>
                      )}
                      {item.content_template && (
                        <p className="text-sm text-gray-700 mt-2">{item.content_template}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(item.scheduled_date).toLocaleDateString()}
                    </p>
                    <Badge className={`text-xs mt-1 ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {calendarItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content scheduled</h3>
            <p className="text-gray-600">Start planning your content calendar by scheduling your first post.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentCalendar;
