
import Header from "@/components/Header";
import IntelligentSearch from "@/components/IntelligentSearch";
import SesameVoiceAI from "@/components/SesameVoiceAI";

const IntelligentSearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Intelligent Database Search
            </h1>
            <p className="text-gray-600">
              Search across all your data using natural language powered by AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <IntelligentSearch />
            </div>
            <div>
              <SesameVoiceAI 
                onTranscription={(text) => {
                  console.log('Sesame transcription:', text);
                }}
                onResponse={(response) => {
                  console.log('Sesame AI response:', response);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntelligentSearchPage;
