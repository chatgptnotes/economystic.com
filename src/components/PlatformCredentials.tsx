import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, Plus, Edit, Shield, Globe, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlatformCredential {
  id: string;
  email: string;
  encrypted_password: string;
  phone_number: string;
  physical_address: string;
  platform_url: string;
  platform: {
    name: string;
    platform_type: string;
    icon_name: string;
  };
}

interface MonitoringPlatform {
  id: string;
  name: string;
  platform_type: string;
  base_url: string;
  icon_name: string;
}

interface PlatformCredentialsProps {
  businessId: string;
}

const PlatformCredentials = ({ businessId }: PlatformCredentialsProps) => {
  const [credentials, setCredentials] = useState<PlatformCredential[]>([]);
  const [platforms, setPlatforms] = useState<MonitoringPlatform[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCredential, setNewCredential] = useState({
    platformId: '',
    email: '',
    password: '',
    phoneNumber: '',
    physicalAddress: '',
    platformUrl: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (businessId) {
      fetchCredentials();
      fetchPlatforms();
    }
  }, [businessId]);

  const fetchCredentials = async () => {
    try {
      // First fetch credentials
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('platform_credentials')
        .select('*')
        .eq('business_id', businessId);

      if (credentialsError) throw credentialsError;

      // Then fetch platform details separately and combine
      const transformedData: PlatformCredential[] = [];
      
      for (const credential of credentialsData || []) {
        // Fetch platform details for each credential
        const { data: platformData, error: platformError } = await supabase
          .from('monitoring_platforms')
          .select('name, platform_type, icon_name')
          .eq('id', credential.platform_id)
          .single();

        if (platformError) {
          console.error('Error fetching platform details:', platformError);
          continue;
        }

        transformedData.push({
          id: credential.id,
          email: credential.email,
          encrypted_password: credential.encrypted_password,
          phone_number: credential.phone_number || '',
          physical_address: credential.physical_address || '',
          platform_url: credential.platform_url || '',
          platform: {
            name: platformData?.name || '',
            platform_type: platformData?.platform_type || '',
            icon_name: platformData?.icon_name || ''
          }
        });
      }

      setCredentials(transformedData);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const { data: socialPlatforms } = await supabase
        .from('social_media_platforms')
        .select('*');

      const { data: monitoringPlatforms } = await supabase
        .from('monitoring_platforms')
        .select('*');

      const allPlatforms = [
        ...(socialPlatforms || []).map(p => ({ ...p, platform_type: 'social' })),
        ...(monitoringPlatforms || [])
      ];

      setPlatforms(allPlatforms);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const handleAddCredential = async () => {
    if (!newCredential.email || !newCredential.password || !newCredential.platformId) {
      toast({
        title: "Missing Information",
        description: "Please fill in email, password, and platform",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real application, you would encrypt the password before storing
      const { data, error } = await supabase
        .from('platform_credentials')
        .insert({
          business_id: businessId,
          platform_id: newCredential.platformId,
          email: newCredential.email,
          encrypted_password: btoa(newCredential.password), // Basic encoding for demo
          phone_number: newCredential.phoneNumber,
          physical_address: newCredential.physicalAddress,
          platform_url: newCredential.platformUrl,
          created_by: 'current_user' // Replace with actual user
        });

      if (error) throw error;

      toast({
        title: "Credential Added",
        description: "Platform credential saved successfully"
      });

      setNewCredential({
        platformId: '',
        email: '',
        password: '',
        phoneNumber: '',
        physicalAddress: '',
        platformUrl: ''
      });
      setIsAddDialogOpen(false);
      fetchCredentials();
    } catch (error) {
      console.error('Error adding credential:', error);
      toast({
        title: "Error",
        description: "Failed to save credential",
        variant: "destructive"
      });
    }
  };

  const togglePasswordVisibility = (credentialId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const getPlatformIcon = (iconName: string) => {
    if (iconName === 'map-pin') return MapPin;
    return Globe;
  };

  const groupedCredentials = credentials.reduce((acc, cred) => {
    const type = cred.platform.platform_type || 'social';
    if (!acc[type]) acc[type] = [];
    acc[type].push(cred);
    return acc;
  }, {} as Record<string, PlatformCredential[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Credentials</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Credential
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Platform Credential</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newCredential.platformId}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, platformId: e.target.value }))}
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name} ({platform.platform_type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={newCredential.email}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={newCredential.password}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={newCredential.phoneNumber}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Physical Address</label>
                <Textarea
                  value={newCredential.physicalAddress}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, physicalAddress: e.target.value }))}
                  placeholder="Enter physical address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Platform URL</label>
                <Input
                  value={newCredential.platformUrl}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, platformUrl: e.target.value }))}
                  placeholder="Enter platform URL"
                />
              </div>
              <Button onClick={handleAddCredential} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Save Credential
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="review">Review Platforms</TabsTrigger>
          <TabsTrigger value="medical">Medical Platforms</TabsTrigger>
        </TabsList>

        {Object.entries(groupedCredentials).map(([type, creds]) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creds.map((credential) => {
                const IconComponent = getPlatformIcon(credential.platform.icon_name);
                return (
                  <Card key={credential.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                          {credential.platform.name}
                        </div>
                        <Badge variant="outline">{credential.platform.platform_type}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-sm">{credential.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm flex-1">
                            {showPasswords[credential.id] 
                              ? atob(credential.encrypted_password) 
                              : '••••••••'
                            }
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(credential.id)}
                          >
                            {showPasswords[credential.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {credential.phone_number && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-sm">{credential.phone_number}</p>
                        </div>
                      )}
                      {credential.physical_address && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Address</label>
                          <p className="text-sm">{credential.physical_address}</p>
                        </div>
                      )}
                      {credential.platform_url && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">URL</label>
                          <a 
                            href={credential.platform_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {credential.platform_url}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PlatformCredentials;
