
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Copy, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prompt {
  id: string;
  title: string;
  content: string;
  projectId: string;
  projectName: string;
  category: 'development' | 'design' | 'testing' | 'documentation' | 'general';
  createdBy: string;
  createdAt: string;
  tags: string[];
}

const PromptManager = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    content: '',
    projectId: '',
    projectName: '',
    category: 'general' as const,
    tags: ''
  });
  const { toast } = useToast();

  // Mock project data - this would come from your ProjectManager in a real implementation
  const projects = [
    { id: "1", name: "DrM_Hope_Multi-tenancy-04-06-2025" },
    { id: "2", name: "adamrit.in" },
    { id: "3", name: "ambufast.in" },
    { id: "4", name: "drmhope.com" },
    { id: "5", name: "yellowfever.in" }
  ];

  const categories = ['development', 'design', 'testing', 'documentation', 'general'];
  const teamMembers = ["Bhupendra", "Dinesh", "Prathik", "Pooja", "Poonam", "Monish"];

  const addPrompt = () => {
    if (!newPrompt.title.trim() || !newPrompt.content.trim() || !newPrompt.projectId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedProject = projects.find(p => p.id === newPrompt.projectId);
    const tags = newPrompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const prompt: Prompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      content: newPrompt.content,
      projectId: newPrompt.projectId,
      projectName: selectedProject?.name || '',
      category: newPrompt.category,
      createdBy: teamMembers[Math.floor(Math.random() * teamMembers.length)],
      createdAt: new Date().toISOString(),
      tags
    };

    setPrompts(prev => [...prev, prompt]);
    setNewPrompt({ title: '', content: '', projectId: '', projectName: '', category: 'general', tags: '' });
    setIsDialogOpen(false);

    toast({
      title: "Prompt Added",
      description: `"${prompt.title}" has been added to ${selectedProject?.name}`,
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
    setPrompts(prev => prev.filter(p => p.id !== promptId));
    toast({
      title: "Prompt Deleted",
      description: "Prompt has been removed",
    });
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = selectedProject === "all" || prompt.projectId === selectedProject;
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
                <select
                  id="promptProject"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newPrompt.projectId}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, projectId: e.target.value }))}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
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
                <Button onClick={addPrompt}>
                  Add Prompt
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
          {projects.map(project => (
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
                        {prompt.projectName}
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
                    Created by {prompt.createdBy} • {new Date(prompt.createdAt).toLocaleDateString()}
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
