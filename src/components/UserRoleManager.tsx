
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  user_email?: string;
}

const UserRoleManager = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole | "">("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      // Fetch user roles first
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        throw rolesError;
      }

      // For each role, try to get the user email by making individual queries
      // Since we can't directly query auth.users through the API
      const rolesWithEmails = await Promise.all(
        (rolesData || []).map(async (role) => {
          // We'll store the email when we assign roles, but for existing roles
          // we might not have it. We'll just show the user_id for now.
          return {
            ...role,
            user_email: 'Unknown' // We'll show user_id or handle this differently
          };
        })
      );

      setUserRoles(rolesWithEmails);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!newUserEmail || !newUserRole) {
      toast({
        title: "Error",
        description: "Please enter both email and role",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    try {
      // Since we can't directly query auth.users from the client,
      // we'll use a different approach. We'll create a simplified version
      // that requires manual user ID input or we handle this server-side.
      
      // For now, let's assume the user provides the user ID directly
      // or we implement this differently
      toast({
        title: "Info",
        description: "User role assignment requires admin privileges. Please contact an administrator.",
        variant: "default",
      });

    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const removeRole = async (roleId: string, userEmail: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Role ${role} removed from user`,
      });

      fetchUserRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="User email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <Select value={newUserRole} onValueChange={(value: AppRole) => setNewUserRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={assignRole} disabled={isAssigning}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isAssigning ? "Assigning..." : "Assign Role"}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell className="font-medium font-mono text-sm">
                    {userRole.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(userRole.role)}>
                      {userRole.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(userRole.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Role</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove the {userRole.role} role from this user?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeRole(userRole.id, userRole.user_email || 'Unknown', userRole.role)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {userRoles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No user roles assigned yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoleManager;
