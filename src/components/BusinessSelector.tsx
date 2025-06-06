
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Business {
  id: string;
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
}

interface BusinessSelectorProps {
  selectedBusinessId: string | null;
  onBusinessSelect: (businessId: string) => void;
}

const BusinessSelector = ({ selectedBusinessId, onBusinessSelect }: BusinessSelectorProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching businesses:', error);
          return;
        }

        console.log('Fetched businesses:', data);
        setBusinesses(data || []);
      } catch (error) {
        console.error('Error in fetchBusinesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading businesses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-blue-600" />
          Select Business
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedBusinessId || ""} onValueChange={onBusinessSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a business to manage" />
          </SelectTrigger>
          <SelectContent>
            {businesses.map((business) => (
              <SelectItem key={business.id} value={business.id}>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>{business.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedBusinessId && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {businesses
              .filter(b => b.id === selectedBusinessId)
              .map(business => (
                <div key={business.id} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{business.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{business.description}</p>
                  {business.website_url && (
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <Globe className="h-4 w-4 mr-1" />
                      <span>Website Available</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessSelector;
