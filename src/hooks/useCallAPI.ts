
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CallParams {
  phoneNumber: string;
  campaign?: string;
  clientId?: string;
}

export const useCallAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const makeCall = async ({ phoneNumber, campaign, clientId }: CallParams) => {
    setIsLoading(true);
    
    try {
      console.log('Initiating call to:', phoneNumber);
      
      const { data, error } = await supabase.functions.invoke('make-call', {
        body: {
          phoneNumber,
          campaign,
          clientId
        }
      });

      if (error) {
        console.error('Call function error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Call Initiated",
          description: `Call started to ${phoneNumber}`,
        });
        return { success: true, data };
      } else {
        throw new Error(data?.error || 'Failed to initiate call');
      }
    } catch (error) {
      console.error('Error making call:', error);
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate call. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makeCall,
    isLoading
  };
};
