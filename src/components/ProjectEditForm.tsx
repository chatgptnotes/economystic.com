import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
  category?: 'Healthcare' | 'E-commerce' | 'Education' | 'Finance' | 'Social Media' | 'Utilities' | 'Entertainment' | 'Business Tools' | 'Other';
}

interface ProjectEditFormProps {
  project: Project;
  teamMembers: string[];
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ProjectEditForm = ({ project, teamMembers, onSave, onCancel }: ProjectEditFormProps) => {
  const { toast } = useToast();
  const [domainSearchTerm, setDomainSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    language: project.language,
    visibility: project.visibility,
    assigned_to: project.assigned_to,
    platform: project.platform,
    domain_associated: project.domain_associated || '',
    github_url: project.github_url,
    is_active: project.is_active,
    priority: project.priority,
    category: project.category || 'Other'
  });

  // All available domains
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

  // Filter domains based on search term
  const filteredDomains = availableDomains.filter(domain =>
    domain.toLowerCase().includes(domainSearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProject: Project = {
      ...project,
      ...formData,
      domain_associated: formData.domain_associated || undefined
    };

    onSave(updatedProject);
    
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter project name"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter project description"
        />
      </div>

      <div>
        <Label htmlFor="language">Language</Label>
        <Input
          id="language"
          value={formData.language}
          onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
          placeholder="e.g., TypeScript, JavaScript, Python"
        />
      </div>

      <div>
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input
          id="github_url"
          value={formData.github_url}
          onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div>
        <Label htmlFor="visibility">Visibility</Label>
        <Select value={formData.visibility} onValueChange={(value: 'Public' | 'Private') => setFormData(prev => ({ ...prev, visibility: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assigned_to">Assigned To</Label>
        <Select value={formData.assigned_to} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Unassigned">Unassigned</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member} value={member}>{member}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select value={formData.platform} onValueChange={(value: typeof formData.platform) => setFormData(prev => ({ ...prev, platform: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Unknown">Unknown</SelectItem>
            <SelectItem value="Cursor">Cursor</SelectItem>
            <SelectItem value="Lovable">Lovable</SelectItem>
            <SelectItem value="V0">V0</SelectItem>
            <SelectItem value="Stitch">Stitch</SelectItem>
            <SelectItem value="Windsurf">Windsurf</SelectItem>
            <SelectItem value="Clerk">Clerk</SelectItem>
            <SelectItem value="Codex">Codex</SelectItem>
            <SelectItem value="Vercel">Vercel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value: 'Healthcare' | 'E-commerce' | 'Education' | 'Finance' | 'Social Media' | 'Utilities' | 'Entertainment' | 'Business Tools' | 'Other') => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="E-commerce">E-commerce</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Social Media">Social Media</SelectItem>
            <SelectItem value="Utilities">Utilities</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Business Tools">Business Tools</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="domain_associated">Associated Domain</Label>
        <div className="flex space-x-2">
          <Input
            id="domain_associated"
            value={formData.domain_associated}
            onChange={(e) => setFormData(prev => ({ ...prev, domain_associated: e.target.value }))}
            placeholder="e.g., example.com"
          />
          <Input
            type="text"
            placeholder="Search domains..."
            value={domainSearchTerm}
            onChange={(e) => setDomainSearchTerm(e.target.value)}
            className="w-1/3"
          />
        </div>
        {domainSearchTerm && (
          <div className="mt-2 p-2 border rounded-md max-h-32 overflow-y-auto">
            {filteredDomains.map(domain => (
              <div
                key={domain}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  setFormData(prev => ({ ...prev, domain_associated: domain }));
                  setDomainSearchTerm("");
                }}
              >
                {domain}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active Project</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Project</Button>
      </div>
    </form>
  );
};

export default ProjectEditForm;
