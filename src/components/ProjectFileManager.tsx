
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectFile {
  id: string;
  name: string;
  type: 'masterplan' | 'agents' | 'other';
  url: string;
  description?: string;
  addedAt: string;
}

interface ProjectFileManagerProps {
  projectId: string;
  projectName: string;
}

const ProjectFileManager = ({ projectId, projectName }: ProjectFileManagerProps) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFile, setNewFile] = useState({
    name: '',
    type: 'masterplan' as const,
    url: '',
    description: ''
  });
  const { toast } = useToast();

  const addFile = () => {
    if (!newFile.name.trim() || !newFile.url.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate Google Docs URL
    if (!newFile.url.includes('docs.google.com')) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid Google Docs URL",
        variant: "destructive"
      });
      return;
    }

    const file: ProjectFile = {
      id: Date.now().toString(),
      ...newFile,
      addedAt: new Date().toISOString()
    };

    setFiles(prev => [...prev, file]);
    setNewFile({ name: '', type: 'masterplan', url: '', description: '' });
    setIsDialogOpen(false);

    toast({
      title: "File Added",
      description: `${file.name} has been attached to ${projectName}`,
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been removed from the project",
    });
  };

  const getFileTypeColor = (type: string) => {
    const colors = {
      'masterplan': 'bg-blue-100 text-blue-800',
      'agents': 'bg-green-100 text-green-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getFileTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Project Documents</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Project Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileName">Document Name</Label>
                  <Input
                    id="fileName"
                    placeholder="e.g., Project Masterplan"
                    value={newFile.name}
                    onChange={(e) => setNewFile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fileType">Document Type</Label>
                  <select
                    id="fileType"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newFile.type}
                    onChange={(e) => setNewFile(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="masterplan">Masterplan.md</option>
                    <option value="agents">Agents.md</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="fileUrl">Google Docs URL</Label>
                  <Input
                    id="fileUrl"
                    placeholder="https://docs.google.com/document/d/..."
                    value={newFile.url}
                    onChange={(e) => setNewFile(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="fileDescription">Description (Optional)</Label>
                  <Textarea
                    id="fileDescription"
                    placeholder="Brief description of the document..."
                    value={newFile.description}
                    onChange={(e) => setNewFile(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addFile}>
                    Add Document
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No documents attached yet</p>
            <p className="text-sm">Add Google Docs files like masterplan.md or agents.md</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileTypeIcon(file.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{file.name}</span>
                      <Badge className={getFileTypeColor(file.type)}>
                        {file.type}
                      </Badge>
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Added {new Date(file.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFileManager;
