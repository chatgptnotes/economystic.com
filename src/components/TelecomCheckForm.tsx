
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface TelecomCheckFormProps {
  serviceId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TelecomCheckForm = ({ serviceId, onClose, onSuccess }: TelecomCheckFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    checked_by: "",
    status: "",
    response_time_seconds: "",
    issues_found: "",
    action_taken: "",
    notes: ""
  });

  const { data: service } = useQuery({
    queryKey: ['telecom-service', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telecom_services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('telecom_checks')
        .insert([{
          service_id: serviceId,
          check_date: new Date().toISOString().split('T')[0],
          ...formData,
          response_time_seconds: formData.response_time_seconds ? parseInt(formData.response_time_seconds) : null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service check recorded successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error recording service check:', error);
      toast({
        title: "Error",
        description: "Failed to record service check",
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
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Service Check</CardTitle>
        {service && (
          <p className="text-sm text-gray-600">
            {service.service_type.toUpperCase()}: {service.service_number} ({service.provider_name})
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="checked_by">Checked By</Label>
            <Input
              id="checked_by"
              value={formData.checked_by}
              onChange={(e) => handleInputChange('checked_by', e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="not_working">Not Working</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="no_answer">No Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="response_time_seconds">Response Time (seconds)</Label>
            <Input
              id="response_time_seconds"
              type="number"
              value={formData.response_time_seconds}
              onChange={(e) => handleInputChange('response_time_seconds', e.target.value)}
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <Label htmlFor="issues_found">Issues Found</Label>
            <Textarea
              id="issues_found"
              value={formData.issues_found}
              onChange={(e) => handleInputChange('issues_found', e.target.value)}
              placeholder="Describe any issues encountered"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="action_taken">Action Taken</Label>
            <Textarea
              id="action_taken"
              value={formData.action_taken}
              onChange={(e) => handleInputChange('action_taken', e.target.value)}
              placeholder="What action was taken to resolve issues"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional observations"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Recording..." : "Record Check"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TelecomCheckForm;
