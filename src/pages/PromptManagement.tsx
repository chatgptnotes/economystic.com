
import PromptManager from "@/components/PromptManager";

const PromptManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prompt Management
          </h1>
          <p className="text-gray-600">
            Manage and share prompts with your team for each project
          </p>
        </div>
        
        <PromptManager />
      </div>
    </div>
  );
};

export default PromptManagement;
