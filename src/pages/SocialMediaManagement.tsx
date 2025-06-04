
import AdvancedSocialMediaDashboard from "@/components/AdvancedSocialMediaDashboard";

const SocialMediaManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Social Media Management & Monitoring
          </h1>
          <p className="text-gray-600">
            Comprehensive platform for managing Hope & Ayushman Hospitals' digital presence
          </p>
        </div>
        
        <AdvancedSocialMediaDashboard />
      </div>
    </div>
  );
};

export default SocialMediaManagement;
