
import { useState } from "react";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import CallManager from "@/components/CallManager";
import WhatsAppTracker from "@/components/WhatsAppTracker";
import PatientDatabase from "@/components/PatientDatabase";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import SocialMediaDashboard from "@/components/SocialMediaDashboard";
import DomainManager from "@/components/DomainManager";
import ProjectManager from "@/components/ProjectManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, MessageSquare, BarChart3, Share2, Globe, FolderGit2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-6">
        <DashboardStats />
        
        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="calls" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Call Management</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Patient Database</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Social Media</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Domain Manager</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <FolderGit2 className="h-4 w-4" />
              <span>Project Manager</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calls">
            <CallManager />
          </TabsContent>
          
          <TabsContent value="patients">
            <PatientDatabase />
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <WhatsAppTracker />
          </TabsContent>
          
          <TabsContent value="social">
            <SocialMediaDashboard />
          </TabsContent>
          
          <TabsContent value="domains">
            <DomainManager />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
