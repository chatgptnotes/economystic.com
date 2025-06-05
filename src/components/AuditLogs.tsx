
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Search, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AuditOperation = Database["public"]["Enums"]["audit_operation"];

interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  operation: AuditOperation;
  old_values: any;
  new_values: any;
  changed_fields: string[];
  user_email: string;
  created_at: string;
}

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
  }, [tableFilter, operationFilter]);

  const fetchAuditLogs = async () => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (tableFilter !== 'all') {
        query = query.eq('table_name', tableFilter);
      }

      if (operationFilter !== 'all') {
        query = query.eq('operation', operationFilter as AuditOperation);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) =>
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.record_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOperationBadgeColor = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLogs = () => {
    const csvData = filteredLogs.map(log => ({
      timestamp: format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
      user: log.user_email,
      table: log.table_name,
      operation: log.operation,
      record_id: log.record_id,
      changed_fields: log.changed_fields?.join(', ') || '',
    }));

    const headers = ['Timestamp', 'User', 'Table', 'Operation', 'Record ID', 'Changed Fields'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
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
        <CardTitle className="flex items-center justify-between">
          Audit Logs
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user, table, or record ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={tableFilter} onValueChange={setTableFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tables</SelectItem>
              <SelectItem value="call_records">Call Records</SelectItem>
              <SelectItem value="ambulance_bookings">Ambulance Bookings</SelectItem>
              <SelectItem value="whatsapp_messages">WhatsApp Messages</SelectItem>
              <SelectItem value="patient_events">Patient Events</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
              <SelectItem value="social_media_posts">Social Media Posts</SelectItem>
              <SelectItem value="content_calendar">Content Calendar</SelectItem>
              <SelectItem value="telecom_services">Telecom Services</SelectItem>
              <SelectItem value="platform_credentials">Platform Credentials</SelectItem>
              <SelectItem value="prompts">Prompts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={operationFilter} onValueChange={setOperationFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="INSERT">Insert</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Record ID</TableHead>
                <TableHead>Changed Fields</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.user_email || 'System'}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {log.table_name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getOperationBadgeColor(log.operation)}>
                      {log.operation}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    {log.record_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.changed_fields?.join(', ') || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No audit logs found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
