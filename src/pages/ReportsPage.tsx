
import Header from "@/components/Header";
import ReportUpload from "@/components/ReportUpload";

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Analysis</h1>
          <p className="text-gray-600 mt-2">
            Upload your reports for AI-powered analysis and data extraction
          </p>
        </div>
        
        <ReportUpload />
      </main>
    </div>
  );
};

export default ReportsPage;
