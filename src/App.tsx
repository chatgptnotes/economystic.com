
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/data-tables" element={<DataTables />} />
          <Route path="/total-calls" element={<TotalCalls />} />
          <Route path="/ambulance-bookings" element={<AmbulanceBookings />} />
          <Route path="/new-patients" element={<NewPatients />} />
          <Route path="/appointments-scheduled" element={<AppointmentsScheduled />} />
          <Route path="/whatsapp-responses" element={<WhatsAppResponses />} />
          <Route path="/follow-up-calls" element={<FollowUpCalls />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
