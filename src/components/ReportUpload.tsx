
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  
  // Create refs for each file input
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const reportTypes = [
    {
      id: 'whatsapp_double_tick',
      title: 'WhatsApp Double Tick Report',
      description: 'Upload WhatsApp message delivery reports',
      fields: [
        { label: 'Date Range', placeholder: 'e.g., 01/01/2024 - 31/01/2024' },
        { label: 'Campaign Name', placeholder: 'e.g., Monthly Health Tips' },
        { label: 'Target Audience', placeholder: 'e.g., Diabetes patients' }
      ]
    },
    {
      id: 'centro_call_center',
      title: 'Centro Call Center Report',
      description: 'Upload call center software reports',
      fields: [
        { label: 'Call Period', placeholder: 'e.g., Last 30 days' },
        { label: 'Department', placeholder: 'e.g., Patient Support' },
        { label: 'Call Type', placeholder: 'e.g., Appointment bookings' }
      ]
    },
    {
      id: 'raftaar_ambulance',
      title: 'Raftaar Ambulance Bookings',
      description: 'Upload ambulance booking reports',
      fields: [
        { label: 'Service Area', placeholder: 'e.g., Mumbai Central' },
        { label: 'Time Period', placeholder: 'e.g., Weekly report' },
        { label: 'Emergency Type', placeholder: 'e.g., Critical care' }
      ]
    }
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <div key={reportType.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{reportType.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{reportType.description}</p>
                
                {/* Context Data Input Fields */}
                <div className="space-y-3 mb-4">
                  {reportType.fields.map((field, index) => (
                    <div key={index}>
                      <Label htmlFor={`${reportType.id}-field${index + 1}`} className="text-xs text-gray-600">
                        {field.label}
                      </Label>
                      <Input
                        id={`${reportType.id}-field${index + 1}`}
                        type="text"
                        placeholder={field.placeholder}
                        value={formData[reportType.id][`field${index + 1}`]}
                        onChange={(e) => handleInputChange(reportType.id, index, e.target.value)}
                        className="text-sm"
                        disabled={uploading[reportType.id]}
                      />
                    </div>
                  ))}
                </div>
                
                <Input
                  ref={(el) => {
                    fileInputRefs.current[reportType.id] = el;
                  }}
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, reportType.id);
                    }
                  }}
                  disabled={uploading[reportType.id]}
                  className="mb-2"
                  style={{ display: 'none' }}
                />
                
                <Button
                  disabled={uploading[reportType.id]}
                  className="w-full"
                  onClick={() => {
                    fileInputRefs.current[reportType.id]?.click();
                  }}
                >
                  {uploading[reportType.id] ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Report
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Upload History & Analysis Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600">
                        {reportTypes.find(t => t.id === report.type)?.title || report.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(report.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.analysis_status)}
                      <Badge className={getStatusColor(report.analysis_status)}>
                        {report.analysis_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportUpload;
