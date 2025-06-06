
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
import PromptManager from "@/components/PromptManager";
import TelecomManager from "@/components/TelecomManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, MessageSquare, BarChart3, Share2, Globe, FolderGit2, FileText, Wifi } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Welcome to Your Analytics Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Comprehensive healthcare management and analytics platform
            </p>
          </div>
        </div>

        <DashboardStats />
        
        <div className="mt-12">
          <Tabs defaultValue="projects" className="w-full">
            <div className="mb-8">
              <TabsList className="grid w-full grid-cols-9 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-2 h-auto">
                <TabsTrigger 
                  value="projects" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <FolderGit2 className="h-5 w-5" />
                  <span className="text-xs font-medium">Project Manager</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="calls" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-xs font-medium">Call Management</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="patients" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-medium">Patient Database</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="whatsapp" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs font-medium">WhatsApp Tracker</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="telecom" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Wifi className="h-5 w-5" />
                  <span className="text-xs font-medium">Telecom Infrastructure</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs font-medium">Social Media</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="domains" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-xs font-medium">Domain Manager</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="prompts" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium">Prompts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex flex-col items-center space-y-2 py-4 px-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs font-medium">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8">
              <TabsContent value="projects" className="mt-0">
                <ProjectManager />
              </TabsContent>
              
              <TabsContent value="calls" className="mt-0">
                <CallManager />
              </TabsContent>
              
              <TabsContent value="patients" className="mt-0">
                <PatientDatabase />
              </TabsContent>
              
              <TabsContent value="whatsapp" className="mt-0">
                <WhatsAppTracker />
              </TabsContent>
              
              <TabsContent value="telecom" className="mt-0">
                <TelecomManager />
              </TabsContent>
              
              <TabsContent value="social" className="mt-0">
                <SocialMediaDashboard />
              </TabsContent>
              
              <TabsContent value="domains" className="mt-0">
                <DomainManager />
              </TabsContent>
              
              <TabsContent value="prompts" className="mt-0">
                <PromptManager />
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                <AnalyticsDashboard />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
