import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
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
import AuditPage from "./pages/AuditPage";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { SignIn } from '@clerk/clerk-react';

const queryClient = new QueryClient();

const clerkPublishableKey = 'pk_test_ZGVlcC1yaGluby0yOC5jbGVyay5hY2NvdW50cy5kZXYk';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Index />} />
      <Route path="/intelligent-search" element={<IntelligentSearchPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/data-tables" element={<DataTables />} />
      <Route path="/audit" element={<AuditPage />} />
      <Route path="/total-calls" element={<TotalCalls />} />
      <Route path="/ambulance-bookings" element={<AmbulanceBookings />} />
      <Route path="/new-patients" element={<NewPatients />} />
      <Route path="/appointments-scheduled" element={<AppointmentsScheduled />} />
      <Route path="/whatsapp-responses" element={<WhatsAppResponses />} />
      <Route path="/follow-up-calls" element={<FollowUpCalls />} />
      <Route path="/social-media" element={<SocialMediaManagement />} />
      <Route path="/domain-management" element={<DomainManagement />} />
      <Route path="/project-management" element={<ProjectManagement />} />
      <Route path="/prompt-management" element={<PromptManagement />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route
              path="/login"
              element={
                <SignIn
                  appearance={{
                    elements: {
                      card: "rounded-2xl shadow-2xl border border-blue-200 bg-white/80",
                      headerTitle: "text-3xl font-bold text-blue-700",
                      socialButtonsBlockButton: "rounded-lg bg-blue-600 text-white hover:bg-blue-700",
                      formButtonPrimary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg",
                      footer: "text-xs text-gray-400",
                    },
                    variables: {
                      colorPrimary: "#6366f1",
                      colorText: "#1e293b",
                      fontFamily: "Inter, sans-serif",
                      borderRadius: "1rem",
                    },
                  }}
                />
              }
            />
            <Route
              path="*"
              element={
                <>
                  <SignedIn>
                    <AppRoutes />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
