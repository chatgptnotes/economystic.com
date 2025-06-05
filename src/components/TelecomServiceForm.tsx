
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface TelecomServiceFormProps {
  service?: TelecomService;
  onClose: () => void;
  onSuccess: () => void;
}

const TelecomServiceForm = ({ service, onClose, onSuccess }: TelecomServiceFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_type: "",
    service_number: "",
    provider_name: "",
    company_name: "",
    department: "",
    assigned_to: "",
    monthly_cost: "",
    bill_due_date: "",
    contract_start_date: "",
    contract_end_date: "",
    wifi_password: "",
    contact_person: "",
    contact_phone: "",
    notes: ""
  });

  useEffect(() => {
    if (service) {
      setFormData({
        service_type: service.service_type || "",
        service_number: service.service_number || "",
        provider_name: service.provider_name || "",
        company_name: service.company_name || "",
        department: service.department || "",
        assigned_to: service.assigned_to || "",
        monthly_cost: service.monthly_cost ? service.monthly_cost.toString() : "",
        bill_due_date: service.bill_due_date || "",
        contract_start_date: "",
        contract_end_date: "",
        wifi_password: service.wifi_password || "",
        contact_person: service.contact_person || "",
        contact_phone: service.contact_phone || "",
        notes: service.notes || ""
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        monthly_cost: formData.monthly_cost ? parseFloat(formData.monthly_cost) : null,
        bill_due_date: formData.bill_due_date || null,
        contract_start_date: formData.contract_start_date || null,
        contract_end_date: formData.contract_end_date || null,
        wifi_password: formData.wifi_password || null,
        contact_person: formData.contact_person || null,
        contact_phone: formData.contact_phone || null
      };

      let error;
      
      if (service) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('telecom_services')
          .update(dataToSubmit)
          .eq('id', service.id);
        error = updateError;
      } else {
        // Create new service
        const { error: insertError } = await supabase
          .from('telecom_services')
          .insert([dataToSubmit]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Telecom service ${service ? 'updated' : 'added'} successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving telecom service:', error);
      toast({
        title: "Error",
        description: `Failed to ${service ? 'update' : 'add'} telecom service`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{service ? 'Edit' : 'Add New'} Telecom Service</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_type">Service Type</Label>
              <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="landline">Landline</SelectItem>
                  <SelectItem value="broadband">Broadband</SelectItem>
                  <SelectItem value="toll_free">Toll Free</SelectItem>
                  <SelectItem value="wifi">WiFi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service_number">Service Number</Label>
              <Input
                id="service_number"
                value={formData.service_number}
                onChange={(e) => handleInputChange('service_number', e.target.value)}
                placeholder="e.g., +91-9876543210"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider_name">Provider Name</Label>
              <Input
                id="provider_name"
                value={formData.provider_name}
                onChange={(e) => handleInputChange('provider_name', e.target.value)}
                placeholder="e.g., Airtel, BSNL"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="e.g., Ayushman Polyclinic"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Reception, IT"
              />
            </div>

            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                value={formData.assigned_to}
                onChange={(e) => handleInputChange('assigned_to', e.target.value)}
                placeholder="Person responsible"
              />
            </div>
          </div>

          {formData.service_type === 'wifi' && (
            <div>
              <Label htmlFor="wifi_password">WiFi Password</Label>
              <Input
                id="wifi_password"
                type="password"
                value={formData.wifi_password}
                onChange={(e) => handleInputChange('wifi_password', e.target.value)}
                placeholder="WiFi network password"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person (for issues)</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Person to contact if service is faulty"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="Phone number of contact person"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="monthly_cost">Monthly Cost (₹)</Label>
              <Input
                id="monthly_cost"
                type="number"
                step="0.01"
                value={formData.monthly_cost}
                onChange={(e) => handleInputChange('monthly_cost', e.target.value)}
                placeholder="599.00"
              />
            </div>

            <div>
              <Label htmlFor="bill_due_date">Bill Due Date</Label>
              <Input
                id="bill_due_date"
                type="date"
                value={formData.bill_due_date}
                onChange={(e) => handleInputChange('bill_due_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contract_start_date">Contract Start</Label>
              <Input
                id="contract_start_date"
                type="date"
                value={formData.contract_start_date}
                onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this service"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (service ? "Updating..." : "Adding...") : (service ? "Update Service" : "Add Service")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TelecomServiceForm;
