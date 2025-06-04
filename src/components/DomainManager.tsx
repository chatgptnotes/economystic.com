
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Calendar, Shield, AlertTriangle, Search, Plus, ExternalLink, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: string;
  name: string;
  registrar: string;
  expirationDate: string;
  autoRenew: boolean;
  protectionPlan: string;
  status: 'active' | 'expiring' | 'expired';
  category: string;
  daysUntilExpiry: number;
}

const DomainManager = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState({
    name: '',
    registrar: '',
    expirationDate: '',
    category: '',
    autoRenew: false,
    protectionPlan: 'None'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with your domain data
    initializeDomains();
  }, []);

  const initializeDomains = () => {
    const domainData: Omit<Domain, 'id' | 'daysUntilExpiry' | 'status'>[] = [
      { name: 'anohra.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Business' },
      { name: 'hopesoftwares.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Software' },
      { name: 'gmcnagpuralumni.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Education' },
      { name: 'drmhope.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'modernmedicalentrepreneur.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'anohra.ai', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'AI/Tech' },
      { name: 'drmurali.ai', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'AI/Tech' },
      { name: 'yellowfevervaccines.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'economystic.ai', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'AI/Tech' },
      { name: 'adamrit.ai', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'AI/Tech' },
      { name: 'digihealthtwin.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'digihealthtwin.ai', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'AI/Tech' },
      { name: 'rescueseva.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'onescanonelife.com', registrar: 'Unknown', expirationDate: '2025-07-24', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'emergencyseva.ai', registrar: 'Unknown', expirationDate: '2025-08-07', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachao.co', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachao.xyz', registrar: 'Unknown', expirationDate: '2025-08-24', autoRenew: true, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachao.store', registrar: 'Unknown', expirationDate: '2025-08-25', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachao.net', registrar: 'Unknown', expirationDate: '2025-08-25', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachao.info', registrar: 'Unknown', expirationDate: '2025-08-24', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachaomujhebachao.com', registrar: 'Unknown', expirationDate: '2025-08-25', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'ayushmannagpurhospital.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'rseva.health', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'maharashtratv24.in', registrar: 'Unknown', expirationDate: '2025-06-14', autoRenew: true, protectionPlan: 'None', category: 'Media' },
      { name: 'rescueseva.in', registrar: 'Unknown', expirationDate: '2025-07-24', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'onescanonelife.in', registrar: 'Unknown', expirationDate: '2025-08-08', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'instaaid.in', registrar: 'Unknown', expirationDate: '2025-08-10', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'bachaobachao.in', registrar: 'Unknown', expirationDate: '2025-08-25', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'mujhebachao.in', registrar: 'Unknown', expirationDate: '2025-08-25', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'theayushmanhospital.com', registrar: 'Unknown', expirationDate: '2025-08-28', autoRenew: true, protectionPlan: 'None', category: 'Medical' },
      { name: 'hopefoundationtrust.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Foundation' },
      { name: 'hopehospital.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'anohra.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Business' },
      { name: 'adamrit.com', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Business' },
      { name: 'yellowfever.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'digihealthtwin.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Medical' },
      { name: 'emergencyseva.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Emergency' },
      { name: 'ambufast.in', registrar: 'Unknown', expirationDate: '2025-12-31', autoRenew: false, protectionPlan: 'None', category: 'Emergency' }
    ];

    const transformedDomains = domainData.map((domain, index) => {
      const expirationDate = new Date(domain.expirationDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: 'active' | 'expiring' | 'expired' = 'active';
      if (daysUntilExpiry < 0) status = 'expired';
      else if (daysUntilExpiry <= 30) status = 'expiring';

      return {
        id: (index + 1).toString(),
        ...domain,
        daysUntilExpiry,
        status
      };
    });

    setDomains(transformedDomains);
  };

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (status === 'expiring') {
      return <Badge variant="secondary">Expires in {daysUntilExpiry} days</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedDomains = filteredDomains.reduce((acc, domain) => {
    if (!acc[domain.category]) acc[domain.category] = [];
    acc[domain.category].push(domain);
    return acc;
  }, {} as Record<string, Domain[]>);

  const expiringDomains = domains.filter(d => d.status === 'expiring' || d.status === 'expired');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Domain Management</h2>
          <p className="text-gray-600">Manage all your domains from one dashboard</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Domain name (e.g., example.com)"
                value={newDomain.name}
                onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Registrar"
                value={newDomain.registrar}
                onChange={(e) => setNewDomain(prev => ({ ...prev, registrar: e.target.value }))}
              />
              <Input
                type="date"
                value={newDomain.expirationDate}
                onChange={(e) => setNewDomain(prev => ({ ...prev, expirationDate: e.target.value }))}
              />
              <select
                className="w-full p-2 border rounded-md"
                value={newDomain.category}
                onChange={(e) => setNewDomain(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select Category</option>
                <option value="Medical">Medical</option>
                <option value="Emergency">Emergency</option>
                <option value="AI/Tech">AI/Tech</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Foundation">Foundation</option>
                <option value="Media">Media</option>
                <option value="Software">Software</option>
              </select>
              <Button className="w-full">Add Domain</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search domains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Domains</p>
                <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Domains</p>
                <p className="text-2xl font-bold text-gray-900">{domains.filter(d => d.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{expiringDomains.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auto-Renew</p>
                <p className="text-2xl font-bold text-gray-900">{domains.filter(d => d.autoRenew).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Domains</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredDomains.map((domain) => (
              <Card key={domain.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Globe className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{domain.name}</h3>
                        <p className="text-sm text-gray-600">{domain.category} • {domain.registrar}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(domain.status, domain.daysUntilExpiry)}
                      <div className="text-right">
                        <p className="text-sm font-medium">Expires: {new Date(domain.expirationDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          {domain.autoRenew ? 'Auto-renew enabled' : 'Manual renewal required'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <div className="space-y-4">
            {expiringDomains.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Expiring Domains</h3>
                  <p className="text-gray-600">All your domains are safe for now!</p>
                </CardContent>
              </Card>
            ) : (
              expiringDomains.map((domain) => (
                <Card key={domain.id} className="border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{domain.name}</h3>
                          <p className="text-sm text-gray-600">{domain.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(domain.status, domain.daysUntilExpiry)}
                        <Button variant="destructive" size="sm">
                          Renew Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="space-y-6">
            {Object.entries(groupedDomains).map(([category, categoryDomains]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category} ({categoryDomains.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryDomains.map((domain) => (
                      <div key={domain.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{domain.name}</h4>
                          {getStatusBadge(domain.status, domain.daysUntilExpiry)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Expires: {new Date(domain.expirationDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={domain.autoRenew ? "default" : "outline"} className="text-xs">
                            {domain.autoRenew ? "Auto-renew" : "Manual"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainManager;
