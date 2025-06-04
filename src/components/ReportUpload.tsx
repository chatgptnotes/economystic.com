
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReportTypeCard from "./report-upload/ReportTypeCard";
import ReportHistory from "./report-upload/ReportHistory";
import { reportTypes } from "./report-upload/reportTypes";

interface Report {
  id: string;
  name: string;
  type: string;
  uploaded_at: string;
  analysis_status: string;
}

const ReportUpload = () => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [reports, setReports] = useState<Report[]>([]);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({
    whatsapp_double_tick: { field1: '', field2: '', field3: '' },
    centro_call_center: { field1: '', field2: '', field3: '' },
    raftaar_ambulance: { field1: '', field2: '', field3: '' }
  });
  const { toast } = useToast();

  const handleInputChange = (reportType: string, fieldIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [reportType]: {
        ...prev[reportType],
        [`field${fieldIndex + 1}`]: value
      }
    }));
  };

  const handleFileUpload = async (file: File, reportType: string) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [reportType]: true }));

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${reportType}_${Date.now()}.${fileExt}`;
      const filePath = `${reportType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save report record to database with additional context data
      const contextData = formData[reportType];
      const { data: reportData, error: dbError } = await supabase
        .from('reports')
        .insert({
          name: file.name,
          type: reportType,
          file_path: filePath,
          analysis_status: 'pending',
          context_data: contextData
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Trigger AI analysis
      const { error: analysisError } = await supabase.functions.invoke('analyze-report', {
        body: { 
          reportId: reportData.id, 
          filePath: filePath, 
          reportType: reportType,
          contextData: contextData
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        // Update status to failed if analysis fails
        await supabase
          .from('reports')
          .update({ analysis_status: 'failed' })
          .eq('id', reportData.id);
      } else {
        // Update status to processing
        await supabase
          .from('reports')
          .update({ analysis_status: 'processing' })
          .eq('id', reportData.id);
      }

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded and AI analysis is starting.`,
      });

      // Clear form data for this report type
      setFormData(prev => ({
        ...prev,
        [reportType]: { field1: '', field2: '', field3: '' }
      }));

      // Refresh reports list
      loadReports();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [reportType]: false }));
    }
  };

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
        return;
      }

      console.log('Loaded reports:', data);
      setReports(data || []);
    } catch (error) {
      console.error('Error in loadReports:', error);
    }
  };

  // Load reports on component mount
  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Report Upload & AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTypes.map((reportType) => (
              <ReportTypeCard
                key={reportType.id}
                reportType={reportType}
                formData={formData[reportType.id]}
                uploading={uploading[reportType.id] || false}
                onInputChange={(fieldIndex, value) => handleInputChange(reportType.id, fieldIndex, value)}
                onFileUpload={(file) => handleFileUpload(file, reportType.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ReportHistory reports={reports} reportTypes={reportTypes} />
    </div>
  );
};

export default ReportUpload;
