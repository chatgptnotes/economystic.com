
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

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
    assignedTo: project.assignedTo,
    platform: project.platform,
    domainAssociated: project.domainAssociated || '',
    githubUrl: project.githubUrl
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
      domainAssociated: formData.domainAssociated || undefined,
      lastUpdated: 'just now'
    };

    onSave(updatedProject);
    
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TypeScript">TypeScript</SelectItem>
              <SelectItem value="JavaScript">JavaScript</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="Java">Java</SelectItem>
              <SelectItem value="PHP">PHP</SelectItem>
              <SelectItem value="HTML">HTML</SelectItem>
              <SelectItem value="CSS">CSS</SelectItem>
              <SelectItem value="Swift">Swift</SelectItem>
              <SelectItem value="Kotlin">Kotlin</SelectItem>
              <SelectItem value="Blade">Blade</SelectItem>
              <SelectItem value="EJS">EJS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
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
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map(member => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lovable">Lovable</SelectItem>
              <SelectItem value="Cursor">Cursor</SelectItem>
              <SelectItem value="V0">V0</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="domainAssociated">Associated Domain</Label>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search domains..."
                value={domainSearchTerm}
                onChange={(e) => setDomainSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select 
              value={formData.domainAssociated} 
              onValueChange={(value) => handleInputChange('domainAssociated', value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a domain">
                  {formData.domainAssociated || "No domain selected"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="none">
                  <span className="text-gray-500">No domain</span>
                </SelectItem>
                {filteredDomains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
                {filteredDomains.length === 0 && domainSearchTerm && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No domains found matching "{domainSearchTerm}"
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          value={formData.githubUrl}
          onChange={(e) => handleInputChange('githubUrl', e.target.value)}
          placeholder="https://github.com/username/repo"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProjectEditForm;
