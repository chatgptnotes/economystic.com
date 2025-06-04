
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import ReportStatusBadge from "./ReportStatusBadge";

interface Report {
  id: string;
  name: string;
  type: string;
  uploaded_at: string;
  analysis_status: string;
  context_data?: Record<string, string>;
}

interface ReportHistoryProps {
  reports: Report[];
  reportTypes: Array<{
    id: string;
    title: string;
    fields: Array<{
      label: string;
      placeholder: string;
    }>;
  }>;
}

const ReportHistory = ({ reports, reportTypes }: ReportHistoryProps) => {
  if (reports.length === 0) {
    return null;
  }

  const getReportTypeFields = (reportTypeId: string) => {
    return reportTypes.find(t => t.id === reportTypeId)?.fields || [];
  };

  const renderContextData = (report: Report) => {
    if (!report.context_data) return null;

    const fields = getReportTypeFields(report.type);
    const contextEntries = Object.entries(report.context_data);

    return (
      <div className="mt-2 space-y-1">
        {contextEntries.map(([key, value], index) => {
          const fieldIndex = parseInt(key.replace('field', '')) - 1;
          const fieldLabel = fields[fieldIndex]?.label || key;
          
          if (!value || value.trim() === '') return null;
          
          return (
            <div key={key} className="text-xs text-gray-600">
              <span className="font-medium">{fieldLabel}:</span> {value}
            </div>
          );
        })}
      </div>
    );
  };

  return (
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">
                    {reportTypes.find(t => t.id === report.type)?.title || report.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(report.uploaded_at).toLocaleString()}
                  </p>
                  {renderContextData(report)}
                </div>
                <ReportStatusBadge status={report.analysis_status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportHistory;
