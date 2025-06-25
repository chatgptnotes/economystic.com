
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Copy, Edit, Trash2, FileText, Check, ChevronDown } from "lucide-react";
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
  last_updated: string;
  assigned_to: string;
  platform: 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown';
  domain_associated?: string;
  github_url: string;
  is_active: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const PromptManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [editProjectDropdownOpen, setEditProjectDropdownOpen] = useState(false);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [editProjectSearchTerm, setEditProjectSearchTerm] = useState("");
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.project-dropdown')) {
        setProjectDropdownOpen(false);
        setEditProjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['development', 'design', 'testing', 'documentation', 'general'];

  // Fetch projects from Supabase
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    }
  });

  // Filter projects based on search term
  const filteredProjects = (projects || []).filter(project => {
    const searchTerm = (projectSearchTerm || '').toLowerCase();
    return project.name?.toLowerCase().includes(searchTerm) ||
           project.description?.toLowerCase().includes(searchTerm);
  });

  const filteredEditProjects = (projects || []).filter(project => {
    const searchTerm = (editProjectSearchTerm || '').toLowerCase();
    return project.name?.toLowerCase().includes(searchTerm) ||
           project.description?.toLowerCase().includes(searchTerm);
  });



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
      setProjectSearchTerm('');
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

  // Edit prompt mutation
  const editPromptMutation = useMutation({
    mutationFn: async (promptData: {
      id: string;
      title: string;
      content: string;
      project_id: string;
      project_name: string;
      category: string;
      tags: string[];
    }) => {
      const { data, error } = await supabase
        .from('prompts')
        .update({
          title: promptData.title,
          content: promptData.content,
          project_id: promptData.project_id,
          project_name: promptData.project_name,
          category: promptData.category,
          tags: promptData.tags
        })
        .eq('id', promptData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      setEditingPrompt(null);
      setEditProjectSearchTerm('');
      setIsEditDialogOpen(false);
      toast({
        title: "Prompt Updated",
        description: "Your prompt has been successfully updated",
      });
    },
    onError: (error) => {
      console.error('Error updating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
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

    const selectedProject = (projects || []).find(p => p.id === newPrompt.project_id);
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

  const openEditDialog = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    const selectedProject = projects?.find(p => p.id === prompt.project_id);
    setEditProjectSearchTerm(selectedProject?.name || '');
    setIsEditDialogOpen(true);
  };

  const updatePrompt = () => {
    if (!editingPrompt || !editingPrompt.title.trim() || !editingPrompt.content.trim() || !editingPrompt.project_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedProject = (projects || []).find(p => p.id === editingPrompt.project_id);
    const tags = typeof editingPrompt.tags === 'string'
      ? editingPrompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : editingPrompt.tags;

    editPromptMutation.mutate({
      id: editingPrompt.id,
      title: editingPrompt.title,
      content: editingPrompt.content,
      project_id: editingPrompt.project_id,
      project_name: selectedProject?.name || '',
      category: editingPrompt.category,
      tags
    });
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
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Team Prompts</h2>
          <p className="text-gray-600 mt-1">Share and manage prompts across your projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
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
                <div className="relative project-dropdown">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search and select project..."
                      value={projectSearchTerm}
                      onChange={(e) => {
                        setProjectSearchTerm(e.target.value);
                        setProjectDropdownOpen(true);
                      }}
                      onFocus={() => setProjectDropdownOpen(true)}
                      className="pl-10"
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                      onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                    />
                  </div>

                  {projectDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredProjects.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          {projectsLoading ? "Loading projects..." : "No projects found"}
                        </div>
                      ) : (
                        filteredProjects.map(project => (
                          <div
                            key={project.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => {
                              setNewPrompt(prev => ({ ...prev, project_id: project.id }));
                              setProjectSearchTerm(project.name);
                              setProjectDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                newPrompt.project_id === project.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div>
                              <div className="font-medium">{project.name}</div>
                              {project.description && (
                                <div className="text-sm text-gray-500">{project.description}</div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
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
                <Button variant="outline" onClick={() => {
                  setProjectSearchTerm('');
                  setIsDialogOpen(false);
                }}>
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

        {/* Edit Prompt Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Prompt</DialogTitle>
            </DialogHeader>
            {editingPrompt && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editPromptTitle">Prompt Title</Label>
                  <Input
                    id="editPromptTitle"
                    placeholder="e.g., API Integration Guidelines"
                    value={editingPrompt.title}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="editPromptProject">Project</Label>
                  <div className="relative project-dropdown">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search and select project..."
                        value={editProjectSearchTerm}
                        onChange={(e) => {
                          setEditProjectSearchTerm(e.target.value);
                          setEditProjectDropdownOpen(true);
                        }}
                        onFocus={() => setEditProjectDropdownOpen(true)}
                        className="pl-10"
                      />
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                        onClick={() => setEditProjectDropdownOpen(!editProjectDropdownOpen)}
                      />
                    </div>

                    {editProjectDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredEditProjects.length === 0 ? (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            {projectsLoading ? "Loading projects..." : "No projects found"}
                          </div>
                        ) : (
                          filteredEditProjects.map(project => (
                            <div
                              key={project.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => {
                                setEditingPrompt(prev => prev ? { ...prev, project_id: project.id } : null);
                                setEditProjectSearchTerm(project.name);
                                setEditProjectDropdownOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  editingPrompt.project_id === project.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div>
                                <div className="font-medium">{project.name}</div>
                                {project.description && (
                                  <div className="text-sm text-gray-500">{project.description}</div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="editPromptCategory">Category</Label>
                  <select
                    id="editPromptCategory"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editingPrompt.category}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="editPromptTags">Tags (comma-separated)</Label>
                  <Input
                    id="editPromptTags"
                    placeholder="e.g., api, integration, backend"
                    value={Array.isArray(editingPrompt.tags) ? editingPrompt.tags.join(', ') : editingPrompt.tags}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, tags: e.target.value } : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="editPromptContent">Prompt Content</Label>
                  <Textarea
                    id="editPromptContent"
                    placeholder="Enter your prompt content here..."
                    className="min-h-[200px]"
                    value={editingPrompt.content}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, content: e.target.value } : null)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setEditProjectSearchTerm('');
                    setIsEditDialogOpen(false);
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={updatePrompt}
                    disabled={editPromptMutation.isPending}
                  >
                    {editPromptMutation.isPending ? 'Updating...' : 'Update Prompt'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all"
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-300 transition-all min-w-[160px]"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            disabled={projectsLoading}
          >
            <option value="all">{projectsLoading ? "Loading..." : "All Projects"}</option>
            {(projects || []).map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-300 transition-all min-w-[160px]"
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
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
          <CardContent className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Get started by adding your first prompt to share with your team</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Prompt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="h-full group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {prompt.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                        {prompt.project_name}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(prompt.category)}`}>
                        {prompt.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
                      {prompt.content}
                    </p>
                  </div>

                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {prompt.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    Created {new Date(prompt.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPrompt(prompt.content)}
                        className="bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(prompt)}
                        className="bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePrompt(prompt.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
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
