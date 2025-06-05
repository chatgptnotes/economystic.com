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
import { Search, Github, Users, Code, Calendar, ExternalLink, FileText, Edit, Trash2, GripVertical, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectFileManager from "./ProjectFileManager";
import ProjectEditForm from "./ProjectEditForm";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

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

const ProjectManager = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainSearchTerm, setDomainSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showInactive, setShowInactive] = useState(true);

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

  useEffect(() => {
    initializeProjects();
  }, []);

  const getRandomTeamMember = () => {
    return teamMembers[Math.floor(Math.random() * teamMembers.length)];
  };

  const detectPlatform = (name: string, description: string): 'Cursor' | 'Lovable' | 'V0' | 'Unknown' => {
    const nameAndDesc = `${name} ${description}`.toLowerCase();
    if (nameAndDesc.includes('lovable') || nameAndDesc.includes('spark')) return 'Lovable';
    if (nameAndDesc.includes('v0') || nameAndDesc.includes('untitled')) return 'V0';
    if (nameAndDesc.includes('cursor')) return 'Cursor';
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

  const initializeProjects = () => {
    const projectData = [
      { name: "DrM_Hope_Multi-tenancy-04-06-2025", description: "DrM_Hope_Multi-tenancy 04/06/2025", language: "TypeScript", visibility: "Private" as const, lastUpdated: "6 hours ago" },
      { name: "mern-machin-test", description: "mern-machin-test", language: "JavaScript", visibility: "Public" as const, lastUpdated: "yesterday" },
      { name: "adamrit.in", description: "chatgptnotes/adamrit.in", language: "TypeScript", visibility: "Private" as const, lastUpdated: "2 days ago" },
      { name: "raftaar-help", description: "", language: "Kotlin", visibility: "Public" as const, lastUpdated: "2 days ago" },
      { name: "betserlife-sos-guardian", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "3 days ago" },
      { name: "adamrit.com25-05-2025", description: "adamrit.con25/05/2025", language: "TypeScript", visibility: "Public" as const, lastUpdated: "last week" },
      { name: "adamrit.com", description: "adamrit.com", language: "TypeScript", visibility: "Private" as const, lastUpdated: "last week" },
      { name: "ambufast.in", description: "The Emergency Ambulance Service at Your Fingertips Get an ambulance within 15 minutes of your emergency call or QR scan", language: "TypeScript", visibility: "Private" as const, lastUpdated: "2 weeks ago" },
      { name: "next", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "2 weeks ago" },
      { name: "New_HMIS_Next_js_latest", description: "New_HMIS_Next_js_latest", language: "JavaScript", visibility: "Private" as const, lastUpdated: "2 weeks ago" },
      { name: "CorporateBilling21-05-2025HMIS", description: "", language: "JavaScript", visibility: "Public" as const, lastUpdated: "2 weeks ago" },
      { name: "drmhope.com-ESIC", description: "drmhope.com", language: "TypeScript", visibility: "Public" as const, lastUpdated: "2 weeks ago" },
      { name: "drmhope.com", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "2 weeks ago" },
      { name: "drmhope-multitenancy", description: "", language: "TypeScript", visibility: "Public" as const, lastUpdated: "3 weeks ago" },
      { name: "rseva.health", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "3 weeks ago" },
      { name: "New_HMIS_Next_js", description: "New_HMIS_Next_js", language: "TypeScript", visibility: "Public" as const, lastUpdated: "3 weeks ago" },
      { name: "emergencyiosapp", description: "", language: "Swift", visibility: "Public" as const, lastUpdated: "3 weeks ago" },
      { name: "v0-onescanonelife.com-13th-May", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "3 weeks ago" },
      { name: "yellowfever13-05-2025server", description: "", language: "TypeScript", visibility: "Public" as const, lastUpdated: "3 weeks ago" },
      { name: "v0-untitled-project", description: "", language: "TypeScript", visibility: "Public" as const, lastUpdated: "3 weeks ago" },
      { name: "yellowfever.in2", description: "", language: "TypeScript", visibility: "Public" as const, lastUpdated: "3 weeks ago" },
      { name: "maharashtratv24in8may2025", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "last month" },
      { name: "ayushamnhospitalwebsitenextjs", description: "ayushamnhospitalwebsitenextjs", language: "HTML", visibility: "Public" as const, lastUpdated: "last month" },
      { name: "yellowfever.in_5.4.2025_11-43-b0", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "May 5" },
      { name: "yellowfever.in_5.4.2025_11-43", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "May 5" },
      { name: "theayushmanhospital-laravel", description: "new SEO optimaize website", language: "Blade", visibility: "Public" as const, lastUpdated: "May 1" },
      { name: "emergencyapp", description: "", language: "JavaScript", visibility: "Public" as const, lastUpdated: "May 1" },
      { name: "HmisVersionUpdate30-04-2025", description: "", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 30" },
      { name: "one-scan-one-life", description: "", language: "TypeScript", visibility: "Public" as const, lastUpdated: "Apr 29" },
      { name: "demo.bachao.co-2--24-April-4.24-PM", description: "", language: "Blade", visibility: "Private" as const, lastUpdated: "Apr 24" },
      { name: "hmis_raftaarlaravel_11", description: "", language: "Blade", visibility: "Private" as const, lastUpdated: "Apr 23" },
      { name: "Rseva_laravel11_livewire3", description: "Rseva_laravel11_livewire3", language: "Blade", visibility: "Private" as const, lastUpdated: "Apr 23" },
      { name: "Rsev-for-cursor", description: "we made for cursor !", language: "Blade", visibility: "Public" as const, lastUpdated: "Apr 22" },
      { name: "lovable-raftaar-laravel-1page", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "Apr 22" },
      { name: "lovable-start-for-ayushman-3rd-attempt-site", description: "", language: "EJS", visibility: "Private" as const, lastUpdated: "Apr 22" },
      { name: "spark-the-beginning", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "Apr 21" },
      { name: "ayushman-website-3rd-attempt", description: "", language: "EJS", visibility: "Private" as const, lastUpdated: "Apr 21" },
      { name: "life-scan-harmony-project", description: "", language: "TypeScript", visibility: "Private" as const, lastUpdated: "Apr 21" },
      { name: "newHope", description: "The repo is of the hopesoftwares.com", language: "PHP", visibility: "Public" as const, lastUpdated: "Apr 21" },
      { name: "hopeproject", description: "All ondc related work of folders and file", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 21" },
      { name: "hope", description: "Hospital management software built in 2013. used in Hope and Ayushman. has Chatgpt -summary code builtin. This has a user manual in wiki", language: "PHP", visibility: "Private" as const, lastUpdated: "Apr 21" },
      { name: "RaftaarHealth", description: "RaftaarHealth", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 19" },
      { name: "hopenew", description: "hope new software", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 17" },
      { name: "hopesoftwares", description: "hospital HMIS project", language: "JavaScript", visibility: "Private" as const, lastUpdated: "Apr 17" },
      { name: "HMIS", description: "", language: "JavaScript", visibility: "Private" as const, lastUpdated: "Apr 17" },
      { name: "html-project", description: "A modern e-commerce website", language: "HTML", visibility: "Private" as const, lastUpdated: "Apr 16" },
      { name: "Tracking", description: "driver tracking project", language: "PHP", visibility: "Public" as const, lastUpdated: "Apr 16" },
      { name: "ayushman-hospital-muralisir-website", description: "ayushman-hospital-muralisir-website", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 16" },
      { name: "ayushman-hospital", description: "Ayushman Nagpur Hospital website built with Next.js", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 15" },
      { name: "ayushman-hospital-website", description: "", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Apr 15" },
      { name: "verification-logs", description: "Forked from ONDC-Official/verification-logs ONDC Pre-production issue & discussion board", language: "HTML", visibility: "Public" as const, lastUpdated: "Mar 12" },
      { name: "emergencysevaondcapp", description: "All ondc related work of folders and file", language: "PHP", visibility: "Private" as const, lastUpdated: "Feb 27" },
      { name: "RSEVA", description: "", language: "JavaScript", visibility: "Public" as const, lastUpdated: "Feb 25" },
      { name: "adminemergencyseva", description: "The repo is of the admin.emergencyseva.in", language: "JavaScript", visibility: "Private" as const, lastUpdated: "Jan 15" },
      { name: "ondc_demo", description: "", language: "JavaScript", visibility: "Private" as const, lastUpdated: "Nov 18, 2024" },
      { name: "bachaobachaoin", description: "", language: "Blade", visibility: "Private" as const, lastUpdated: "Nov 7, 2024" },
      { name: "public_html", description: "", language: "HTML", visibility: "Public" as const, lastUpdated: "Oct 8, 2024" },
      { name: "DrM-Hope", description: "", language: "JavaScript", visibility: "Private" as const, lastUpdated: "Sep 27, 2024" },
      { name: "demo2Hopesoftwares", description: "", language: "JavaScript", visibility: "Private" as const, lastUpdated: "Sep 27, 2024" },
      { name: "vehicletracker", description: "Vehicle Tracking Code uploaded by Pratik", language: "PHP", visibility: "Private" as const, lastUpdated: "Jul 10, 2024" }
    ];

    const transformedProjects = projectData.map((project, index) => ({
      id: (index + 1).toString(),
      ...project,
      assignedTo: getRandomTeamMember(),
      platform: detectPlatform(project.name, project.description),
      domainAssociated: findAssociatedDomain(project.name),
      githubUrl: `https://github.com/yourusername/${project.name}`,
      isActive: Math.random() > 0.2 // 80% of projects are active by default
    }));

    setProjects(transformedProjects);
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Success",
      description: `Project "${projectName}" has been deleted`,
    });
  };

  const handleProjectStatusToggle = (projectId: string, isActive: boolean) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isActive }
        : project
    ));

    const projectName = projects.find(p => p.id === projectId)?.name;
    toast({
      title: isActive ? "Project Activated" : "Project Deactivated",
      description: `"${projectName}" has been marked as ${isActive ? 'active' : 'inactive'}`,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    console.log('Drag result:', { destination, source, draggableId });

    if (!destination) {
      console.log('No destination, cancelling drag');
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log('Same position, no change needed');
      return;
    }

    const newAssignedTo = destination.droppableId;
    const projectId = draggableId;

    console.log('Updating project assignment:', { projectId, newAssignedTo });

    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? { ...project, assignedTo: newAssignedTo }
          : project
      );
      console.log('Updated projects:', updated);
      return updated;
    });

    const projectName = projects.find(p => p.id === projectId)?.name;
    toast({
      title: "Project Reassigned",
      description: `"${projectName}" has been assigned to ${newAssignedTo}`,
    });
  };

  const handleAssignmentChange = (projectId: string, newAssignee: string) => {
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? { ...project, assignedTo: newAssignee }
          : project
      );
      return updated;
    });

    const projectName = projects.find(p => p.id === projectId)?.name;
    const message = newAssignee === "Unassigned" 
      ? `"${projectName}" is now unassigned`
      : `"${projectName}" has been assigned to ${newAssignee}`;
    
    toast({
      title: "Project Reassigned",
      description: message,
    });
  };

  const handleDomainMappingChange = (domain: string, newProjectId: string) => {
    setProjects(prev => {
      const updated = prev.map(project => {
        // Remove the domain from any project that currently has it
        if (project.domainAssociated === domain) {
          return { ...project, domainAssociated: undefined };
        }
        // Assign the domain to the selected project
        if (project.id === newProjectId) {
          return { ...project, domainAssociated: domain };
        }
        return project;
      });
      return updated;
    });

    const projectName = projects.find(p => p.id === newProjectId)?.name;
    const message = newProjectId === "none" 
      ? `Domain "${domain}" is now unmapped`
      : `Domain "${domain}" has been mapped to "${projectName}"`;
    
    toast({
      title: "Domain Mapping Updated",
      description: message,
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMember = selectedMember === "all" || project.assignedTo === selectedMember;
    const matchesStatus = showInactive || project.isActive;
    return matchesSearch && matchesMember && matchesStatus;
  });

  // Filter domains based on search term
  const filteredDomains = availableDomains.filter(domain =>
    domain.toLowerCase().includes(domainSearchTerm.toLowerCase())
  );

  const getTeamMemberColor = (member: string) => {
    if (member === "Unassigned") {
      return "bg-gray-100 text-gray-600";
    }
    const colors = {
      "Bhupendra": "bg-blue-100 text-blue-800",
      "Dinesh": "bg-green-100 text-green-800",
      "Prathik": "bg-purple-100 text-purple-800",
      "Pooja": "bg-pink-100 text-pink-800",
      "Poonam": "bg-yellow-100 text-yellow-800",
      "Monish": "bg-orange-100 text-orange-800",
      "Aman": "bg-indigo-100 text-indigo-800",
      "Priyanka": "bg-rose-100 text-rose-800"
    };
    return colors[member as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      "Lovable": "bg-purple-100 text-purple-800",
      "Cursor": "bg-blue-100 text-blue-800",
      "V0": "bg-green-100 text-green-800",
      "Unknown": "bg-gray-100 text-gray-800"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const projectsByMember = teamMembers.reduce((acc, member) => {
    acc[member] = projects.filter(p => p.assignedTo === member && p.isActive).length;
    return acc;
  }, {} as Record<string, number>);

  const projectsByPlatform = projects.reduce((acc, project) => {
    if (project.isActive) {
      acc[project.platform] = (acc[project.platform] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const activeProjects = projects.filter(p => p.isActive);
  const unassignedProjects = projects.filter(p => p.assignedTo === "Unassigned" && p.isActive);

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-gray-600">Manage all your GitHub repositories and team assignments</p>
        </div>
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
        <select
          className="px-4 py-2 border rounded-md"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="all">All Team Members</option>
          {teamMembers.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
          <option value="Unassigned">Unassigned</option>
        </select>
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recently Updated</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects.filter(p => p.lastUpdated.includes('hours') || p.lastUpdated.includes('yesterday')).length}</p>
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
              <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
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
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className={!project.isActive ? "opacity-60" : ""}>
                      <TableCell>
                        <Switch
                          checked={project.isActive}
                          onCheckedChange={(checked) => handleProjectStatusToggle(project.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{project.name}</h3>
                            <Badge variant={project.visibility === 'Private' ? 'secondary' : 'default'}>
                              {project.visibility}
                            </Badge>
                            {!project.isActive && (
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
                        <Badge variant="outline">{project.language}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={project.assignedTo}
                          onValueChange={(value) => handleAssignmentChange(project.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={getTeamMemberColor(project.assignedTo)}>
                                {project.assignedTo === "Unassigned" ? (
                                  <div className="flex items-center">
                                    <UserX className="h-3 w-3 mr-1" />
                                    Unassigned
                                  </div>
                                ) : (
                                  project.assignedTo
                                )}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unassigned">
                              <div className="flex items-center">
                                <UserX className="h-3 w-3 mr-2" />
                                <Badge className={getTeamMemberColor("Unassigned")}>
                                  Unassigned
                                </Badge>
                              </div>
                            </SelectItem>
                            {teamMembers.map(member => (
                              <SelectItem key={member} value={member}>
                                <Badge className={getTeamMemberColor(member)}>
                                  {member}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlatformColor(project.platform)}>
                          {project.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.domainAssociated ? (
                          <Badge variant="outline">{project.domainAssociated}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {project.lastUpdated}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
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
                const memberProjects = projects.filter(p => p.assignedTo === member);
                
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
                                    </div>
                                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
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
            {Object.entries(projectsByPlatform).map(([platform, count]) => (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{platform}</span>
                    <Badge className={getPlatformColor(platform)}>
                      {count} projects
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {projects
                      .filter(p => p.platform === platform)
                      .slice(0, 3)
                      .map((project) => (
                        <div key={project.id} className="text-sm">
                          <span className="truncate">{project.name}</span>
                        </div>
                      ))}
                    {count > 3 && (
                      <p className="text-xs text-gray-500">+{count - 3} more</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  const mappedProject = projects.find(p => p.domainAssociated === domain);
                  
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
                              .filter(p => p.isActive)
                              .map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  <div className="flex items-center space-x-2">
                                    <span>{project.name}</span>
                                    <Badge className={getTeamMemberColor(project.assignedTo)} variant="outline">
                                      {project.assignedTo}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {mappedProject && (
                          <div className="flex items-center space-x-2">
                            <Badge className={getTeamMemberColor(mappedProject.assignedTo)}>
                              {mappedProject.assignedTo}
                            </Badge>
                            <Badge className={getPlatformColor(mappedProject.platform)}>
                              {mappedProject.platform}
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
