import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Users, Globe, AlertCircle, Circle, Minus, Filter, SortAsc } from "lucide-react";
import { toast } from "sonner";

type ProjectPriority = 'high' | 'medium' | 'low';
type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';

interface Project {
  id: string;
  name: string;
  description: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  team: string[];
  platforms: string[];
  progress: number;
  created: Date;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Healthcare Analytics Dashboard',
      description: 'Develop a comprehensive analytics dashboard for healthcare data visualization.',
      priority: 'high',
      status: 'active',
      team: ['Alice', 'Bob', 'Charlie'],
      platforms: ['Web', 'Mobile'],
      progress: 75,
      created: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Patient Engagement App',
      description: 'Create a mobile app to improve patient engagement and communication.',
      priority: 'medium',
      status: 'planning',
      team: ['David', 'Eve'],
      platforms: ['Mobile'],
      progress: 20,
      created: new Date('2023-02-01')
    },
    {
      id: '3',
      name: 'Telemedicine Platform',
      description: 'Build a telemedicine platform for remote consultations and monitoring.',
      priority: 'low',
      status: 'completed',
      team: ['Charlie', 'Frank'],
      platforms: ['Web', 'Mobile'],
      progress: 100,
      created: new Date('2022-11-20')
    },
    {
      id: '4',
      name: 'AI-Powered Diagnosis Tool',
      description: 'Develop an AI tool to assist doctors in diagnosing diseases more accurately.',
      priority: 'high',
      status: 'on-hold',
      team: ['Alice', 'Grace'],
      platforms: ['Web'],
      progress: 50,
      created: new Date('2022-12-01')
    },
    {
      id: '5',
      name: 'Electronic Health Records System',
      description: 'Implement an electronic health records system for efficient data management.',
      priority: 'medium',
      status: 'active',
      team: ['Bob', 'Frank'],
      platforms: ['Web'],
      progress: 60,
      created: new Date('2023-02-15')
    },
    {
      id: '6',
      name: 'Remote Patient Monitoring System',
      description: 'Create a system for remotely monitoring patients vital signs and health data.',
      priority: 'low',
      status: 'planning',
      team: ['David', 'Grace'],
      platforms: ['Mobile'],
      progress: 10,
      created: new Date('2023-03-01')
    },
    {
      id: '7',
      name: 'Predictive Analytics for Hospital Readmissions',
      description: 'Use predictive analytics to identify patients at high risk of hospital readmission.',
      priority: 'high',
      status: 'completed',
      team: ['Charlie', 'Eve'],
      platforms: ['Web'],
      progress: 100,
      created: new Date('2023-01-01')
    },
    {
      id: '8',
      name: 'Smart Pharmacy Management System',
      description: 'Develop a smart pharmacy management system for inventory and prescription tracking.',
      priority: 'medium',
      status: 'on-hold',
      team: ['Alice', 'Frank'],
      platforms: ['Web'],
      progress: 40,
      created: new Date('2022-12-15')
    },
    {
      id: '9',
      name: 'Mental Health Support Chatbot',
      description: 'Create a chatbot to provide mental health support and resources to patients.',
      priority: 'low',
      status: 'active',
      team: ['Bob', 'Grace'],
      platforms: ['Mobile'],
      progress: 70,
      created: new Date('2023-03-15')
    },
    {
      id: '10',
      name: 'Clinical Trial Management System',
      description: 'Build a system to manage clinical trials and track patient outcomes.',
      priority: 'high',
      status: 'planning',
      team: ['David', 'Charlie'],
      platforms: ['Web'],
      progress: 5,
      created: new Date('2023-04-01')
    }
  ]);

  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'created'>>({
    name: '',
    description: '',
    priority: 'medium',
    status: 'planning',
    team: [],
    platforms: [],
    progress: 0
  });

  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'status' | 'created'>('priority');

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return a.created.getTime() - b.created.getTime();
    });

    return filtered;
  }, [projects, priorityFilter, statusFilter, sortBy]);

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) {
      toast.error('Please fill in all fields.');
      return;
    }

    const newId = Math.random().toString(36).substring(7);
    const createdDate = new Date();

    const newProjectWithId: Project = {
      id: newId,
      name: newProject.name,
      description: newProject.description,
      priority: newProject.priority,
      status: newProject.status,
      team: [],
      platforms: [],
      progress: 0,
      created: createdDate
    };

    setProjects([...projects, newProjectWithId]);
    setNewProject({
      name: '',
      description: '',
      priority: 'medium',
      status: 'planning',
      team: [],
      platforms: [],
      progress: 0
    });

    toast.success('Project added successfully!');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast.success('Project deleted successfully!');
  };

  const getPriorityBadge = (priority: Project['priority']) => {
    const config = {
      high: { 
        color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
        icon: AlertCircle,
        label: 'High'
      },
      medium: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
        icon: Circle,
        label: 'Medium'
      },
      low: { 
        color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
        icon: Minus,
        label: 'Low'
      }
    };
    
    const { color, icon: Icon, label } = config[priority];
    
    return (
      <Badge variant="outline" className={`${color} flex items-center gap-1 px-2 py-1 font-medium border`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{projects.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {projects.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {new Set(projects.flatMap(p => p.team)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {projects.filter(p => p.priority === 'high').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Management Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-blue-600" />
              Project Management
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Create a new project with team assignments and priorities.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select value={newProject.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewProject({...newProject, priority: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select value={newProject.status} onValueChange={(value: 'planning' | 'active' | 'completed' | 'on-hold') => setNewProject({...newProject, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddProject}>Add Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="list">Project List</TabsTrigger>
              <TabsTrigger value="team">Team View</TabsTrigger>
              <TabsTrigger value="platforms">Platform View</TabsTrigger>
              <TabsTrigger value="domains">Domain Mapping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              {/* Filters and Sorting */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-medium">Priority:</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Status:</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-medium">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                        <TableCell>
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.team.map((member, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{project.progress}%</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{project.name}</CardTitle>
                        {getPriorityBadge(project.priority)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Team: {project.team.join(', ')}</span>
                        </div>
                        <div className="text-sm text-gray-600">{project.description}</div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="platforms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{project.name}</CardTitle>
                        {getPriorityBadge(project.priority)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">{project.description}</div>
                        <div className="flex flex-wrap gap-2">
                          {project.platforms.map((platform, index) => (
                            <Badge key={index} variant="outline">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="domains" className="mt-6">
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{project.name}</CardTitle>
                        {getPriorityBadge(project.priority)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Platforms</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.platforms.map((platform, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Domains</Label>
                          <div className="flex items-center mt-1">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">Configure domain mapping</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManager;
