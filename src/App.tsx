import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
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



const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Public pages - accessible without authentication */}
            <Route path="/" element={<Landing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Login page */}
            <Route
              path="/login"
              element={
                <SignIn
                  redirectUrl="/dashboard"
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

            {/* Protected routes - require authentication */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Index />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/intelligent-search"
              element={
                <>
                  <SignedIn>
                    <IntelligentSearchPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/reports"
              element={
                <>
                  <SignedIn>
                    <ReportsPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/data-tables"
              element={
                <>
                  <SignedIn>
                    <DataTables />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/audit"
              element={
                <>
                  <SignedIn>
                    <AuditPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/total-calls"
              element={
                <>
                  <SignedIn>
                    <TotalCalls />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/ambulance-bookings"
              element={
                <>
                  <SignedIn>
                    <AmbulanceBookings />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/new-patients"
              element={
                <>
                  <SignedIn>
                    <NewPatients />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/appointments-scheduled"
              element={
                <>
                  <SignedIn>
                    <AppointmentsScheduled />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/whatsapp-responses"
              element={
                <>
                  <SignedIn>
                    <WhatsAppResponses />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/follow-up-calls"
              element={
                <>
                  <SignedIn>
                    <FollowUpCalls />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/social-media"
              element={
                <>
                  <SignedIn>
                    <SocialMediaManagement />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/domain-management"
              element={
                <>
                  <SignedIn>
                    <DomainManagement />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/project-management"
              element={
                <>
                  <SignedIn>
                    <ProjectManagement />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/prompt-management"
              element={
                <>
                  <SignedIn>
                    <PromptManagement />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
