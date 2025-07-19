
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Startups from "./pages/Startups";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectEdit from "./pages/ProjectEdit";
import StartupDetail from "./pages/StartupDetail";
import StartupEdit from "./pages/StartupEdit";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Projects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startups" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Startups />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Feed />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Community />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:id" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:id" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <ProjectDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:id/edit" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <ProjectEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startups/:id" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <StartupDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startups/:id/edit" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <StartupEdit />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
