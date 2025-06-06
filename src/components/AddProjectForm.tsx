import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

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

interface AddProjectFormProps {
  teamMembers: string[];
  onSave: (project: Omit<Project, 'id' | 'last_updated'>) => void;
  onCancel: () => void;
}

const AddProjectForm = ({ teamMembers, onSave, onCancel }: AddProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    visibility: 'Private' as 'Public' | 'Private',
    assigned_to: 'Unassigned',
    platform: 'Unknown' as 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown',
    github_url: '',
    is_active: true,
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    domain_associated: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.language.trim()) {
      newErrors.language = 'Language is required';
    }

    if (!formData.github_url.trim()) {
      newErrors.github_url = 'GitHub URL is required';
    } else if (!formData.github_url.includes('github.com')) {
      newErrors.github_url = 'Please enter a valid GitHub URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const projectData = {
      ...formData,
      domain_associated: formData.domain_associated || undefined
    };

    onSave(projectData);
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
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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
          className={errors.language ? "border-red-500" : ""}
        />
        {errors.language && <p className="text-sm text-red-500 mt-1">{errors.language}</p>}
      </div>

      <div>
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input
          id="github_url"
          value={formData.github_url}
          onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
          placeholder="https://github.com/username/repo"
          className={errors.github_url ? "border-red-500" : ""}
        />
        {errors.github_url && <p className="text-sm text-red-500 mt-1">{errors.github_url}</p>}
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
        <Label htmlFor="domain_associated">Associated Domain</Label>
        <Input
          id="domain_associated"
          value={formData.domain_associated}
          onChange={(e) => setFormData(prev => ({ ...prev, domain_associated: e.target.value }))}
          placeholder="e.g., example.com"
        />
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
        <Button type="submit">Add Project</Button>
      </div>
    </form>
  );
};

export default AddProjectForm;
