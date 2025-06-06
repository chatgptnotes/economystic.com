
import DomainManager from "@/components/DomainManager";

const DomainManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Domain Management Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive management for all your domain portfolios
          </p>
        </div>
        
        <DomainManager />
      </div>
    </div>
  );
};

export default DomainManagement;
