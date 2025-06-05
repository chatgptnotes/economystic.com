
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TotalCalls from "./pages/TotalCalls";
import AmbulanceBookings from "./pages/AmbulanceBookings";
import NewPatients from "./pages/NewPatients";
import AppointmentsScheduled from "./pages/AppointmentsScheduled";
import WhatsAppResponses from "./pages/WhatsAppResponses";
import FollowUpCalls from "./pages/FollowUpCalls";
import ReportsPage from "./pages/ReportsPage";
import DataTables from "./pages/DataTables";
import SocialMediaManagement from "./pages/SocialMediaManagement";
import DomainManagement from "./pages/DomainManagement";
import ProjectManagement from "./pages/ProjectManagement";
import PromptManagement from "./pages/PromptManagement";
import IntelligentSearchPage from "./pages/IntelligentSearch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/intelligent-search" element={<ProtectedRoute><IntelligentSearchPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/data-tables" element={<ProtectedRoute><DataTables /></ProtectedRoute>} />
          <Route path="/total-calls" element={<ProtectedRoute><TotalCalls /></ProtectedRoute>} />
          <Route path="/ambulance-bookings" element={<ProtectedRoute><AmbulanceBookings /></ProtectedRoute>} />
          <Route path="/new-patients" element={<ProtectedRoute><NewPatients /></ProtectedRoute>} />
          <Route path="/appointments-scheduled" element={<ProtectedRoute><AppointmentsScheduled /></ProtectedRoute>} />
          <Route path="/whatsapp-responses" element={<ProtectedRoute><WhatsAppResponses /></ProtectedRoute>} />
          <Route path="/follow-up-calls" element={<ProtectedRoute><FollowUpCalls /></ProtectedRoute>} />
          <Route path="/social-media" element={<ProtectedRoute><SocialMediaManagement /></ProtectedRoute>} />
          <Route path="/domain-management" element={<ProtectedRoute><DomainManagement /></ProtectedRoute>} />
          <Route path="/project-management" element={<ProtectedRoute><ProjectManagement /></ProtectedRoute>} />
          <Route path="/prompt-management" element={<ProtectedRoute><PromptManagement /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
