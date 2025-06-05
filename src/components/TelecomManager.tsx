
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Phone, Wifi, Globe, Calendar, CheckCircle, XCircle, AlertTriangle, Plus, Eye, EyeOff, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import TelecomServiceForm from "./TelecomServiceForm";
import TelecomCheckForm from "./TelecomCheckForm";

interface TelecomService {
  id: string;
  service_type: string;
  service_number: string;
  provider_name: string;
  company_name: string;
  department: string;
  assigned_to: string;
  monthly_cost: number;
  bill_due_date: string;
  wifi_password: string;
  contact_person: string;
  contact_phone: string;
  is_active: boolean;
  notes: string;
}

interface TelecomCheck {
  id: string;
  service_id: string;
  check_date: string;
  checked_by: string;
  status: string;
  issues_found?: string;
}

const TelecomManager = () => {
  const { toast } = useToast();
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCheckForm, setShowCheckForm] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<TelecomService | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const { data: services = [], refetch: refetchServices } = useQuery({
    queryKey: ['telecom-services'],
    queryFn: async () => {
      console.log('Fetching telecom services...');
      const { data, error } = await supabase
        .from('telecom_services')
        .select('*')
        .order('company_name', { ascending: true });

      if (error) {
        console.error('Error fetching telecom services:', error);
        throw error;
      }

      return data || [];
    }
  });

  const { data: recentChecks = [] } = useQuery({
    queryKey: ['telecom-checks-recent'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching recent telecom checks for:', today);
      
      const { data, error } = await supabase
        .from('telecom_checks')
        .select('*')
        .gte('check_date', today)
        .order('check_time', { ascending: false });

      if (error) {
        console.error('Error fetching telecom checks:', error);
        throw error;
      }

      return data || [];
    }
  });

  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    try {
      console.log('Deleting telecom service:', serviceId);
      
      const { error } = await supabase
        .from('telecom_services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        console.error('Error deleting telecom service:', error);
        toast({
          title: "Error",
          description: "Failed to delete service",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Service "${serviceName}" has been deleted`,
      });
      
      refetchServices();
    } catch (error) {
      console.error('Error deleting telecom service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleEditService = (service: TelecomService) => {
    setEditingService(service);
  };

  const handleEditSuccess = () => {
    setEditingService(null);
    refetchServices();
  };

  const togglePasswordVisibility = (serviceId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "mobile": return <Phone className="h-4 w-4" />;
      case "landline": return <Phone className="h-4 w-4" />;
      case "wifi": return <Wifi className="h-4 w-4" />;
      case "broadband": return <Globe className="h-4 w-4" />;
      case "toll_free": return <Phone className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "mobile": return "bg-blue-100 text-blue-800";
      case "landline": return "bg-green-100 text-green-800";
      case "wifi": return "bg-purple-100 text-purple-800";
      case "broadband": return "bg-orange-100 text-orange-800";
      case "toll_free": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLastCheckStatus = (serviceId: string) => {
    const serviceChecks = recentChecks.filter(check => check.service_id === serviceId);
    if (serviceChecks.length === 0) return null;
    
    const latestCheck = serviceChecks[0];
    return latestCheck;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "working": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "not_working": return <XCircle className="h-4 w-4 text-red-500" />;
      case "partial": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "no_answer": return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredServices = filterType === "all" 
    ? services 
    : services.filter((service: TelecomService) => service.service_type === filterType);

  const totalMonthlyCost = services.reduce((sum: number, service: TelecomService) => 
    sum + (service.monthly_cost || 0), 0);

  const servicesDueSoon = services.filter((service: TelecomService) => {
    const daysUntilDue = getDaysUntilDue(service.bill_due_date);
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold">₹{totalMonthlyCost.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bills Due Soon</p>
                <p className="text-2xl font-bold text-red-600">{servicesDueSoon.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Checked Today</p>
                <p className="text-2xl font-bold">{recentChecks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Telecommunications Infrastructure</CardTitle>
            <Button onClick={() => setShowServiceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["all", "mobile", "landline", "broadband", "toll_free", "wifi"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type === "all" ? "All Services" : type.replace("_", " ").toUpperCase()}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>WiFi Password</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Bill Due</TableHead>
                  <TableHead>Last Check</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service: TelecomService) => {
                  const lastCheck = getLastCheckStatus(service.id);
                  const daysUntilDue = getDaysUntilDue(service.bill_due_date);
                  
                  return (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getServiceIcon(service.service_type)}
                          <div>
                            <p className="font-medium">{service.service_number}</p>
                            <Badge className={getServiceTypeColor(service.service_type)}>
                              {service.service_type.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{service.provider_name}</TableCell>
                      <TableCell>{service.company_name}</TableCell>
                      <TableCell>{service.department}</TableCell>
                      <TableCell>{service.assigned_to}</TableCell>
                      <TableCell>
                        {service.service_type === 'wifi' && service.wifi_password ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm">
                              {showPasswords[service.id] ? service.wifi_password : '••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePasswordVisibility(service.id)}
                            >
                              {showPasswords[service.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {service.contact_person ? (
                          <div>
                            <p className="font-medium text-sm">{service.contact_person}</p>
                            {service.contact_phone && (
                              <p className="text-xs text-gray-500">{service.contact_phone}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>₹{service.monthly_cost?.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{new Date(service.bill_due_date).toLocaleDateString()}</span>
                          {daysUntilDue <= 7 && daysUntilDue >= 0 && (
                            <Badge variant="destructive">
                              {daysUntilDue === 0 ? "Due Today" : `${daysUntilDue} days`}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lastCheck ? (
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(lastCheck.status)}
                            <span className="text-sm">{lastCheck.checked_by}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not checked today</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCheckForm(service.id)}
                          >
                            Check Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the service "{service.service_number}" 
                                  for {service.company_name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteService(service.id, service.service_number)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      {showServiceForm && (
        <TelecomServiceForm
          onClose={() => setShowServiceForm(false)}
          onSuccess={() => {
            setShowServiceForm(false);
            refetchServices();
          }}
        />
      )}

      {editingService && (
        <TelecomServiceForm
          service={editingService}
          onClose={() => setEditingService(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showCheckForm && (
        <TelecomCheckForm
          serviceId={showCheckForm}
          onClose={() => setShowCheckForm(null)}
          onSuccess={() => {
            setShowCheckForm(null);
            refetchServices();
          }}
        />
      )}
    </div>
  );
};

export default TelecomManager;
