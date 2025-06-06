import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Github, Users, Code, Calendar, ExternalLink, FileText, Edit, Trash2, GripVertical, UserX, AlertCircle, Circle, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProjectFileManager from "./ProjectFileManager";
import ProjectEditForm from "./ProjectEditForm";
import AddProjectForm from "./AddProjectForm";
import { DragDropContext as DragDropContextRaw, Droppable as DroppableRaw, Draggable as DraggableRaw, DropResult } from "react-beautiful-dnd";
import type { DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";

// Workaround for react-beautiful-dnd TypeScript issues
const DragDropContext = DragDropContextRaw as any;
const Droppable = DroppableRaw as any;
const Draggable = DraggableRaw as any;

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

const ProjectManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [domainSearchTerm, setDomainSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showInactive, setShowInactive] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const teamMembers = ["Bhupendra", "Dinesh", "Prathik", "Pooja", "Poonam", "Monish", "Aman", "Priyanka"];

  // All available domains for mapping
  const availableDomains = [
    'anohra.com', 'hopesoftwares.com', 'gmcnagpuralumni.com', 'drmhope.com',
    'modernmedicalentrepreneur.com', 'anohra.ai', 'drmurali.ai', 'yellowfevervaccines.com',
    'economystic.ai', 'adamrit.ai', 'digihealthtwin.com', 'digihealthtwin.ai',
    'rescueseva.com', 'onescanonelife.com', 'emergencyseva.ai', 'bachao.co',
    'bachao.xyz', 'bachao.store', 'bachao.net', 'bachao.info', 'bachaomujhebachao.com',
    'ayushmannagpurhospital.com', 'rseva.health', 'maharashtratv24.in', 'rescueseva.in',
    'onescanonelife.in', 'instaaid.in', 'bachaobachao.in', 'mujhebachao.in',
    'theayushmanhospital.com', 'hopefoundationtrust.in', 'hopehospital.in',
    'anohra.in', 'adamrit.com', 'yellowfever.in', 'digihealthtwin.in',
    'emergencyseva.in', 'ambufast.in'
  ];

  // Fetch projects from Supabase
  const { data: projectsData = [], isLoading } = useQuery({
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

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'last_updated'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowAddDialog(false);
      toast({
        title: "Project Added",
        description: "Project has been added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (project: Project) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...project,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingProject(null);
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    setProjects(projectsData);
  }, [projectsData]);

  const getRandomTeamMember = () => {
    return teamMembers[Math.floor(Math.random() * teamMembers.length)];
  };

  const getRandomPriority = (): 'High' | 'Medium' | 'Low' => {
    const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  const detectPlatform = (name: string, description: string): 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown' => {
    const nameAndDesc = `${name} ${description}`.toLowerCase();
    if (nameAndDesc.includes('lovable') || nameAndDesc.includes('spark')) return 'Lovable';
    if (nameAndDesc.includes('v0') || nameAndDesc.includes('untitled')) return 'V0';
    if (nameAndDesc.includes('cursor')) return 'Cursor';
    if (nameAndDesc.includes('stitch')) return 'Stitch';
    if (nameAndDesc.includes('windsurf')) return 'Windsurf';
    if (nameAndDesc.includes('clerk')) return 'Clerk';
    if (nameAndDesc.includes('codex')) return 'Codex';
    if (nameAndDesc.includes('vercel')) return 'Vercel';
    return 'Unknown';
  };

  const findAssociatedDomain = (projectName: string): string | undefined => {
    const domains = [
      'anohra.com', 'hopesoftwares.com', 'gmcnagpuralumni.com', 'drmhope.com',
      'modernmedicalentrepreneur.com', 'anohra.ai', 'drmurali.ai', 'yellowfevervaccines.com',
      'economystic.ai', 'adamrit.ai', 'digihealthtwin.com', 'digihealthtwin.ai',
      'rescueseva.com', 'onescanonelife.com', 'emergencyseva.ai', 'bachao.co',
      'bachao.xyz', 'bachao.store', 'bachao.net', 'bachao.info', 'bachaomujhebachao.com',
      'ayushmannagpurhospital.com', 'rseva.health', 'maharashtratv24.in', 'rescueseva.in',
      'onescanonelife.in', 'instaaid.in', 'bachaobachao.in', 'mujhebachao.in',
      'theayushmanhospital.com', 'hopefoundationtrust.in', 'hopehospital.in',
      'anohra.in', 'adamrit.com', 'yellowfever.in', 'digihealthtwin.in',
      'emergencyseva.in', 'ambufast.in'
    ];

    return domains.find(domain => 
      projectName.toLowerCase().includes(domain.replace(/\.(com|ai|in|co|xyz|store|net|info|health)$/, '')) ||
      projectName.toLowerCase().includes(domain.toLowerCase())
    );
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  const handleProjectStatusToggle = (projectId: string, isActive: boolean) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProjectMutation.mutate({ ...project, is_active: isActive });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newAssignedTo = destination.droppableId;
    const projectId = draggableId;
    const project = projects.find(p => p.id === projectId);

    if (project) {
      updateProjectMutation.mutate({ ...project, assigned_to: newAssignedTo });
    }
  };

  const handleAssignmentChange = (projectId: string, newAssignee: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProjectMutation.mutate({ ...project, assigned_to: newAssignee });
    }
  };

  const handleDomainMappingChange = (domain: string, newProjectId: string) => {
    // Remove domain from any project that currently has it
    const projectWithDomain = projects.find(p => p.domain_associated === domain);
    if (projectWithDomain) {
      updateProjectMutation.mutate({ ...projectWithDomain, domain_associated: undefined });
    }

    // Assign domain to new project
    if (newProjectId !== "none") {
      const project = projects.find(p => p.id === newProjectId);
      if (project) {
        updateProjectMutation.mutate({ ...project, domain_associated: domain });
      }
    }
  };

  const handlePriorityChange = (projectId: string, newPriority: 'High' | 'Medium' | 'Low') => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProjectMutation.mutate({ ...project, priority: newPriority });
    }
  };

  const handlePlatformChange = (projectId: string, newPlatform: 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown') => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProjectMutation.mutate({ ...project, platform: newPlatform });
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    updateProjectMutation.mutate(updatedProject);
  };

  const handleAddNewProject = (projectData: Omit<Project, 'id' | 'last_updated'>) => {
    addProjectMutation.mutate(projectData);
  };

  const filteredProjects = projects.filter(project => {
    const combinedSearchTerm = searchTerm || projectSearchTerm;
    
    const matchesSearch = combinedSearchTerm === "" || 
                         project.name.toLowerCase().includes(combinedSearchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(combinedSearchTerm.toLowerCase());
    
    const matchesMember = selectedMember === "all" || project.assigned_to === selectedMember;
    const matchesPriority = selectedPriority === "all" || project.priority === selectedPriority;
    const matchesStatus = showInactive || project.is_active;
    
    return matchesSearch && matchesMember && matchesPriority && matchesStatus;
  });

  // Sort projects by priority (High -> Medium -> Low)
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Filter domains based on search term
  const filteredDomains = availableDomains.filter(domain =>
    domain.toLowerCase().includes(domainSearchTerm.toLowerCase())
  );

  const getTeamMemberColor = (member: string) => {
    if (member === "Unassigned") {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
    const colors = {
      "Bhupendra": "bg-blue-100 text-blue-800 border-blue-200",
      "Dinesh": "bg-green-100 text-green-800 border-green-200",
      "Prathik": "bg-purple-100 text-purple-800 border-purple-200",
      "Pooja": "bg-pink-100 text-pink-800 border-pink-200",
      "Poonam": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Monish": "bg-orange-100 text-orange-800 border-orange-200",
      "Aman": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Priyanka": "bg-rose-100 text-rose-800 border-rose-200"
    };
    return colors[member as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      "Lovable": "bg-purple-100 text-purple-800 border-purple-200",
      "Cursor": "bg-blue-100 text-blue-800 border-blue-200",
      "V0": "bg-green-100 text-green-800 border-green-200",
      "Stitch": "bg-orange-100 text-orange-800 border-orange-200",
      "Windsurf": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Clerk": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Codex": "bg-pink-100 text-pink-800 border-pink-200",
      "Vercel": "bg-slate-100 text-slate-800 border-slate-200",
      "Unknown": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-50 text-red-700 border-red-200',
      'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Low': 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.Low;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="h-3 w-3" />;
      case 'Medium':
        return <Circle className="h-3 w-3" />;
      case 'Low':
        return <Minus className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const projectsByMember = teamMembers.reduce((acc, member) => {
    acc[member] = projects.filter(p => p.assigned_to === member && p.is_active).length;
    return acc;
  }, {} as Record<string, number>);

  const projectsByPlatform = projects.reduce((acc, project) => {
    if (project.is_active) {
      acc[project.platform] = (acc[project.platform] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const activeProjects = projects.filter(p => p.is_active);
  const unassignedProjects = projects.filter(p => p.assigned_to === "Unassigned" && p.is_active);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-gray-600">Manage all your GitHub repositories and team assignments</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <AddProjectForm
              teamMembers={teamMembers}
              onSave={handleAddNewProject}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Team Members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Members</SelectItem>
            {teamMembers.map(member => (
              <SelectItem key={member} value={member}>{member}</SelectItem>
            ))}
            <SelectItem value="Unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High Priority</SelectItem>
            <SelectItem value="Medium">Medium Priority</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-inactive"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <label htmlFor="show-inactive" className="text-sm text-gray-600">
            Show inactive projects
          </label>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Github className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects.filter(p => p.priority === 'High').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">{unassignedProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Languages</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(activeProjects.map(p => p.language)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="team">Team Overview</TabsTrigger>
          <TabsTrigger value="platforms">By Platform</TabsTrigger>
          <TabsTrigger value="domains">Domain Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Projects ({sortedProjects.length})</span>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search in projects list..."
                    value={projectSearchTerm}
                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => (
                    <TableRow key={project.id} className={!project.is_active ? "opacity-60" : ""}>
                      <TableCell>
                        <Switch
                          checked={project.is_active}
                          onCheckedChange={(checked) => handleProjectStatusToggle(project.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={project.priority}
                          onValueChange={(value: 'High' | 'Medium' | 'Low') => handlePriorityChange(project.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={`${getPriorityColor(project.priority)} border`} variant="outline">
                                <div className="flex items-center space-x-1">
                                  {getPriorityIcon(project.priority)}
                                  <span>{project.priority}</span>
                                </div>
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">
                              <div className="flex items-center space-x-1">
                                <AlertCircle className="h-3 w-3 text-red-600" />
                                <span>High</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medium">
                              <div className="flex items-center space-x-1">
                                <Circle className="h-3 w-3 text-yellow-600" />
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Low">
                              <div className="flex items-center space-x-1">
                                <Minus className="h-3 w-3 text-green-600" />
                                <span>Low</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{project.name}</h3>
                            <Badge variant={project.visibility === 'Private' ? 'secondary' : 'default'}>
                              {project.visibility}
                            </Badge>
                            {!project.is_active && (
                              <Badge variant="outline" className="text-gray-500">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border">{project.language}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={project.assigned_to}
                          onValueChange={(value) => handleAssignmentChange(project.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={`${getTeamMemberColor(project.assigned_to)} border`} variant="outline">
                                {project.assigned_to === "Unassigned" ? (
                                  <div className="flex items-center">
                                    <UserX className="h-3 w-3 mr-1" />
                                    Unassigned
                                  </div>
                                ) : (
                                  project.assigned_to
                                )}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unassigned">
                              <div className="flex items-center">
                                <UserX className="h-3 w-3 mr-2" />
                                <span>Unassigned</span>
                              </div>
                            </SelectItem>
                            {teamMembers.map(member => (
                              <SelectItem key={member} value={member}>
                                {member}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={project.platform}
                          onValueChange={(value: 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown') => handlePlatformChange(project.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={`${getPlatformColor(project.platform)} border`} variant="outline">
                                {project.platform}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lovable">Lovable</SelectItem>
                            <SelectItem value="Cursor">Cursor</SelectItem>
                            <SelectItem value="V0">V0</SelectItem>
                            <SelectItem value="Stitch">Stitch</SelectItem>
                            <SelectItem value="Windsurf">Windsurf</SelectItem>
                            <SelectItem value="Clerk">Clerk</SelectItem>
                            <SelectItem value="Codex">Codex</SelectItem>
                            <SelectItem value="Vercel">Vercel</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {project.domain_associated ? (
                          <Badge variant="outline" className="border">{project.domain_associated}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {project.last_updated}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedProject(project)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Project Documents - {project.name}</DialogTitle>
                              </DialogHeader>
                              {selectedProject && (
                                <ProjectFileManager 
                                  projectId={selectedProject.id}
                                  projectName={selectedProject.name}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingProject(project)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Project - {project.name}</DialogTitle>
                              </DialogHeader>
                              {editingProject && (
                                <ProjectEditForm 
                                  project={editingProject}
                                  teamMembers={teamMembers}
                                  onSave={handleProjectUpdate}
                                  onCancel={() => setEditingProject(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the project "{project.name}"? 
                                  This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProject(project.id, project.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => {
                const memberProjects = projects.filter(p => p.assigned_to === member);
                
                return (
                  <Droppable droppableId={member} key={member} type="PROJECT">
                    {(provided, snapshot) => (
                      <Card 
                        className={`transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' : ''}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{member}</span>
                            <Badge className={getTeamMemberColor(member)}>
                              {memberProjects.length} projects
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="min-h-[200px]">
                          <div className="space-y-2">
                            {memberProjects.map((project, index) => (
                              <Draggable 
                                key={project.id} 
                                draggableId={project.id} 
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`flex items-center justify-between text-sm p-3 rounded-lg border transition-all duration-200 ${
                                      snapshot.isDragging 
                                        ? 'bg-blue-100 border-blue-300 shadow-lg rotate-2' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-grab'
                                    }`}
                                  >
                                    <div className="flex items-center flex-1 min-w-0">
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="mr-2 cursor-grab active:cursor-grabbing hover:text-blue-500"
                                      >
                                        <GripVertical className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <span className="truncate flex-1 font-medium">{project.name}</span>
                                      <Badge className={`ml-2 ${getPriorityColor(project.priority)} border text-xs`} variant="outline">
                                        <div className="flex items-center space-x-1">
                                          {getPriorityIcon(project.priority)}
                                          <span>{project.priority}</span>
                                        </div>
                                      </Badge>
                                    </div>
                                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0 border">
                                      {project.language}
                                    </Badge>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Lovable', 'Cursor', 'V0', 'Stitch', 'Windsurf', 'Clerk', 'Codex', 'Vercel', 'Unknown'].map((platform) => {
              const count = projectsByPlatform[platform] || 0;
              if (count === 0) return null;
              
              return (
                <Card key={platform}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{platform}</span>
                      <Badge className={`${getPlatformColor(platform)} border`} variant="outline">
                        {count} projects
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {projects
                        .filter(p => p.platform === platform && p.is_active)
                        .slice(0, 3)
                        .map((project) => (
                          <div key={project.id} className="flex items-center justify-between text-sm">
                            <span className="truncate flex-1">{project.name}</span>
                            <Badge className={`ml-2 ${getPriorityColor(project.priority)} border text-xs`} variant="outline">
                              <div className="flex items-center space-x-1">
                                {getPriorityIcon(project.priority)}
                                <span>{project.priority}</span>
                              </div>
                            </Badge>
                          </div>
                        ))}
                      {count > 3 && (
                        <p className="text-xs text-gray-500">+{count - 3} more</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Domain to Project Mapping</CardTitle>
              {/* Domain Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search domains..."
                  value={domainSearchTerm}
                  onChange={(e) => setDomainSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDomains.map((domain) => {
                  const mappedProject = projects.find(p => p.domain_associated === domain);
                  
                  return (
                    <div key={domain} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{domain}</h3>
                        <p className="text-sm text-gray-600">
                          {mappedProject ? mappedProject.name : 'No project mapped'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={mappedProject?.id || "none"}
                          onValueChange={(value) => handleDomainMappingChange(domain, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <span className="text-gray-500">No mapping</span>
                            </SelectItem>
                            {projects
                              .filter(p => p.is_active)
                              .map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  <div className="flex items-center space-x-2">
                                    <span>{project.name}</span>
                                    <Badge className={`${getTeamMemberColor(project.assigned_to)} border`} variant="outline">
                                      {project.assigned_to}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {mappedProject && (
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getTeamMemberColor(mappedProject.assigned_to)} border`} variant="outline">
                              {mappedProject.assigned_to}
                            </Badge>
                            <Badge className={`${getPlatformColor(mappedProject.platform)} border`} variant="outline">
                              {mappedProject.platform}
                            </Badge>
                            <Badge className={`${getPriorityColor(mappedProject.priority)} border`} variant="outline">
                              <div className="flex items-center space-x-1">
                                {getPriorityIcon(mappedProject.priority)}
                                <span>{mappedProject.priority}</span>
                              </div>
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredDomains.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No domains found matching your search.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManager;
