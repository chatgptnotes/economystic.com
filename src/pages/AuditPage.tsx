
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AuditLogs from "@/components/AuditLogs";
import UserRoleManager from "@/components/UserRoleManager";
import { Shield, History } from "lucide-react";

const AuditPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Audit & Access Control
          </h1>
          <p className="text-gray-600">
            Monitor data changes and manage user permissions
          </p>
        </div>

        <Tabs defaultValue="audit-logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="audit-logs" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Audit Logs</span>
            </TabsTrigger>
            <TabsTrigger value="user-roles" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>User Roles</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit-logs">
            <AuditLogs />
          </TabsContent>

          <TabsContent value="user-roles">
            <UserRoleManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditPage;
