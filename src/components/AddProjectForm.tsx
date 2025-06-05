
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
  lastUpdated: string;
  assignedTo: string;
  platform: 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown';
  domainAssociated?: string;
  githubUrl: string;
  isActive: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

interface AddProjectFormProps {
  teamMembers: string[];
  onSave: (project: Omit<Project, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const AddProjectForm = ({ teamMembers, onSave, onCancel }: AddProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    visibility: 'Private' as 'Public' | 'Private',
    assignedTo: 'Unassigned',
    platform: 'Unknown' as 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown',
    githubUrl: '',
    isActive: true,
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    domainAssociated: ''
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

    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub URL is required';
    } else if (!formData.githubUrl.includes('github.com')) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
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
      domainAssociated: formData.domainAssociated || undefined
    };

    onSave(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Programming Language *</Label>
          <Input
            id="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            placeholder="e.g., TypeScript, JavaScript, Python"
            className={errors.language ? 'border-red-500' : ''}
          />
          {errors.language && <p className="text-sm text-red-600">{errors.language}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the project"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub URL *</Label>
        <Input
          id="githubUrl"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          placeholder="https://github.com/username/repository"
          className={errors.githubUrl ? 'border-red-500' : ''}
        />
        {errors.githubUrl && <p className="text-sm text-red-600">{errors.githubUrl}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select value={formData.visibility} onValueChange={(value: 'Public' | 'Private') => setFormData({ ...formData, visibility: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData({ ...formData, priority: value })}>
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

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={formData.platform} onValueChange={(value: 'Cursor' | 'Lovable' | 'V0' | 'Stitch' | 'Windsurf' | 'Clerk' | 'Codex' | 'Vercel' | 'Unknown') => setFormData({ ...formData, platform: value })}>
            <SelectTrigger>
              <SelectValue />
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assign To</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unassigned">Unassigned</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domainAssociated">Associated Domain (Optional)</Label>
          <Input
            id="domainAssociated"
            value={formData.domainAssociated}
            onChange={(e) => setFormData({ ...formData, domainAssociated: e.target.value })}
            placeholder="e.g., example.com"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active Project</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Project
        </Button>
      </div>
    </form>
  );
};

export default AddProjectForm;
