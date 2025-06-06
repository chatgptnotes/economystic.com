
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Clock, Download } from "lucide-react";
import { downloadSpreadsheetTemplate } from "@/utils/spreadsheetTemplates";

interface ReportTypeCardProps {
  reportType: {
    id: string;
    title: string;
    description: string;
    fields: Array<{
      label: string;
      placeholder: string;
    }>;
  };
  formData: Record<string, string>;
  uploading: boolean;
  onInputChange: (fieldIndex: number, value: string) => void;
  onFileUpload: (file: File) => void;
}

const ReportTypeCard = ({ 
  reportType, 
  formData, 
  uploading, 
  onInputChange, 
  onFileUpload 
}: ReportTypeCardProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    console.log('Upload button clicked for:', reportType.id);
    console.log('Current form data:', formData);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadTemplate = () => {
    console.log('Downloading template for:', reportType.id);
    downloadSpreadsheetTemplate(reportType.id);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{reportType.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadTemplate}
          className="h-8 w-8 text-gray-500 hover:text-gray-700"
          title="Download spreadsheet template"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
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
              value={formData[`field${index + 1}`] || ''}
              onChange={(e) => {
                console.log(`Field ${index + 1} changed:`, e.target.value);
                onInputChange(index, e.target.value);
              }}
              className="text-sm"
              disabled={uploading}
            />
          </div>
        ))}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt,.jpg,.jpeg"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      
      <Button
        disabled={uploading}
        className="w-full"
        onClick={handleUploadClick}
      >
        {uploading ? (
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
  );
};

export default ReportTypeCard;
