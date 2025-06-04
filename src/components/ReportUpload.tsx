
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const { toast } = useToast();
  
  // Create refs for each file input
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const reportTypes = [
    {
      id: 'whatsapp_double_tick',
      title: 'WhatsApp Double Tick Report',
      description: 'Upload WhatsApp message delivery reports'
    },
    {
      id: 'centro_call_center',
      title: 'Centro Call Center Report',
      description: 'Upload call center software reports'
    },
    {
      id: 'raftaar_ambulance',
      title: 'Raftaar Ambulance Bookings',
      description: 'Upload ambulance booking reports'
    }
  ];

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

      // Save report record to database
      const { data: reportData, error: dbError } = await supabase
        .from('reports')
        .insert({
          name: file.name,
          type: reportType,
          file_path: filePath,
          analysis_status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Trigger AI analysis
      const { error: analysisError } = await supabase.functions.invoke('analyze-report', {
        body: { reportId: reportData.id, filePath: filePath, reportType: reportType }
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
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error loading reports:', error);
      return;
    }

    setReports(data || []);
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
  useState(() => {
    loadReports();
  });

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
