import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronUp, Database, User, Phone, Calendar, FileText, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VoiceRecorder from "./VoiceRecorder";
import GPTVoiceChat from "./GPTVoiceChat";

interface SearchResult {
  table: string;
  data: any[];
  count: number;
}

interface SearchResponse {
  query: string;
  intent: string;
  results: SearchResult[];
  summary: string;
  totalResults: number;
}

const IntelligentSearch = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-search', {
        body: { query }
      });

      if (error) throw error;

      setSearchResults(data);
      if (data.totalResults === 0) {
        toast({
          title: "No Results",
          description: "No matching records found for your query",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${data.totalResults} results across ${data.results.length} tables`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setQuery(text);
    // Automatically search after voice input
    setTimeout(() => {
      if (text.trim()) {
        handleSearch();
      }
    }, 500);
  };

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getTableIcon = (tableName: string) => {
    switch (tableName) {
      case 'domains':
        return <Globe className="h-4 w-4" />;
      case 'call_records':
      case 'whatsapp_messages':
        return <Phone className="h-4 w-4" />;
      case 'patient_events':
      case 'ambulance_bookings':
        return <User className="h-4 w-4" />;
      case 'content_calendar':
      case 'content_campaigns':
        return <Calendar className="h-4 w-4" />;
      case 'prompts':
      case 'reports':
        return <FileText className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const formatTableName = (tableName: string) => {
    if (tableName === 'domains') return 'Domain Management';
    return tableName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const renderRecordCard = (record: any, tableName: string) => {
    const getDisplayFields = () => {
      switch (tableName) {
        case 'domains':
          return [
            { label: 'Domain', value: record.name },
            { label: 'Category', value: record.category },
            { label: 'Status', value: record.status },
            { label: 'Registrar', value: record.registrar },
            { label: 'Expires', value: new Date(record.expirationDate).toLocaleDateString() }
          ];
        case 'call_records':
          return [
            { label: 'Patient', value: record.patient_name },
            { label: 'Phone', value: record.phone_number },
            { label: 'Type', value: record.call_type },
            { label: 'Status', value: record.call_status },
            { label: 'Notes', value: record.notes }
          ];
        case 'ambulance_bookings':
          return [
            { label: 'Patient', value: record.patient_name },
            { label: 'Phone', value: record.phone_number },
            { label: 'From', value: record.pickup_location },
            { label: 'To', value: record.destination },
            { label: 'Status', value: record.status }
          ];
        case 'patient_events':
          return [
            { label: 'Patient', value: record.patient_name },
            { label: 'Event', value: record.event_type },
            { label: 'Doctor', value: record.doctor_name },
            { label: 'Department', value: record.department },
            { label: 'Date', value: new Date(record.event_date).toLocaleDateString() }
          ];
        case 'businesses':
          return [
            { label: 'Name', value: record.name },
            { label: 'Description', value: record.description },
            { label: 'Website', value: record.website_url }
          ];
        case 'prompts':
          return [
            { label: 'Title', value: record.title },
            { label: 'Project', value: record.project_name },
            { label: 'Category', value: record.category },
            { label: 'Content', value: record.content?.substring(0, 100) + '...' }
          ];
        default:
          return Object.entries(record).slice(0, 5).map(([key, value]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
            value: String(value)
          }));
      }
    };

    return (
      <Card key={record.id} className="mb-2">
        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {getDisplayFields().filter(field => field.value).map((field, index) => (
              <div key={index}>
                <span className="font-medium text-gray-600">{field.label}:</span>
                <span className="ml-2">{field.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Intelligent Database Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search across all data... (e.g., 'find all patients from last week', 'telecom services for cardiology', 'do we have domain anohra.com')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <VoiceRecorder 
              onTranscription={handleVoiceTranscription}
              isSearching={isSearching}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="min-w-[100px]"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Try voice search: Click the microphone icon and speak your query
          </p>
        </CardContent>
      </Card>

      {/* GPT Voice Chat - Show after search results */}
      {searchResults && (
        <GPTVoiceChat 
          searchResults={searchResults} 
          searchQuery={query}
        />
      )}

      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {searchResults.totalResults} results found
              </Badge>
              <Badge variant="outline">
                {searchResults.results.length} tables searched
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {searchResults.summary && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{searchResults.summary}</p>
              </div>
            )}

            <div className="space-y-3">
              {searchResults.results.map((result) => (
                <Collapsible key={result.table}>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleTable(result.table)}
                  >
                    <Card className="cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTableIcon(result.table)}
                            <span className="font-medium">{formatTableName(result.table)}</span>
                            <Badge variant="secondary">{result.count} results</Badge>
                          </div>
                          {expandedTables.has(result.table) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 ml-4 space-y-2">
                      {result.data.map((record) => renderRecordCard(record, result.table))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntelligentSearch;
