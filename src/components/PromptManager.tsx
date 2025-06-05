
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Copy, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Prompt {
  id: string;
  title: string;
  content: string;
  project_id: string;
  project_name: string;
  category: 'development' | 'design' | 'testing' | 'documentation' | 'general';
  created_by: string;
  created_at: string;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  visibility: 'Public' | 'Private';
  lastUpdated: string;
  assignedTo: string;
  platform: 'Cursor' | 'Lovable' | 'V0' | 'Unknown';
  domainAssociated?: string;
  githubUrl: string;
  isActive: boolean;
}

const PromptManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    content: '',
    project_id: '',
    project_name: '',
    category: 'general' as const,
    tags: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock project data - this would come from your ProjectManager in a real implementation
  const mockProjects: Project[] = [
    { id: "1", name: "DrM_Hope_Multi-tenancy-04-06-2025", description: "DrM_Hope_Multi-tenancy 04/06/2025", language: "TypeScript", visibility: "Private", lastUpdated: "6 hours ago", assignedTo: "Bhupendra", platform: "Unknown", githubUrl: "", isActive: true },
    { id: "2", name: "adamrit.in", description: "chatgptnotes/adamrit.in", language: "TypeScript", visibility: "Private", lastUpdated: "2 days ago", assignedTo: "Dinesh", platform: "Unknown", githubUrl: "", isActive: true },
    { id: "3", name: "ambufast.in", description: "The Emergency Ambulance Service at Your Fingertips", language: "TypeScript", visibility: "Private", lastUpdated: "2 weeks ago", assignedTo: "Prathik", platform: "Unknown", githubUrl: "", isActive: true },
    { id: "4", name: "drmhope.com", description: "", language: "TypeScript", visibility: "Private", lastUpdated: "2 weeks ago", assignedTo: "Pooja", platform: "Unknown", githubUrl: "", isActive: true },
    { id: "5", name: "yellowfever.in", description: "", language: "TypeScript", visibility: "Public", lastUpdated: "3 weeks ago", assignedTo: "Poonam", platform: "Unknown", githubUrl: "", isActive: true }
  ];

  const categories = ['development', 'design', 'testing', 'documentation', 'general'];

  // Filter projects based on search term
  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  // Fetch prompts from Supabase
  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Prompt[];
    }
  });

  // Add prompt mutation
  const addPromptMutation = useMutation({
    mutationFn: async (promptData: {
      title: string;
      content: string;
      project_id: string;
      project_name: string;
      category: string;
      tags: string[];
    }) => {
      // For now, use a placeholder user ID until authentication is implemented
      const { data, error } = await supabase
        .from('prompts')
        .insert([{
          ...promptData,
          created_by: '00000000-0000-0000-0000-000000000000' // Placeholder UUID
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      setNewPrompt({ title: '', content: '', project_id: '', project_name: '', category: 'general', tags: '' });
      setIsDialogOpen(false);
      toast({
        title: "Prompt Added",
        description: "Your prompt has been successfully added to the team library",
      });
    },
    onError: (error) => {
      console.error('Error adding prompt:', error);
      toast({
        title: "Error",
        description: "Failed to add prompt. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete prompt mutation
  const deletePromptMutation = useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast({
        title: "Prompt Deleted",
        description: "Prompt has been removed from the team library",
      });
    },
    onError: (error) => {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addPrompt = () => {
    if (!newPrompt.title.trim() || !newPrompt.content.trim() || !newPrompt.project_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedProject = mockProjects.find(p => p.id === newPrompt.project_id);
    const tags = newPrompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    addPromptMutation.mutate({
      title: newPrompt.title,
      content: newPrompt.content,
      project_id: newPrompt.project_id,
      project_name: selectedProject?.name || '',
      category: newPrompt.category,
      tags
    });
  };

  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard",
    });
  };

  const deletePrompt = (promptId: string) => {
    deletePromptMutation.mutate(promptId);
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = selectedProject === "all" || prompt.project_id === selectedProject;
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory;
    return matchesSearch && matchesProject && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'development': 'bg-blue-100 text-blue-800',
      'design': 'bg-purple-100 text-purple-800',
      'testing': 'bg-green-100 text-green-800',
      'documentation': 'bg-yellow-100 text-yellow-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading prompts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Prompts</h2>
          <p className="text-gray-600">Share and manage prompts across your projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="promptTitle">Prompt Title</Label>
                <Input
                  id="promptTitle"
                  placeholder="e.g., API Integration Guidelines"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="promptProject">Project</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search projects..."
                      value={projectSearchTerm}
                      onChange={(e) => setProjectSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    id="promptProject"
                    className="w-full px-3 py-2 border rounded-md max-h-40 overflow-y-auto"
                    value={newPrompt.project_id}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, project_id: e.target.value }))}
                  >
                    <option value="">Select a project</option>
                    {filteredProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} {project.description && `- ${project.description}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="promptCategory">Category</Label>
                <select
                  id="promptCategory"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, category: e.target.value as any }))}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="promptTags">Tags (comma separated)</Label>
                <Input
                  id="promptTags"
                  placeholder="e.g., api, backend, authentication"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="promptContent">Prompt Content</Label>
                <Textarea
                  id="promptContent"
                  placeholder="Enter your prompt here..."
                  className="min-h-[200px]"
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={addPrompt}
                  disabled={addPromptMutation.isPending}
                >
                  {addPromptMutation.isPending ? 'Adding...' : 'Add Prompt'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="px-4 py-2 border rounded-md"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          {mockProjects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No prompts found</p>
            <p className="text-sm text-gray-400">Add your first prompt to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {prompt.project_name}
                      </Badge>
                      <Badge className={getCategoryColor(prompt.category)}>
                        {prompt.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {prompt.content}
                    </p>
                  </div>
                  
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Created • {new Date(prompt.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPrompt(prompt.content)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePrompt(prompt.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deletePromptMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptManager;
