import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Globe, 
  GitBranch, 
  Calendar,
  AlertCircle,
  Circle,
  Minus,
  Edit,
  Trash2,
  ExternalLink,
  FolderGit2
} from "lucide-react";

type ProjectStatus = "planning" | "development" | "testing" | "deployed" | "maintenance";
type ProjectPriority = "low" | "medium" | "high";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  githubUrl?: string;
  liveUrl?: string;
  team: TeamMember[];
  platforms: string[];
  domains: string[];
  created: string;
  lastUpdated: string;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "created" | "priority" | "status">("created");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    team: [],
    platforms: [],
    domains: []
  });

  useEffect(() => {
    // Sample data
    setProjects([
      {
        id: "1",
        name: "Healthcare Dashboard",
        description: "Main analytics dashboard for patient management",
        status: "deployed",
        priority: "high",
        githubUrl: "https://github.com/company/healthcare-dashboard",
        liveUrl: "https://dashboard.hospital.com",
        team: [
          { id: "1", name: "Dr. Smith", role: "Project Lead" },
          { id: "2", name: "Jane Doe", role: "Developer" }
        ],
        platforms: ["Web", "Mobile"],
        domains: ["dashboard.hospital.com", "api.hospital.com"],
        created: "2024-01-15",
        lastUpdated: "2024-03-01"
      },
      {
        id: "2",
        name: "Patient Portal",
        description: "Self-service portal for patients",
        status: "development",
        priority: "medium",
        githubUrl: "https://github.com/company/patient-portal",
        team: [
          { id: "3", name: "Bob Wilson", role: "Developer" },
          { id: "4", name: "Alice Brown", role: "Designer" }
        ],
        platforms: ["Web"],
        domains: ["patients.hospital.com"],
        created: "2024-02-01",
        lastUpdated: "2024-02-28"
      },
      {
        id: "3",
        name: "Emergency System",
        description: "Real-time emergency response coordination",
        status: "testing",
        priority: "high",
        team: [
          { id: "5", name: "Chris Lee", role: "Senior Developer" }
        ],
        platforms: ["Web", "Mobile", "Desktop"],
        domains: ["emergency.hospital.com"],
        created: "2024-01-20",
        lastUpdated: "2024-02-25"
      }
    ]);
  }, []);

  const getPriorityIcon = (priority: ProjectPriority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Circle className="h-4 w-4" />;
      case "low":
        return <Minus className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "planning":
        return "bg-gray-100 text-gray-800";
      case "development":
        return "bg-blue-100 text-blue-800";
      case "testing":
        return "bg-orange-100 text-orange-800";
      case "deployed":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-purple-100 text-purple-800";
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status as ProjectStatus,
      priority: newProject.priority as ProjectPriority,
      githubUrl: newProject.githubUrl,
      liveUrl: newProject.liveUrl,
      team: newProject.team || [],
      platforms: newProject.platforms || [],
      domains: newProject.domains || [],
      created: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, project]);
    setNewProject({
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      team: [],
      platforms: [],
      domains: []
    });
    setIsAddDialogOpen(false);
    toast.success("Project added successfully!");
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success("Project deleted successfully!");
  };

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value as ProjectPriority | "all");
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ProjectStatus | "all");
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as "created" | "name" | "priority" | "status");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
          <p className="text-muted-foreground">
            Manage your GitHub repositories, team assignments, and project tracking
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project entry to track development progress
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newProject.priority} 
                    onValueChange={(value) => setNewProject({...newProject, priority: value as ProjectPriority})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newProject.status} 
                    onValueChange={(value) => setNewProject({...newProject, status: value as ProjectStatus})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProject}>
                  Add Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="team">Team View</TabsTrigger>
          <TabsTrigger value="platforms">Platform View</TabsTrigger>
          <TabsTrigger value="domains">Domain Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Projects ({filteredAndSortedProjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center space-x-1 w-fit ${getPriorityColor(project.priority)}`}
                        >
                          {getPriorityIcon(project.priority)}
                          <span className="capitalize">{project.priority}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{project.team.length}</TableCell>
                      <TableCell>{project.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {project.githubUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <GitBranch className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center space-x-1 ${getPriorityColor(project.priority)}`}
                    >
                      {getPriorityIcon(project.priority)}
                      <span className="capitalize">{project.priority}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Team ({project.team.length})</span>
                    </div>
                    {project.team.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2 text-sm">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                        <span className="text-muted-foreground">({member.role})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center space-x-1 ${getPriorityColor(project.priority)}`}
                    >
                      {getPriorityIcon(project.priority)}
                      <span className="capitalize">{project.priority}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FolderGit2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Platforms</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.platforms.length > 0 ? (
                        project.platforms.map((platform, index) => (
                          <Badge key={index} variant="secondary">
                            {platform}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No platforms specified</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="domains">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center space-x-1 ${getPriorityColor(project.priority)}`}
                    >
                      {getPriorityIcon(project.priority)}
                      <span className="capitalize">{project.priority}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">Domains</span>
                    </div>
                    <div className="space-y-2">
                      {project.domains.length > 0 ? (
                        project.domains.map((domain, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{domain}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No domains mapped</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManager;
